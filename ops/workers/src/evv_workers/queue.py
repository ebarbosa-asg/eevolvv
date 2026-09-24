from __future__ import annotations

import json
import signal
import time
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Any, cast
from uuid import UUID

from psycopg import Connection
from psycopg.types.json import Json

from evv_workers.redact import redact

# 30s * 2^n, capped at 1 hour. n is attempts-after-failure minus 1.
BACKOFF_BASE_S = 30
BACKOFF_CAP_S = 3600
STALE_LOCK_S = 15 * 60


def backoff_seconds(attempts_after_failure: int) -> int:
    if attempts_after_failure < 1:
        raise ValueError("attempts_after_failure starts at 1")
    # int ** int is Any in mypy because the exponent sign changes the type.
    shift = attempts_after_failure - 1
    delay = BACKOFF_BASE_S
    for _ in range(shift):
        delay *= 2
    if delay > BACKOFF_CAP_S:
        return BACKOFF_CAP_S
    return delay


@dataclass(frozen=True)
class Job:
    id: UUID
    kind: str
    payload: dict[str, Any]
    status: str
    idempotency_key: str
    attempts: int
    max_attempts: int
    run_after: datetime
    locked_at: datetime | None
    locked_by: str | None
    heartbeat_at: datetime | None
    last_error: str | None


def _job(row: dict[str, Any]) -> Job:
    payload = row["payload"]
    if isinstance(payload, str):
        parsed = json.loads(payload)
        if not isinstance(parsed, dict):
            raise TypeError("job payload must be an object")
        payload = parsed
    return Job(
        id=row["id"],
        kind=str(row["kind"]),
        payload=cast(dict[str, Any], payload),
        status=str(row["status"]),
        idempotency_key=str(row["idempotency_key"]),
        attempts=int(row["attempts"]),
        max_attempts=int(row["max_attempts"]),
        run_after=row["run_after"],
        locked_at=row["locked_at"],
        locked_by=row["locked_by"],
        heartbeat_at=row["heartbeat_at"],
        last_error=row["last_error"],
    )


class JobQueue:
    """Postgres queue. Claim uses FOR UPDATE SKIP LOCKED."""

    def __init__(self, conn: Connection[dict[str, Any]]) -> None:
        self.conn = conn

    def enqueue(
        self,
        kind: str,
        payload: dict[str, Any],
        idempotency_key: str,
        max_attempts: int = 5,
    ) -> Job:
        with self.conn.transaction():
            row = self.conn.execute(
                """
                INSERT INTO jobs (kind, payload, idempotency_key, max_attempts)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (idempotency_key) DO NOTHING
                RETURNING *
                """,
                (kind, Json(payload), idempotency_key, max_attempts),
            ).fetchone()
            if row is None:
                row = self.conn.execute(
                    "SELECT * FROM jobs WHERE idempotency_key = %s",
                    (idempotency_key,),
                ).fetchone()
            if row is None:
                raise RuntimeError("enqueue did not return a job")
            return _job(row)

    def claim(self, worker_id: str) -> Job | None:
        with self.conn.transaction():
            row = self.conn.execute(
                """
                WITH candidate AS (
                  SELECT id
                  FROM jobs
                  WHERE status = 'pending' AND run_after <= now()
                  ORDER BY created_at, id
                  FOR UPDATE SKIP LOCKED
                  LIMIT 1
                )
                UPDATE jobs AS j
                SET status = 'running',
                    locked_at = now(),
                    locked_by = %s,
                    heartbeat_at = now()
                FROM candidate
                WHERE j.id = candidate.id
                RETURNING j.*
                """,
                (worker_id,),
            ).fetchone()
        if row is None:
            return None
        return _job(row)

    def heartbeat(self, job_id: UUID, worker_id: str) -> None:
        with self.conn.transaction():
            self.conn.execute(
                """
                UPDATE jobs
                SET heartbeat_at = now()
                WHERE id = %s AND locked_by = %s AND status = 'running'
                """,
                (job_id, worker_id),
            )

    def succeed(self, job_id: UUID) -> None:
        with self.conn.transaction():
            self.conn.execute(
                """
                UPDATE jobs
                SET status = 'succeeded',
                    locked_at = NULL,
                    locked_by = NULL,
                    finished_at = now()
                WHERE id = %s AND status = 'running'
                """,
                (job_id,),
            )

    def fail(self, job_id: UUID, error: BaseException | str) -> None:
        message = redact(str(error))[:500]
        with self.conn.transaction():
            row = self.conn.execute(
                "SELECT attempts, max_attempts FROM jobs WHERE id = %s FOR UPDATE",
                (job_id,),
            ).fetchone()
            if row is None:
                raise KeyError(job_id)
            attempts = int(row["attempts"]) + 1
            max_attempts = int(row["max_attempts"])
            if attempts >= max_attempts:
                self.conn.execute(
                    """
                    UPDATE jobs
                    SET status = 'dead',
                        attempts = %s,
                        last_error = %s,
                        locked_at = NULL,
                        locked_by = NULL,
                        heartbeat_at = NULL,
                        finished_at = now()
                    WHERE id = %s
                    """,
                    (max_attempts if attempts > max_attempts else attempts, message, job_id),
                )
                self.conn.execute(
                    "INSERT INTO alerts (kind, job_id, message) VALUES ('job_dead', %s, %s)",
                    (job_id, message),
                )
            else:
                delay = backoff_seconds(attempts)
                self.conn.execute(
                    """
                    UPDATE jobs
                    SET status = 'pending',
                        attempts = %s,
                        last_error = %s,
                        locked_at = NULL,
                        locked_by = NULL,
                        heartbeat_at = NULL,
                        run_after = now() + make_interval(secs => %s)
                    WHERE id = %s
                    """,
                    (attempts, message, delay, job_id),
                )

    def reclaim_stale(self, stale_after_s: int = STALE_LOCK_S) -> int:
        """Return locks with no heartbeat for stale_after_s back to pending.

        The attempt counter increments. At max_attempts the job is dead-lettered
        and an alert row is written.
        """
        with self.conn.transaction():
            rows = self.conn.execute(
                """
                SELECT id, attempts, max_attempts
                FROM jobs
                WHERE status = 'running'
                  AND COALESCE(heartbeat_at, locked_at)
                      < now() - make_interval(secs => %s)
                FOR UPDATE
                """,
                (stale_after_s,),
            ).fetchall()
            for row in rows:
                attempts = int(row["attempts"]) + 1
                max_attempts = int(row["max_attempts"])
                if attempts >= max_attempts:
                    self.conn.execute(
                        """
                        UPDATE jobs
                        SET status = 'dead',
                            attempts = %s,
                            last_error = 'stale lock reclaimed',
                            locked_at = NULL,
                            locked_by = NULL,
                            heartbeat_at = NULL,
                            finished_at = now()
                        WHERE id = %s
                        """,
                        (min(attempts, max_attempts), row["id"]),
                    )
                    self.conn.execute(
                        """
                        INSERT INTO alerts (kind, job_id, message)
                        VALUES ('job_dead', %s, 'stale lock reclaimed')
                        """,
                        (row["id"],),
                    )
                else:
                    self.conn.execute(
                        """
                        UPDATE jobs
                        SET status = 'pending',
                            attempts = %s,
                            locked_at = NULL,
                            locked_by = NULL,
                            heartbeat_at = NULL,
                            run_after = now()
                        WHERE id = %s
                        """,
                        (attempts, row["id"]),
                    )
            return len(rows)

    def counts(self) -> tuple[int, int]:
        row = self.conn.execute(
            """
            SELECT
              count(*) FILTER (WHERE status = 'pending') AS pending,
              count(*) FILTER (WHERE status = 'running') AS running
            FROM jobs
            """
        ).fetchone()
        if row is None:
            return (0, 0)
        return (int(row["pending"]), int(row["running"]))


class Worker:
    def __init__(
        self,
        queue: JobQueue,
        handler: Callable[[Job], None],
        worker_id: str,
    ) -> None:
        self.queue = queue
        self.handler = handler
        self.worker_id = worker_id
        self._stop = False

    def request_stop(self) -> None:
        self._stop = True

    def install_sigterm(self) -> None:
        signal.signal(signal.SIGTERM, lambda _signum, _frame: self.request_stop())

    def serve(self, *, poll_s: float = 0.2, drain: bool = False) -> None:
        """Process jobs until stop is requested.

        drain=True also returns once the queue has no pending or running jobs.
        SIGTERM sets the stop flag; the current job finishes, then the loop exits.
        """
        empty = 0
        while not self._stop:
            job = self.queue.claim(self.worker_id)
            if job is None:
                empty += 1
                if drain and empty >= 5:
                    pending, running = self.queue.counts()
                    if pending == 0 and running == 0:
                        return
                time.sleep(poll_s)
                continue
            empty = 0
            try:
                self.handler(job)
            except Exception as exc:
                self.queue.fail(job.id, exc)
            else:
                self.queue.succeed(job.id)
            if self._stop:
                return

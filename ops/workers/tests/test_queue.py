from __future__ import annotations

import signal
import threading
from datetime import timedelta
from typing import Any

import psycopg
from psycopg.rows import dict_row

from evv_workers.queue import Job, JobQueue, Worker, backoff_seconds


def test_backoff_schedule() -> None:
    assert backoff_seconds(1) == 30
    assert backoff_seconds(2) == 60
    assert backoff_seconds(3) == 120
    assert backoff_seconds(7) == 1920
    assert backoff_seconds(8) == 3600
    assert backoff_seconds(12) == 3600


def test_duplicate_idempotency_key_returns_existing(conn: psycopg.Connection[dict[str, Any]]) -> None:
    queue = JobQueue(conn)
    first = queue.enqueue("transcribe", {"n": 1}, "same-key")
    second = queue.enqueue("transcribe", {"n": 2}, "same-key")
    assert first.id == second.id
    assert second.payload == {"n": 1}
    count = conn.execute("SELECT count(*) AS n FROM jobs").fetchone()
    assert count is not None
    assert count["n"] == 1


def test_fail_retries_then_dead_letters(conn: psycopg.Connection[dict[str, Any]]) -> None:
    queue = JobQueue(conn)
    job = queue.enqueue("render", {}, "retry-me", max_attempts=2)
    claimed = queue.claim("worker-a")
    assert claimed is not None
    queue.fail(claimed.id, "boom sk-ant-secretvalue")
    row = conn.execute("SELECT status, attempts, last_error, run_after FROM jobs WHERE id = %s", (job.id,)).fetchone()
    assert row is not None
    assert row["status"] == "pending"
    assert row["attempts"] == 1
    assert "sk-ant-secretvalue" not in str(row["last_error"])
    assert "[redacted]" in str(row["last_error"])
    delta = row["run_after"] - conn.execute("SELECT now() AS now").fetchone()["now"]
    assert timedelta(seconds=25) <= delta <= timedelta(seconds=35)
    assert queue.claim("worker-b") is None
    conn.execute("UPDATE jobs SET run_after = now() WHERE id = %s", (job.id,))
    conn.commit()
    again = queue.claim("worker-b")
    assert again is not None
    queue.fail(again.id, "still broken")
    dead = conn.execute("SELECT status FROM jobs WHERE id = %s", (job.id,)).fetchone()
    alerts = conn.execute(
        "SELECT count(*) AS n FROM alerts WHERE job_id = %s AND kind = 'job_dead'",
        (job.id,),
    ).fetchone()
    assert dead is not None and dead["status"] == "dead"
    assert alerts is not None and alerts["n"] == 1
    assert queue.claim("worker-c") is None


def test_heartbeat_blocks_stale_reclaim(conn: psycopg.Connection[dict[str, Any]]) -> None:
    queue = JobQueue(conn)
    job = queue.enqueue("probe", {}, "heart")
    claimed = queue.claim("worker-a")
    assert claimed is not None
    queue.heartbeat(claimed.id, "worker-a")
    conn.execute(
        """
        UPDATE jobs
        SET locked_at = now() - interval '20 minutes',
            heartbeat_at = now() - interval '1 minute'
        WHERE id = %s
        """,
        (job.id,),
    )
    conn.commit()
    assert queue.reclaim_stale() == 0
    conn.execute(
        """
        UPDATE jobs
        SET heartbeat_at = now() - interval '16 minutes',
            locked_at = now() - interval '16 minutes'
        WHERE id = %s
        """,
        (job.id,),
    )
    conn.commit()
    assert queue.reclaim_stale() == 1
    row = conn.execute("SELECT status, attempts, locked_by FROM jobs WHERE id = %s", (job.id,)).fetchone()
    assert row is not None
    assert row["status"] == "pending"
    assert row["attempts"] == 1
    assert row["locked_by"] is None
    reclaimed = queue.claim("worker-b")
    assert reclaimed is not None and reclaimed.id == job.id


def test_reclaim_at_max_attempts_dead_letters(conn: psycopg.Connection[dict[str, Any]]) -> None:
    queue = JobQueue(conn)
    job = queue.enqueue("probe", {}, "stale-max", max_attempts=2)
    claimed = queue.claim("worker-a")
    assert claimed is not None
    conn.execute(
        """
        UPDATE jobs
        SET attempts = 1,
            heartbeat_at = now() - interval '16 minutes',
            locked_at = now() - interval '16 minutes'
        WHERE id = %s
        """,
        (job.id,),
    )
    conn.commit()
    assert queue.reclaim_stale() == 1
    row = conn.execute("SELECT status FROM jobs WHERE id = %s", (job.id,)).fetchone()
    assert row is not None and row["status"] == "dead"


def test_sigterm_finishes_current_job(database_url: str) -> None:
    with psycopg.connect(database_url, row_factory=dict_row) as setup:
        queue = JobQueue(setup)
        for index in range(3):
            queue.enqueue("noop", {}, f"sig-{index}")
    started = threading.Event()

    def handler(job: Job) -> None:
        started.set()

    with psycopg.connect(database_url, row_factory=dict_row) as connection:
        worker = Worker(JobQueue(connection), handler, "sig")
        previous = signal.getsignal(signal.SIGTERM)
        worker.install_sigterm()

        def stop_after_start() -> None:
            assert started.wait(5)
            signal.raise_signal(signal.SIGTERM)

        threading.Thread(target=stop_after_start, daemon=True).start()
        try:
            worker.serve(poll_s=0.01, drain=False)
        finally:
            signal.signal(signal.SIGTERM, previous)
    with psycopg.connect(database_url, row_factory=dict_row) as check:
        row = check.execute(
            "SELECT count(*) AS n FROM jobs WHERE status = 'succeeded' AND idempotency_key LIKE 'sig-%'"
        ).fetchone()
    assert row is not None
    assert row["n"] == 1


def test_four_workers_process_two_hundred_jobs_each(database_url: str) -> None:
    total = 4 * 200
    with psycopg.connect(database_url, autocommit=True) as setup:
        setup.execute("CREATE TABLE IF NOT EXISTS test_processed (job_id uuid PRIMARY KEY)")
        setup.execute("TRUNCATE test_processed, jobs, alerts CASCADE")
    with psycopg.connect(database_url, row_factory=dict_row) as setup:
        queue = JobQueue(setup)
        for index in range(total):
            queue.enqueue("touch", {"i": index}, f"bulk-{index}")
    errors: list[BaseException] = []

    def run(worker_id: str) -> None:
        try:
            with psycopg.connect(database_url, row_factory=dict_row) as connection:
                def handle(job: Job) -> None:
                    with psycopg.connect(database_url, autocommit=True) as writer:
                        writer.execute(
                            "INSERT INTO test_processed (job_id) VALUES (%s)",
                            (job.id,),
                        )

                Worker(JobQueue(connection), handle, worker_id).serve(poll_s=0.001, drain=True)
        except BaseException as exc:  # noqa: BLE001 — surfaced to the asserting thread
            errors.append(exc)

    threads = [threading.Thread(target=run, args=(f"w{index}",)) for index in range(4)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=90)
    assert errors == []
    assert not any(thread.is_alive() for thread in threads)
    with psycopg.connect(database_url, row_factory=dict_row) as check:
        processed = check.execute("SELECT count(*) AS n FROM test_processed").fetchone()
        succeeded = check.execute(
            "SELECT count(*) AS n FROM jobs WHERE status = 'succeeded' AND idempotency_key LIKE 'bulk-%'"
        ).fetchone()
    assert processed is not None and processed["n"] == total
    assert succeeded is not None and succeeded["n"] == total


"""Provider-agnostic posting. Dry-run is the default. No network calls."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol
from uuid import UUID

from psycopg import Connection


class DryRunComplete(Exception):
    """Raised inside a transaction so the gate probe rolls back."""


@dataclass(frozen=True)
class PublishRequest:
    post_id: UUID
    clip_id: UUID
    idempotency_key: str


@dataclass(frozen=True)
class PublishResult:
    provider_post_id: str | None
    dry_run: bool


class PostProvider(Protocol):
    def publish(self, request: PublishRequest) -> str: ...


class MockProvider:
    """In-memory provider. A repeated idempotency key does not create a second post."""

    def __init__(self) -> None:
        self.calls: list[str] = []
        self._ids: dict[str, str] = {}

    def publish(self, request: PublishRequest) -> str:
        existing = self._ids.get(request.idempotency_key)
        if existing is not None:
            return existing
        self.calls.append(request.idempotency_key)
        issued = f"mock:{request.idempotency_key}"
        self._ids[request.idempotency_key] = issued
        return issued


class PostingService:
    def __init__(
        self,
        conn: Connection[dict[str, Any]],
        provider: PostProvider,
        *,
        dry_run: bool = True,
    ) -> None:
        self.conn = conn
        self.provider = provider
        self.dry_run = dry_run

    def publish(self, post_id: UUID) -> PublishResult:
        row = self._load(post_id)
        existing = row["platform_post_id"]
        if isinstance(existing, str) and existing:
            return PublishResult(existing, dry_run=False)
        if self.dry_run:
            self._probe_gate(post_id)
            return PublishResult(None, dry_run=True)
        request = PublishRequest(
            post_id=post_id,
            clip_id=row["clip_id"],
            idempotency_key=f"post:{post_id}",
        )
        with self.conn.transaction():
            if row["status"] != "publishing":
                self.conn.execute(
                    "UPDATE posts SET status = 'publishing' WHERE id = %s",
                    (post_id,),
                )
            provider_post_id = self.provider.publish(request)
            self.conn.execute(
                """
                UPDATE posts
                SET platform_post_id = %s, status = 'published', published_at = now()
                WHERE id = %s
                """,
                (provider_post_id, post_id),
            )
        return PublishResult(provider_post_id, dry_run=False)

    def _load(self, post_id: UUID) -> dict[str, Any]:
        row = self.conn.execute("SELECT * FROM posts WHERE id = %s", (post_id,)).fetchone()
        if row is None:
            raise KeyError(post_id)
        return row

    def _probe_gate(self, post_id: UUID) -> None:
        try:
            with self.conn.transaction():
                self.conn.execute(
                    "UPDATE posts SET status = 'publishing' WHERE id = %s",
                    (post_id,),
                )
                raise DryRunComplete()
        except DryRunComplete:
            return

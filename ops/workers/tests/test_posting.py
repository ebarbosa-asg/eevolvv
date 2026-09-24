from __future__ import annotations

from typing import Any
from uuid import uuid4

import psycopg
import pytest

from evv_workers.posting import MockProvider, PostingService, PublishRequest


def _seed_post(conn: psycopg.Connection[dict[str, Any]]) -> dict[str, Any]:
    client_id = uuid4()
    operator_id = uuid4()
    member_id = uuid4()
    clip_id = uuid4()
    with conn.transaction():
        conn.execute("INSERT INTO operators (user_id) VALUES (%s)", (operator_id,))
        conn.execute(
            "INSERT INTO clients (id, name) VALUES (%s, 'post client')",
            (client_id,),
        )
        conn.execute(
            """
            INSERT INTO source_assets (
              client_id, sha256, storage_key, has_video, rights_confirmed_at, rights_confirmed_by
            ) VALUES (%s, %s, 'sources/post', true, now(), %s)
            """,
            (client_id, uuid4().hex + uuid4().hex, member_id),
        )
        asset_id = conn.execute(
            "SELECT id FROM source_assets WHERE client_id = %s",
            (client_id,),
        ).fetchone()
        assert asset_id is not None
        batch = conn.execute(
            """
            INSERT INTO batches (client_id, source_asset_id)
            VALUES (%s, %s) RETURNING id
            """,
            (client_id, asset_id["id"]),
        ).fetchone()
        assert batch is not None
        conn.execute(
            """
            INSERT INTO clips (id, batch_id, status, qa_run)
            VALUES (%s, %s, 'needs_review', 1)
            """,
            (clip_id, batch["id"]),
        )
        conn.execute(
            """
            INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status)
            VALUES (%s, 1, 'B1', true, 'pass')
            """,
            (clip_id,),
        )
        conn.execute(
            """
            INSERT INTO approvals (clip_id, decision, decided_by, actor_role)
            VALUES (%s, 'approve', %s, 'operator')
            """,
            (clip_id, operator_id),
        )
        link = conn.execute(
            """
            INSERT INTO approval_links (client_id, batch_id, token_hash, expires_at)
            VALUES (%s, %s, %s, now() + interval '1 day')
            RETURNING id
            """,
            (client_id, batch["id"], f"post-{clip_id}"),
        ).fetchone()
        assert link is not None
        conn.execute(
            """
            INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
            VALUES (%s, 'approve', %s, 'client', %s)
            """,
            (clip_id, member_id, link["id"]),
        )
        conn.execute("SELECT evv.consume_approval_link(%s)", (link["id"],))
        conn.execute("UPDATE clips SET status = 'approved' WHERE id = %s", (clip_id,))
        post = conn.execute(
            "INSERT INTO posts (clip_id, status) VALUES (%s, 'draft') RETURNING id",
            (clip_id,),
        ).fetchone()
    assert post is not None
    return {"post_id": post["id"], "clip_id": clip_id}


def test_dry_run_is_the_default_and_does_not_post(conn: psycopg.Connection[dict[str, Any]]) -> None:
    seeded = _seed_post(conn)
    provider = MockProvider()
    result = PostingService(conn, provider).publish(seeded["post_id"])
    assert result.dry_run is True
    assert result.provider_post_id is None
    assert provider.calls == []
    row = conn.execute("SELECT status, platform_post_id FROM posts WHERE id = %s", (seeded["post_id"],)).fetchone()
    assert row is not None
    assert row["status"] == "draft"
    assert row["platform_post_id"] is None


def test_live_publish_is_idempotent_and_records_the_provider_id(
    conn: psycopg.Connection[dict[str, Any]],
) -> None:
    seeded = _seed_post(conn)
    provider = MockProvider()
    service = PostingService(conn, provider, dry_run=False)
    first = service.publish(seeded["post_id"])
    second_provider = MockProvider()
    second = PostingService(conn, second_provider, dry_run=False).publish(seeded["post_id"])
    assert first.provider_post_id == second.provider_post_id
    assert provider.calls == [f"post:{seeded['post_id']}"]
    assert second_provider.calls == []
    visible = conn.execute(
        "SELECT platform_post_id FROM v_proof_clipping WHERE post_id = %s",
        (seeded["post_id"],),
    ).fetchone()
    assert visible is not None
    assert visible["platform_post_id"] == first.provider_post_id
    again = provider.publish(
        PublishRequest(seeded["post_id"], seeded["clip_id"], f"post:{seeded['post_id']}")
    )
    assert again == first.provider_post_id
    assert len(provider.calls) == 1


def test_dry_run_still_enforces_the_gate(conn: psycopg.Connection[dict[str, Any]]) -> None:
    seeded = _seed_post(conn)
    conn.execute(
        "DELETE FROM approvals WHERE clip_id = %s AND actor_role = 'client'",
        (seeded["clip_id"],),
    )
    conn.commit()
    provider = MockProvider()
    with pytest.raises(psycopg.Error, match="client approval is required"):
        PostingService(conn, provider).publish(seeded["post_id"])
    assert provider.calls == []
    row = conn.execute("SELECT status FROM posts WHERE id = %s", (seeded["post_id"],)).fetchone()
    assert row is not None
    assert row["status"] == "draft"


def test_gate_failure_does_not_call_the_provider(conn: psycopg.Connection[dict[str, Any]]) -> None:
    seeded = _seed_post(conn)
    conn.execute(
        "DELETE FROM approvals WHERE clip_id = %s AND actor_role = 'client'",
        (seeded["clip_id"],),
    )
    conn.commit()
    provider = MockProvider()
    with pytest.raises(psycopg.Error, match="client approval is required"):
        PostingService(conn, provider, dry_run=False).publish(seeded["post_id"])
    assert provider.calls == []

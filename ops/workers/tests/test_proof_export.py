from __future__ import annotations

from typing import Any

import psycopg
from tests.test_posting import _seed_post

from evv_workers.proof_export import ASOF_RE, export_proof_snapshot


def _publish(conn: psycopg.Connection[dict[str, Any]], views: int | None, likes: int | None) -> None:
    seeded = _seed_post(conn)
    with conn.transaction():
        conn.execute("UPDATE posts SET status = 'publishing' WHERE id = %s", (seeded["post_id"],))
        conn.execute(
            """
            UPDATE posts
            SET status = 'published', published_at = now(), platform_post_id = %s
            WHERE id = %s
            """,
            (f"prov-{seeded['post_id']}", seeded["post_id"]),
        )
        conn.execute(
            "INSERT INTO post_metrics (post_id, views, likes) VALUES (%s, %s, %s)",
            (seeded["post_id"], views, likes),
        )


def _assert_shape(snapshot: dict[str, object]) -> None:
    assert set(snapshot) == {"kpis"}
    kpis = snapshot["kpis"]
    assert isinstance(kpis, list)
    for kpi in kpis:
        assert isinstance(kpi, dict)
        assert set(kpi) == {"id", "label", "unit", "value", "source", "asOf"}
        assert kpi["unit"] == "count"
        assert isinstance(kpi["value"], int) and not isinstance(kpi["value"], bool)
        assert isinstance(kpi["asOf"], str) and ASOF_RE.match(kpi["asOf"])
        assert kpi["source"] == "ops.v_proof_clipping"


def test_empty_proof_export_has_no_placeholder_numbers(conn: psycopg.Connection[dict[str, Any]]) -> None:
    snapshot = export_proof_snapshot(conn)
    assert snapshot == {"kpis": []}
    recorded = conn.execute("SELECT payload FROM audit_log WHERE action = 'proof_export'").fetchone()
    assert recorded is not None
    assert recorded["payload"] == {"kpis": []}
    conn.commit()


def test_draft_post_does_not_invent_published_counts(conn: psycopg.Connection[dict[str, Any]]) -> None:
    _seed_post(conn)
    snapshot = export_proof_snapshot(conn)
    assert snapshot == {"kpis": []}
    conn.commit()


def test_null_metrics_are_omitted_and_recorded_zero_is_kept(
    conn: psycopg.Connection[dict[str, Any]],
) -> None:
    _publish(conn, views=None, likes=0)
    snapshot = export_proof_snapshot(conn)
    _assert_shape(snapshot)
    by_id = {kpi["id"]: kpi for kpi in snapshot["kpis"]}
    assert "views" not in by_id
    assert by_id["likes"]["value"] == 0
    assert by_id["published_posts"]["value"] == 1
    assert "comments" not in by_id
    conn.commit()


def test_recorded_views_sum_ignores_null_rows(conn: psycopg.Connection[dict[str, Any]]) -> None:
    _publish(conn, views=4, likes=None)
    _publish(conn, views=None, likes=None)
    snapshot = export_proof_snapshot(conn)
    _assert_shape(snapshot)
    by_id = {kpi["id"]: kpi for kpi in snapshot["kpis"]}
    assert by_id["views"]["value"] == 4
    assert by_id["published_posts"]["value"] == 2
    assert "likes" not in by_id
    conn.commit()

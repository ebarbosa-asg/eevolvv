"""Site /proof snapshot built only from recorded v_proof_clipping rows.

The marketing site schema (lib/proof.ts on the site rebuild) is:

    { "kpis": [ { "id", "label", "unit": "count"|"cents", "value": int,
                  "source", "asOf": datetime-with-offset } ] }

An empty export is ``{"kpis": []}``, which that page renders as
"Awaiting first export." NULL measurements are omitted. A stored 0 stays 0.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import Any

from psycopg import Connection
from psycopg.types.json import Json

SOURCE = "ops.v_proof_clipping"
ASOF_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$"
)

METRIC_LABELS = (
    ("views", "Recorded views"),
    ("likes", "Recorded likes"),
    ("comments", "Recorded comments"),
    ("shares", "Recorded shares"),
    ("watch_time_ms", "Recorded watch time (ms)"),
)


def _as_of(value: datetime | None) -> str | None:
    if value is None:
        return None
    text = value.isoformat()
    if ASOF_RE.match(text) is None:
        return None
    return text


def _kpi(kpi_id: str, label: str, value: int, as_of: str) -> dict[str, Any]:
    return {
        "id": kpi_id,
        "label": label,
        "unit": "count",
        "value": value,
        "source": SOURCE,
        "asOf": as_of,
    }


def export_proof_snapshot(conn: Connection[dict[str, Any]]) -> dict[str, Any]:
    """Aggregate recorded proof. Snapshot joins cannot double-count a post."""
    rows = conn.execute(
        """
        SELECT DISTINCT ON (post_id)
          post_id, post_status, published_at, platform_post_id,
          views, likes, comments, shares, watch_time_ms, metrics_captured_at
        FROM v_proof_clipping
        WHERE post_id IS NOT NULL
        ORDER BY post_id, metrics_captured_at DESC NULLS LAST
        """
    ).fetchall()
    kpis: list[dict[str, Any]] = []
    published = [row for row in rows if row["post_status"] == "published"]
    published_as_of = _as_of(
        max(
            (row["published_at"] for row in published if isinstance(row["published_at"], datetime)),
            default=None,
        )
    )
    if published and published_as_of is not None:
        kpis.append(_kpi("published_posts", "Published posts", len(published), published_as_of))
    for column, label in METRIC_LABELS:
        measured = [row for row in rows if row[column] is not None]
        if not measured:
            continue
        as_of = _as_of(
            max(
                (
                    row["metrics_captured_at"]
                    for row in measured
                    if isinstance(row["metrics_captured_at"], datetime)
                ),
                default=None,
            )
        )
        if as_of is None:
            continue
        total = sum(int(row[column]) for row in measured)
        kpis.append(_kpi(column, label, total, as_of))
    snapshot = {"kpis": kpis}
    conn.execute(
        """
        INSERT INTO audit_log (action, entity, payload)
        VALUES ('proof_export', 'v_proof_clipping', %s)
        """,
        (Json(snapshot),),
    )
    return snapshot

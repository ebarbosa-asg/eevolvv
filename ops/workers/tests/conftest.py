from __future__ import annotations

import subprocess
from collections.abc import Iterator
from pathlib import Path
from uuid import uuid4

import psycopg
import pytest
from psycopg.conninfo import conninfo_to_dict, make_conninfo
from psycopg.rows import dict_row

MIGRATIONS = Path(__file__).resolve().parents[2] / "supabase" / "migrations"


@pytest.fixture(scope="session")
def database_url() -> Iterator[str]:
    import os

    admin = os.environ.get("DATABASE_URL", "dbname=postgres")
    info = conninfo_to_dict(admin)
    info["dbname"] = "postgres"
    admin_url = make_conninfo(**{key: value for key, value in info.items() if value is not None})
    name = f"evv_pytest_{uuid4().hex[:8]}"
    with psycopg.connect(admin_url, autocommit=True) as conn:
        conn.execute(f'CREATE DATABASE "{name}"')
    test_info = conninfo_to_dict(admin_url)
    test_info["dbname"] = name
    url = make_conninfo(**{key: value for key, value in test_info.items() if value is not None})
    for migration in sorted(MIGRATIONS.glob("*.sql")):
        subprocess.run(
            ["psql", url, "-v", "ON_ERROR_STOP=1", "-q", "-f", str(migration)],
            check=True,
            capture_output=True,
            text=True,
        )
    yield url
    with psycopg.connect(admin_url, autocommit=True) as conn:
        conn.execute(f'DROP DATABASE "{name}" WITH (FORCE)')


@pytest.fixture(autouse=True)
def _truncate(database_url: str) -> Iterator[None]:
    yield
    with psycopg.connect(database_url, autocommit=True) as cleanup:
        cleanup.execute("TRUNCATE clients, operators, jobs, audit_log RESTART IDENTITY CASCADE")


@pytest.fixture
def conn(database_url: str) -> Iterator[psycopg.Connection[dict[str, object]]]:
    connection = psycopg.connect(database_url, row_factory=dict_row)
    try:
        yield connection
    finally:
        connection.close()


def seed_clip(connection: psycopg.Connection[dict[str, object]]) -> dict[str, object]:
    row = connection.execute(
        """
        WITH client AS (
          INSERT INTO clients (name) VALUES ('clip client') RETURNING id
        ),
        asset AS (
          INSERT INTO source_assets (
            client_id, sha256, storage_key, duration_ms, has_video,
            rights_confirmed_at, rights_confirmed_by
          )
          SELECT id, %s, 'sources/clip', 60000, true, now(), gen_random_uuid()
          FROM client
          RETURNING id, client_id
        ),
        batch AS (
          INSERT INTO batches (client_id, source_asset_id)
          SELECT client_id, id FROM asset
          RETURNING id
        ),
        clip AS (
          INSERT INTO clips (batch_id, status, qa_run)
          SELECT id, 'draft', 0 FROM batch
          RETURNING id
        )
        SELECT clip.id AS clip_id, asset.client_id
        FROM clip, asset
        """,
        ("ab" * 32,),
    ).fetchone()
    if row is None:
        raise RuntimeError("seed failed")
    connection.commit()
    return row

"""Offline smoke: upload through proof export. No network and no email."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any
from uuid import uuid4

import psycopg
from psycopg.conninfo import conninfo_to_dict, make_conninfo
from psycopg.rows import dict_row
from psycopg.types.json import Json

from evv_workers.captions import build_ass
from evv_workers.demo import FixtureToolClient, face_track, load_fixtures
from evv_workers.metadata import write_metadata
from evv_workers.moments import select_moments
from evv_workers.posting import MockProvider, PostingService
from evv_workers.probe import ffprobe
from evv_workers.proof_export import export_proof_snapshot
from evv_workers.qa import phash_file, record_qa, run_checks
from evv_workers.queue import JobQueue
from evv_workers.reframe import build_crop_plan
from evv_workers.render import render_clip

OPS_ROOT = Path(__file__).resolve().parents[3]
MIGRATIONS = OPS_ROOT / "supabase" / "migrations"
APP = OPS_ROOT / "apps" / "app"


class StepFailure(RuntimeError):
    pass


def step(name: str, ok: bool, detail: str = "") -> None:
    if not ok:
        raise StepFailure(f"{name}: {detail or 'assertion failed'}")
    print(f"ok {name}")


def _node_url(name: str) -> str:
    raw = os.environ.get("DATABASE_URL", "")
    if raw.startswith("postgres"):
        info = conninfo_to_dict(raw)
        user = info.get("user") or ""
        password = info.get("password") or ""
        host = info.get("host") or "localhost"
        port = info.get("port") or 5432
        auth = f"{user}:{password}@" if user else ""
        return f"postgresql://{auth}{host}:{port}/{name}"
    return f"postgresql:///{name}?host=/var/run/postgresql"


def _admin_conninfo() -> str:
    raw = os.environ.get("ADMIN_DATABASE_URL") or os.environ.get("DATABASE_URL") or "dbname=postgres"
    info = conninfo_to_dict(raw)
    clean = {key: str(value) for key, value in info.items() if value is not None}
    clean["dbname"] = "postgres"
    return make_conninfo(**clean)


def _psql(url: str, path: Path) -> None:
    subprocess.run(["psql", url, "-v", "ON_ERROR_STOP=1", "-q", "-f", str(path)], check=True)


def _source(path: Path) -> None:
    proc = subprocess.run(
        [
            "ffmpeg", "-y", "-f", "lavfi", "-i", "testsrc=size=960x540:rate=30",
            "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000",
            "-t", "82", "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-shortest", str(path),
        ],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise StepFailure(proc.stderr[-1500:])


def main() -> None:
    database = f"evv_e2e_{uuid4().hex[:8]}"
    admin = _admin_conninfo()
    url = _node_url(database)
    work = Path(tempfile.mkdtemp(prefix="evv-e2e-"))
    try:
        with psycopg.connect(admin, autocommit=True) as setup:
            setup.execute(f'CREATE DATABASE "{database}"')
        for migration in sorted(MIGRATIONS.glob("*.sql")):
            _psql(url, migration)
        client_id = uuid4()
        operator_id = uuid4()
        member_id = uuid4()
        with psycopg.connect(url, row_factory=dict_row) as conn:
            conn.execute("INSERT INTO operators (user_id, email) VALUES (%s, 'e2e@example.com')", (operator_id,))
            conn.execute("INSERT INTO clients (id, name) VALUES (%s, 'e2e client')", (client_id,))
            conn.execute(
                "INSERT INTO client_members (client_id, user_id) VALUES (%s, %s)",
                (client_id, member_id),
            )
            conn.commit()
        source = work / "source.mp4"
        _source(source)
        state_path = work / "state.json"
        result_path = work / "upload.json"
        state_path.write_text(
            json.dumps(
                {
                    "clientId": str(client_id),
                    "confirmedBy": str(member_id),
                    "videoPath": str(source),
                    "resultPath": str(result_path),
                }
            )
        )
        env = os.environ.copy()
        env["DATABASE_URL"] = url
        env["EVV_E2E_STATE"] = str(state_path)
        env.pop("ASSEMBLYAI_API_KEY", None)
        env.pop("ANTHROPIC_API_KEY", None)
        subprocess.run(
            ["pnpm", "exec", "vitest", "run", "--config", "vitest.e2e.config.ts"],
            cwd=APP,
            env=env,
            check=True,
        )
        uploaded = json.loads(result_path.read_text())
        with psycopg.connect(url, row_factory=dict_row) as conn:
            _pipeline(conn, uploaded, client_id, operator_id, member_id, source, work)
    finally:
        shutil.rmtree(work, ignore_errors=True)
        with psycopg.connect(admin, autocommit=True) as setup:
            setup.execute(f'DROP DATABASE IF EXISTS "{database}" WITH (FORCE)')


def _pipeline(
    conn: psycopg.Connection[dict[str, Any]],
    uploaded: dict[str, Any],
    client_id: Any,
    operator_id: Any,
    member_id: Any,
    source: Path,
    work: Path,
) -> None:
    asset_id = uploaded["assetId"]
    asset = conn.execute(
        """
        SELECT has_video, duration_ms, rights_confirmed_at, rights_confirmed_by
        FROM source_assets WHERE id = %s
        """,
        (asset_id,),
    ).fetchone()
    step(
        "upload",
        asset is not None
        and asset["has_video"] is True
        and asset["rights_confirmed_at"] is not None
        and str(asset["rights_confirmed_by"]) == str(member_id)
        and int(asset["duration_ms"]) > 0,
        "source asset missing rights or video",
    )
    job = conn.execute("SELECT kind, status, idempotency_key FROM jobs WHERE id = %s", (uploaded["jobId"],)).fetchone()
    step(
        "upload job",
        job is not None
        and job["kind"] == "transcribe"
        and job["status"] == "pending"
        and str(job["idempotency_key"]).startswith("transcribe:"),
        "transcribe job was not enqueued",
    )

    transcript, moment_payload, metadata_payload = load_fixtures()
    queue = JobQueue(conn)
    claimed = queue.claim("e2e")
    step("transcribe claim", claimed is not None and claimed.kind == "transcribe", "queue did not claim the upload job")
    assert claimed is not None
    payload = transcript.to_json()
    conn.execute(
        """
        INSERT INTO transcripts (source_asset_id, provider, words, sentences, speakers)
        VALUES (%s, 'fixture', %s, %s, %s)
        """,
        (asset_id, Json(payload["words"]), Json(payload["sentences"]), Json(payload["speakers"])),
    )
    queue.succeed(claimed.id)
    stored = conn.execute(
        "SELECT provider, jsonb_array_length(sentences) AS n FROM transcripts WHERE source_asset_id = %s",
        (asset_id,),
    ).fetchone()
    finished = conn.execute("SELECT status FROM jobs WHERE id = %s", (claimed.id,)).fetchone()
    step(
        "transcribe",
        stored is not None
        and stored["provider"] == "fixture"
        and int(stored["n"]) > 0
        and finished is not None
        and finished["status"] == "succeeded",
        "fixture transcript was not stored",
    )

    tool = FixtureToolClient(moment_payload, metadata_payload)
    chosen = select_moments(tool, transcript.sentences, transcript.words, needed=1)
    step("moments", len(chosen) >= 1, "fixture client returned no moment")
    moment = chosen[0]
    duration = moment.end_ms - moment.start_ms
    step("moments duration", 20_000 <= duration <= 90_000, f"duration_ms={duration}")
    sentence_ids = {sentence.id for sentence in transcript.sentences}
    step(
        "moments sentences",
        moment.start_sentence_id in sentence_ids and moment.end_sentence_id in sentence_ids,
        "moment cited an unknown sentence",
    )
    batch = conn.execute(
        """
        INSERT INTO batches (client_id, source_asset_id, status)
        SELECT client_id, id, 'ready' FROM source_assets WHERE id = %s
        RETURNING id
        """,
        (asset_id,),
    ).fetchone()
    step("batch", batch is not None, "batch insert failed")
    assert batch is not None
    moment_row = conn.execute(
        """
        INSERT INTO moments (
          batch_id, start_sentence_id, end_sentence_id, start_ms, end_ms,
          hook_line, hook_archetype, topic, standalone_score, rationale, rank_score
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            batch["id"],
            moment.start_sentence_id,
            moment.end_sentence_id,
            moment.start_ms,
            moment.end_ms,
            moment.hook_line,
            moment.hook_archetype,
            moment.topic,
            moment.standalone_score,
            moment.rationale,
            moment.rank_score,
        ),
    ).fetchone()
    assert moment_row is not None
    clip = conn.execute(
        """
        INSERT INTO clips (batch_id, moment_id, status, qa_run, duration_ms)
        VALUES (%s, %s, 'draft', 0, %s) RETURNING id
        """,
        (batch["id"], moment_row["id"], duration),
    ).fetchone()
    assert clip is not None
    clip_id = clip["id"]

    words = [word for word in transcript.words if word.end_ms > moment.start_ms and word.start_ms < moment.end_ms]
    plan = build_crop_plan(
        frame_w=960,
        frame_h=540,
        t0=moment.start_ms / 1000,
        t1=moment.end_ms / 1000,
        words=words,
        faces=face_track(moment.start_ms / 1000, moment.end_ms / 1000, 480),
        overrides={"A": "face"},
    )
    step("reframe", len(plan) > 0 and all("t0" in segment and "w" in segment for segment in plan), "crop plan is empty")
    conn.execute("UPDATE clips SET crop_plan = %s WHERE id = %s", (Json(plan), clip_id))

    ass_path = work / "clip.ass"
    ass_path.write_text(build_ass(words, hook_line=moment.hook_line, origin_ms=moment.start_ms), encoding="utf-8")
    output = work / "clip.mp4"
    render_clip(str(source), str(ass_path), str(output), plan, preset="veryfast")
    probed = ffprobe(str(output))
    step(
        "render",
        output.stat().st_size > 0 and probed.width == 1080 and probed.height == 1920 and 20 <= probed.duration_s <= 90,
        f"probe {probed.width}x{probed.height} {probed.duration_s:.2f}s",
    )
    step("captions", moment.hook_line in ass_path.read_text(encoding="utf-8"), "hook missing from the ASS file")
    conn.execute("UPDATE clips SET storage_key = %s WHERE id = %s", (f"clips/{clip_id}.mp4", clip_id))

    meta = write_metadata(
        FixtureToolClient(moment_payload, metadata_payload),
        transcript.sentences,
        start_sentence_id=moment.start_sentence_id,
        end_sentence_id=moment.end_sentence_id,
    )
    conn.execute("UPDATE clips SET metadata = %s WHERE id = %s", (Json(meta), clip_id))
    thumb = work / "thumb.png"
    checks = run_checks(
        video_path=str(output),
        words=words,
        hook_line=moment.hook_line,
        origin_ms=moment.start_ms,
        end_ms=moment.end_ms,
        metadata_texts=[str(meta["youtube_title"]), str(meta["instagram_caption"])],
        phash=phash_file(str(output), str(thumb)),
        other_hashes=[],
        other_ranges=[],
        rights_confirmed_at="e2e",
        rights_confirmed_by=str(member_id),
    )
    failed = [check.code for check in checks if check.blocking and check.status == "fail"]
    qa_job = uuid4()
    record_qa(conn, clip_id, qa_job, checks)
    status = conn.execute("SELECT status FROM clips WHERE id = %s", (clip_id,)).fetchone()
    step("qa", status is not None and status["status"] == "needs_review" and not failed, f"failed {failed}")

    conn.execute(
        """
        INSERT INTO approvals (clip_id, decision, decided_by, actor_role)
        VALUES (%s, 'approve', %s, 'operator')
        """,
        (clip_id, operator_id),
    )
    after_operator = conn.execute("SELECT status FROM clips WHERE id = %s", (clip_id,)).fetchone()
    audit = conn.execute(
        "SELECT action FROM audit_log WHERE entity = 'clips' AND entity_id = %s AND action = 'approval.approve'",
        (clip_id,),
    ).fetchone()
    step(
        "operator approve",
        after_operator is not None and after_operator["status"] == "needs_review" and audit is not None,
        "operator approval changed status before the client",
    )
    conn.commit()
    blocked = False
    try:
        conn.execute("UPDATE clips SET status = 'approved' WHERE id = %s", (clip_id,))
    except psycopg.Error as exc:
        conn.rollback()
        blocked = "operator and client approval" in str(exc)
    step("operator approve gate", blocked, "database allowed approved without the client")

    link = conn.execute(
        """
        INSERT INTO approval_links (client_id, batch_id, token_hash, expires_at)
        VALUES (%s, %s, %s, now() + interval '1 hour')
        RETURNING id
        """,
        (client_id, batch["id"], uuid4().hex),
    ).fetchone()
    assert link is not None
    conn.execute(
        """
        INSERT INTO approvals (clip_id, decision, decided_by, actor_role, link_id)
        VALUES (%s, 'approve', NULL, 'client', %s)
        """,
        (clip_id, link["id"]),
    )
    conn.execute("SELECT evv.consume_approval_link(%s)", (link["id"],))
    conn.execute("UPDATE clips SET status = 'approved' WHERE id = %s", (clip_id,))
    approved = conn.execute("SELECT status FROM clips WHERE id = %s", (clip_id,)).fetchone()
    used = conn.execute("SELECT used_at FROM approval_links WHERE id = %s", (link["id"],)).fetchone()
    step(
        "client approve",
        approved is not None and approved["status"] == "approved" and used is not None and used["used_at"] is not None,
        "client approval did not consume the link",
    )

    post = conn.execute(
        "INSERT INTO posts (clip_id, status) VALUES (%s, 'draft') RETURNING id",
        (clip_id,),
    ).fetchone()
    assert post is not None
    provider = MockProvider()
    result = PostingService(conn, provider).publish(post["id"])
    posted = conn.execute("SELECT status, platform_post_id FROM posts WHERE id = %s", (post["id"],)).fetchone()
    step(
        "dry-run post",
        result.dry_run is True
        and result.provider_post_id is None
        and provider.calls == []
        and posted is not None
        and posted["status"] == "draft"
        and posted["platform_post_id"] is None,
        "dry-run wrote a provider id",
    )
    snapshot = export_proof_snapshot(conn)
    step("proof export", snapshot == {"kpis": []}, json.dumps(snapshot))
    conn.commit()
    print("e2e ok")


if __name__ == "__main__":
    try:
        main()
    except StepFailure as exc:
        raise SystemExit(str(exc)) from exc

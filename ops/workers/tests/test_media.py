from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Any
from uuid import uuid4

import boto3
import psycopg
from moto import mock_aws
from tests.conftest import seed_clip

from evv_workers.captions import Box, build_ass
from evv_workers.probe import ProbeError, ffprobe, require_video
from evv_workers.qa import (
    CheckResult,
    check_b1,
    check_b2,
    check_b3,
    check_b4,
    check_b5_drift,
    check_b6,
    check_b7,
    check_b9,
    check_b11,
    record_qa,
)
from evv_workers.render import average_hash, ffmpeg_args, hamming, render_clip
from evv_workers.storage import S3Store
from evv_workers.transcript import Word


def _lavfi(path: Path, video: str, audio: str, duration: str, size: str = "320x240") -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            video,
            "-f",
            "lavfi",
            "-i",
            audio,
            "-t",
            duration,
            "-s",
            size,
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-shortest",
            str(path),
        ],
        check=True,
        capture_output=True,
    )


def test_multipart_upload_and_presign() -> None:
    with mock_aws():
        client = boto3.client("s3", region_name="us-east-1")
        client.create_bucket(Bucket="evv-test")
        store = S3Store("evv-test", client=client, region="us-east-1")
        upload_id = store.create_multipart("sources/a.mp4", "video/mp4")
        # S3 rejects non-final parts under 5 MiB. The last part can be short.
        etag_1 = store.upload_part("sources/a.mp4", upload_id, 1, b"a" * (5 * 1024 * 1024))
        etag_2 = store.upload_part("sources/a.mp4", upload_id, 2, b"world")
        store.complete_multipart("sources/a.mp4", upload_id, [(1, etag_1), (2, etag_2)])
        body = store.get_bytes("sources/a.mp4")
        assert body.startswith(b"a" * 16)
        assert body.endswith(b"world")
        url = store.presign_get("sources/a.mp4")
        assert "sources/a.mp4" in url


def test_probe_rejects_audio_only(tmp_path: Path) -> None:
    video = tmp_path / "video.mp4"
    audio = tmp_path / "audio.m4a"
    _lavfi(
        video,
        "testsrc=size=320x240:rate=30",
        "sine=frequency=440:sample_rate=48000",
        "1",
    )
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", "sine=frequency=440:duration=1", "-c:a", "aac", str(audio)],
        check=True,
        capture_output=True,
    )
    probed = require_video(ffprobe(str(video)))
    assert probed.video_codec == "h264"
    try:
        require_video(ffprobe(str(audio)))
    except ProbeError as exc:
        assert "audio-only" in str(exc)
    else:
        raise AssertionError("expected rejection")


def test_render_matches_spec(tmp_path: Path) -> None:
    source = tmp_path / "source.mp4"
    _lavfi(
        source,
        "testsrc=size=640x360:rate=30",
        "sine=frequency=440:sample_rate=48000",
        "2",
        size="640x360",
    )
    words = [Word("w1", 100, 400, "A", "Hello"), Word("w2", 400, 800, "A", "there")]
    ass_path = tmp_path / "captions.ass"
    ass_path.write_text(build_ass(words, hook_line="Do this", origin_ms=0))
    plan = [{"t0": 0.0, "t1": 2.0, "x": 140, "y": 0, "w": 202, "h": 360}]
    output = tmp_path / "clip.mp4"
    args = ffmpeg_args(str(source), str(ass_path), str(output), plan)
    assert "-b:v" in args and "8M" in args
    assert "loudnorm=I=-14:TP=-1:LRA=11" in " ".join(args)
    assert "+faststart" in args
    render_clip(str(source), str(ass_path), str(output), plan)
    probe = ffprobe(str(output))
    result = check_b1(probe, str(output))
    assert result.status == "pass", result.detail
    assert probe.width == 1080 and probe.height == 1920


def test_qa_pass_and_fail_fixtures(tmp_path: Path, conn: psycopg.Connection[dict[str, Any]]) -> None:
    moving = tmp_path / "moving.mp4"
    black = tmp_path / "black.mp4"
    frozen = tmp_path / "frozen.mp4"
    short = tmp_path / "short.mp4"
    long_enough = tmp_path / "long.mp4"
    silent = tmp_path / "silent.mp4"
    _lavfi(moving, "testsrc=size=320x240:rate=30", "sine=frequency=440:sample_rate=48000", "2")
    _lavfi(black, "color=c=black:size=320x240:rate=30", "sine=frequency=440:sample_rate=48000", "2")
    _lavfi(frozen, "color=c=blue:size=320x240:rate=30", "sine=frequency=440:sample_rate=48000", "2")
    _lavfi(short, "testsrc=size=160x90:rate=30", "sine=frequency=440:sample_rate=48000", "5", "160x90")
    _lavfi(long_enough, "testsrc=size=160x90:rate=30", "sine=frequency=440:sample_rate=48000", "21", "160x90")
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "aevalsrc=0:d=2:s=48000",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=440:sample_rate=48000:duration=3",
            "-filter_complex",
            "[0:a][1:a]concat=n=2:v=0:a=1",
            "-c:a",
            "aac",
            str(silent),
        ],
        check=True,
        capture_output=True,
    )
    loud = tmp_path / "loud.mp4"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=440:sample_rate=48000:duration=8",
            "-af",
            "loudnorm=I=-14:TP=-1:LRA=11",
            "-c:a",
            "aac",
            "-ar",
            "48000",
            str(loud),
        ],
        check=True,
        capture_output=True,
    )

    assert check_b2(21).status == "pass"
    assert check_b2(ffprobe(str(short)).duration_s).status == "fail"
    assert check_b2(95).status == "fail"
    assert check_b3(str(loud)).status == "pass"
    assert check_b3(str(silent)).status == "fail"
    assert check_b4(str(moving)).status == "pass"
    assert check_b4(str(black)).status == "fail"
    assert check_b4(str(frozen)).status == "fail"

    words = [Word("w1", 1000, 1500, "A", "Hello")]
    assert check_b6(words, 800, 1800).status == "pass"
    assert check_b6(words, 1200, 1800).status == "fail"
    safe = [Box(200, 400, 200, 64, "caption"), Box(400, 250, 200, 72, "hook")]
    assert check_b5_drift(100, 100, safe).status == "pass"
    assert check_b5_drift(100, 400, safe).status == "fail"
    outside = [Box(0, 0, 100, 40, "caption")]
    assert check_b5_drift(0, 0, outside).status == "fail"
    assert check_b7("A plain caption").status == "pass"
    assert check_b7("This is guaranteed viral").status == "human"
    same = average_hash(_solid(tmp_path / "bars.png", "bars"))
    other = average_hash(_solid(tmp_path / "checker.png", "checker"))
    assert hamming(same, same) == 0
    assert check_b9(phash=same, other_hashes=[same], start_ms=0, end_ms=1000, other_ranges=[]).status == "fail"
    assert check_b9(phash=same, other_hashes=[other], start_ms=0, end_ms=1000, other_ranges=[]).status == "pass"
    assert check_b9(
        phash=same,
        other_hashes=[other],
        start_ms=0,
        end_ms=10_000,
        other_ranges=[(1000, 9000)],
    ).status == "fail"
    assert check_b11("2026-01-01", "user").status == "pass"
    assert check_b11(None, None).status == "fail"

    seeded = seed_clip(conn)
    job_id = uuid4()
    passed = [CheckResult("B1", "pass", True, {})]
    run = record_qa(conn, seeded["clip_id"], job_id, passed)
    again = record_qa(conn, seeded["clip_id"], job_id, passed)
    assert run == again == 1
    status = conn.execute("SELECT status FROM clips WHERE id = %s", (seeded["clip_id"],)).fetchone()
    assert status is not None and status["status"] == "needs_review"
    failed = record_qa(conn, seeded["clip_id"], uuid4(), [CheckResult("B2", "fail", True, {})])
    assert failed == 2
    status = conn.execute("SELECT status FROM clips WHERE id = %s", (seeded["clip_id"],)).fetchone()
    assert status is not None and status["status"] == "qa_failed"


def _solid(path: Path, kind: str) -> str:
    from PIL import Image

    img = Image.new("L", (32, 32), 0)
    pixels = img.load()
    assert pixels is not None
    for x in range(32):
        for y in range(32):
            if kind == "bars":
                pixels[x, y] = 255 if x < 16 else 0
            else:
                pixels[x, y] = 255 if (x + y) % 2 == 0 else 0
    img.save(path)
    return str(path)

from __future__ import annotations

import subprocess
from pathlib import Path

import pytest

from evv_workers.reframe import (
    FACE_CONFIDENCE_MIN,
    FaceSample,
    build_crop_plan,
    crop_9_16,
    detect_faces_opencv,
    haar_confidence,
)
from evv_workers.transcript import Word

FIXTURE = (
    Path(__file__).resolve().parents[2]
    / "fixtures"
    / "media"
    / "plos-one-2013-speaker-s3.ogv"
)


def _word(speaker: str, start: int, end: int) -> Word:
    return Word(f"w{start}", start, end, speaker, "word")


def test_crop_is_nine_by_sixteen_and_contains_face() -> None:
    x, y, w, h = crop_9_16(1280, 720, 200, 300)
    assert abs((w / h) - (9 / 16)) < 0.02
    assert x <= 200 <= x + w
    assert y <= 300 <= y + h
    assert w % 2 == 0 and h % 2 == 0


def test_low_confidence_is_full_frame_letterbox() -> None:
    words = [_word("A", 0, 4000)]
    faces = [FaceSample(1.0, "face-1", 100, 40, 80, 80, 0.4)]
    plan = build_crop_plan(
        frame_w=640, frame_h=360, t0=0, t1=4, words=words, faces=faces
    )
    assert plan[0]["x"] == 0 and plan[0]["w"] == 640 and plan[0]["h"] == 360
    assert FACE_CONFIDENCE_MIN == 0.6


def test_gallery_and_operator_override() -> None:
    words = [_word("A", 0, 4000), _word("B", 4000, 8000)]
    faces = [
        FaceSample(1.0, "face-1", 40, 40, 100, 120, 0.9),
        FaceSample(1.0, "face-2", 400, 40, 100, 120, 0.2),
        FaceSample(5.0, "face-1", 40, 40, 100, 120, 0.2),
        FaceSample(5.0, "face-2", 400, 40, 100, 120, 0.95),
    ]
    plan = build_crop_plan(
        frame_w=640,
        frame_h=360,
        t0=0,
        t1=8,
        words=words,
        faces=faces,
        overrides={"B": "face-1"},
    )
    speaker_b = next(segment for segment in plan if float(segment["t0"]) >= 3.5)
    assert int(speaker_b["x"]) < 320


def test_short_turns_merge_to_minimum() -> None:
    words = [
        _word("A", 0, 3000),
        _word("B", 3000, 3400),
        _word("A", 3400, 8000),
    ]
    faces = [
        FaceSample(1.0, "face-1", 40, 40, 90, 110, 0.9),
        FaceSample(3.2, "face-2", 400, 40, 90, 110, 0.9),
        FaceSample(5.0, "face-1", 40, 40, 90, 110, 0.9),
    ]
    plan = build_crop_plan(frame_w=640, frame_h=360, t0=0, t1=8, words=words, faces=faces)
    assert all(float(segment["t1"]) - float(segment["t0"]) >= 1.5 or len(plan) == 1 for segment in plan)
    assert abs(float(plan[0]["t0"])) < 0.01
    assert abs(float(plan[-1]["t1"]) - 8) < 0.01


def test_haar_confidence_mapping() -> None:
    assert haar_confidence(0) == 0
    assert haar_confidence(4) > 0.6
    assert 0 < haar_confidence(1) < 0.6


def test_detector_runs_on_cc_clip(tmp_path: Path) -> None:
    pytest.importorskip("cv2")
    mp4 = tmp_path / "talking.mp4"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(FIXTURE),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            str(mp4),
        ],
        check=True,
        capture_output=True,
    )
    faces = detect_faces_opencv(str(mp4), sample_every=3)
    assert faces
    assert all(0 <= face.confidence <= 1 for face in faces)
    plan = build_crop_plan(
        frame_w=640,
        frame_h=360,
        t0=0,
        t1=3.6,
        words=[_word("A", 0, 3600)],
        faces=faces,
    )
    assert plan
    assert float(plan[-1]["t1"]) == pytest.approx(3.6, abs=0.05)

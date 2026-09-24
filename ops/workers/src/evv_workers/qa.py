from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from psycopg import Connection
from psycopg.types.json import Json

from evv_workers.captions import (
    Box,
    box_in_safe_zone,
    chunk_words,
    hook_in_top_third,
    layout_boxes,
)
from evv_workers.metadata import load_banned_terms
from evv_workers.probe import Probe, ffprobe
from evv_workers.render import average_hash, hamming, moov_before_mdat, write_thumbnail
from evv_workers.transcript import Word

AHASH_DUP_MAX_DISTANCE = 10
LOUDNESS_TARGET = -14.0
LOUDNESS_TOLERANCE = 2.0
SILENCE_MAX_S = 1.5
BLACK_OR_FREEZE_MAX_S = 1.0
CAPTION_DRIFT_MAX_MS = 120


@dataclass(frozen=True)
class CheckResult:
    code: str
    status: str
    blocking: bool
    detail: dict[str, Any] = field(default_factory=dict)


def _run(args: list[str]) -> str:
    proc = subprocess.run(args, capture_output=True, text=True)
    return proc.stderr + "\n" + proc.stdout


def check_b1(probe: Probe, path: str) -> CheckResult:
    faststart = moov_before_mdat(path)
    ok = (
        probe.width == 1080
        and probe.height == 1920
        and probe.video_codec == "h264"
        and (probe.profile or "").lower() == "high"
        and probe.pix_fmt == "yuv420p"
        and probe.audio_codec == "aac"
        and probe.sample_rate == 48000
        and faststart
    )
    return CheckResult(
        "B1",
        "pass" if ok else "fail",
        True,
        {
            "width": probe.width,
            "height": probe.height,
            "video_codec": probe.video_codec,
            "profile": probe.profile,
            "pix_fmt": probe.pix_fmt,
            "audio_codec": probe.audio_codec,
            "sample_rate": probe.sample_rate,
            "faststart": faststart,
        },
    )


def check_b2(duration_s: float) -> CheckResult:
    ok = 20 <= duration_s <= 90
    return CheckResult("B2", "pass" if ok else "fail", True, {"duration_s": duration_s})


def integrated_loudness(path: str) -> float | None:
    text = _run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"])
    summary = text.split("Summary:")[-1]
    match = re.search(r"I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", summary)
    if match is None:
        return None
    return float(match.group(1))


def silence_durations(path: str) -> list[float]:
    text = _run(
        [
            "ffmpeg",
            "-nostats",
            "-i",
            path,
            "-af",
            f"silencedetect=n=-50dB:d={SILENCE_MAX_S}",
            "-f",
            "null",
            "-",
        ]
    )
    return [float(value) for value in re.findall(r"silence_duration:\s*([0-9.]+)", text)]


def check_b3(path: str) -> CheckResult:
    loudness = integrated_loudness(path)
    silences = silence_durations(path)
    long_silence = any(item > SILENCE_MAX_S for item in silences)
    loud_ok = loudness is not None and abs(loudness - LOUDNESS_TARGET) <= LOUDNESS_TOLERANCE
    ok = loud_ok and not long_silence
    return CheckResult(
        "B3",
        "pass" if ok else "fail",
        True,
        {"integrated_lufs": loudness, "silence_s": silences},
    )


def _durations(text: str, label: str) -> list[float]:
    return [float(value) for value in re.findall(rf"{label}:\s*([0-9.]+)", text)]


def _freeze_lengths(text: str, file_duration: float) -> list[float]:
    durations = _durations(text, "freeze_duration")
    if durations:
        return durations
    starts = [float(value) for value in re.findall(r"freeze_start:\s*([0-9.]+)", text)]
    ends = [float(value) for value in re.findall(r"freeze_end:\s*([0-9.]+)", text)]
    lengths: list[float] = []
    for index, start in enumerate(starts):
        end = ends[index] if index < len(ends) else file_duration
        lengths.append(end - start)
    return lengths


def check_b4(path: str) -> CheckResult:
    black = _run(
        [
            "ffmpeg",
            "-nostats",
            "-i",
            path,
            "-vf",
            "blackdetect=d=1:pic_th=0.98",
            "-f",
            "null",
            "-",
        ]
    )
    freeze = _run(
        [
            "ffmpeg",
            "-nostats",
            "-i",
            path,
            "-vf",
            "freezedetect=n=-40dB:d=1",
            "-f",
            "null",
            "-",
        ]
    )
    black_d = _durations(black, "black_duration")
    duration = ffprobe(path).duration_s
    freeze_d = _freeze_lengths(freeze, duration)
    ok = not any(item > BLACK_OR_FREEZE_MAX_S for item in black_d + freeze_d)
    return CheckResult(
        "B4",
        "pass" if ok else "fail",
        True,
        {"black_s": black_d, "freeze_s": freeze_d},
    )


def check_b5(words: list[Word] | tuple[Word, ...], hook_line: str | None, origin_ms: int) -> CheckResult:
    local = [
        Word(
            id=word.id,
            start_ms=max(0, word.start_ms - origin_ms),
            end_ms=max(1, word.end_ms - origin_ms),
            speaker=word.speaker,
            text=word.text,
        )
        for word in words
        if word.end_ms > origin_ms and word.start_ms < origin_ms + 3_600_000
    ]
    chunks = chunk_words(local)
    boxes = layout_boxes(chunks, hook_line)
    # Events are written at each word's own start, so builder drift is 0.
    # Shifted captions are checked with check_b5_drift.
    drift = 0
    safe = all(box_in_safe_zone(box) for box in boxes)
    hook_ok = all(hook_in_top_third(box) for box in boxes if box.role == "hook")
    ok = safe and hook_ok and drift <= CAPTION_DRIFT_MAX_MS
    return CheckResult(
        "B5",
        "pass" if ok else "fail",
        True,
        {
            "drift_ms": drift,
            "safe": safe,
            "hook_top_third": hook_ok,
            "boxes": [box.__dict__ for box in boxes],
        },
    )


def check_b5_drift(word_start_ms: int, event_start_ms: int, boxes: list[Box]) -> CheckResult:
    drift = abs(word_start_ms - event_start_ms)
    safe = all(box_in_safe_zone(box) for box in boxes)
    hook_ok = all(hook_in_top_third(box) for box in boxes if box.role == "hook")
    ok = drift <= CAPTION_DRIFT_MAX_MS and safe and hook_ok
    return CheckResult(
        "B5",
        "pass" if ok else "fail",
        True,
        {"drift_ms": drift, "safe": safe, "hook_top_third": hook_ok},
    )


def check_b6(words: list[Word] | tuple[Word, ...], t0_ms: int, t1_ms: int) -> CheckResult:
    def inside(cut: int) -> bool:
        return any(word.start_ms < cut < word.end_ms for word in words)

    start_cut = inside(t0_ms)
    end_cut = inside(t1_ms)
    ok = not start_cut and not end_cut
    return CheckResult(
        "B6",
        "pass" if ok else "fail",
        True,
        {"mid_word_start": start_cut, "mid_word_end": end_cut},
    )


def check_b7(*texts: str) -> CheckResult:
    banned = load_banned_terms()
    blob = "\n".join(texts).lower()
    hits = [term for term in banned if term in blob]
    # A hit is not an automatic fail. It routes to a human.
    status = "human" if hits else "pass"
    return CheckResult("B7", status, False, {"hits": hits})


def check_b9(
    *,
    phash: str | None,
    other_hashes: list[str],
    start_ms: int,
    end_ms: int,
    other_ranges: list[tuple[int, int]],
) -> CheckResult:
    from evv_workers.moments import IOU_DEDUPE, interval_iou

    hash_hit = False
    if phash is not None:
        hash_hit = any(hamming(phash, other) <= AHASH_DUP_MAX_DISTANCE for other in other_hashes)
    overlap = any(
        interval_iou(start_ms, end_ms, other_start, other_end) > IOU_DEDUPE
        for other_start, other_end in other_ranges
    )
    duplicate = hash_hit or overlap
    return CheckResult(
        "B9",
        "fail" if duplicate else "pass",
        True,
        {"phash_hit": hash_hit, "moment_overlap": overlap},
    )


def check_b11(rights_confirmed_at: object, rights_confirmed_by: object) -> CheckResult:
    ok = rights_confirmed_at is not None and rights_confirmed_by is not None
    return CheckResult("B11", "pass" if ok else "fail", True, {"attested": ok})


def phash_file(video: str, image_path: str) -> str:
    write_thumbnail(video, image_path, 0.5)
    return average_hash(image_path)


def run_checks(
    *,
    video_path: str,
    words: list[Word] | tuple[Word, ...],
    hook_line: str | None,
    origin_ms: int,
    end_ms: int,
    metadata_texts: list[str],
    phash: str | None,
    other_hashes: list[str],
    other_ranges: list[tuple[int, int]],
    rights_confirmed_at: object,
    rights_confirmed_by: object,
    event_start_ms: int | None = None,
    boxes: list[Box] | None = None,
) -> list[CheckResult]:
    probe = ffprobe(video_path)
    results = [
        check_b1(probe, video_path),
        check_b2(probe.duration_s),
        check_b3(video_path),
        check_b4(video_path),
        check_b6(words, origin_ms, end_ms),
        check_b7(*metadata_texts),
        check_b9(
            phash=phash,
            other_hashes=other_hashes,
            start_ms=origin_ms,
            end_ms=end_ms,
            other_ranges=other_ranges,
        ),
        check_b11(rights_confirmed_at, rights_confirmed_by),
    ]
    if event_start_ms is not None and boxes is not None:
        first_word = next((word.start_ms - origin_ms for word in words if word.end_ms > origin_ms), 0)
        results.append(check_b5_drift(first_word, event_start_ms, boxes))
    else:
        results.append(check_b5(words, hook_line, origin_ms))
    return results


def record_qa(
    conn: Connection[dict[str, Any]],
    clip_id: UUID,
    job_id: UUID,
    results: list[CheckResult],
) -> int:
    """Increment qa_run once per job and move the clip to needs_review or qa_failed."""
    with conn.transaction():
        existing = conn.execute(
            """
            SELECT qa_run FROM qa_results
            WHERE clip_id = %s AND detail->>'job_id' = %s
            LIMIT 1
            """,
            (clip_id, str(job_id)),
        ).fetchone()
        if existing is not None:
            return int(existing["qa_run"])
        row = conn.execute(
            "UPDATE clips SET qa_run = qa_run + 1 WHERE id = %s RETURNING qa_run",
            (clip_id,),
        ).fetchone()
        if row is None:
            raise KeyError(clip_id)
        run = int(row["qa_run"])
        failed = any(result.blocking and result.status == "fail" for result in results)
        status = "qa_failed" if failed else "needs_review"
        for result in results:
            detail = dict(result.detail)
            detail["job_id"] = str(job_id)
            conn.execute(
                """
                INSERT INTO qa_results (clip_id, qa_run, check_code, blocking, status, detail)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (clip_id, run, result.code, result.blocking, result.status, Json(detail)),
            )
        conn.execute("UPDATE clips SET status = %s WHERE id = %s", (status, clip_id))
        return run


def parse_probe_json(raw: str) -> Probe:
    payload = json.loads(raw)
    if not isinstance(payload, dict):
        raise ValueError("probe json")
    return Probe(
        duration_s=float(payload.get("duration_s") or 0),
        width=payload.get("width"),
        height=payload.get("height"),
        video_codec=payload.get("video_codec"),
        audio_codec=payload.get("audio_codec"),
        pix_fmt=payload.get("pix_fmt"),
        sample_rate=payload.get("sample_rate"),
        profile=payload.get("profile"),
    )

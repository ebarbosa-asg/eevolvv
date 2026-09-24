"""Local pipeline demo. No API keys and no network calls.

Fixture transcript -> mocked moments -> 9:16 captioned renders -> QA.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path
from typing import Any, cast

from evv_workers.captions import build_ass
from evv_workers.metadata import write_metadata
from evv_workers.moments import select_moments
from evv_workers.qa import phash_file, run_checks
from evv_workers.reframe import FaceSample, build_crop_plan
from evv_workers.render import render_clip, write_thumbnail
from evv_workers.transcript import Transcript

OPS_ROOT = Path(__file__).resolve().parents[3]
FIXTURES = OPS_ROOT / "fixtures"
OUT = OPS_ROOT / "demo-out"
SOURCE_SECONDS = "82"


class FixtureToolClient:
    def __init__(self, moments: dict[str, Any], metadata: dict[str, dict[str, Any]]) -> None:
        self.moments = moments
        self.metadata = metadata

    def tool_call(
        self,
        *,
        system: str,
        user: str,
        tool_name: str,
        tool_schema: dict[str, Any],
    ) -> dict[str, Any]:
        del system, tool_schema
        if tool_name == "submit_moments":
            return self.moments
        for start_id, payload in self.metadata.items():
            if f"{start_id}:" in user:
                return payload
        raise RuntimeError("no metadata fixture matched the clip")


def load_fixtures() -> tuple[Transcript, dict[str, Any], dict[str, dict[str, Any]]]:
    transcript_payload = json.loads((FIXTURES / "transcripts" / "demo_episode.json").read_text())
    moments_payload = json.loads((FIXTURES / "moments" / "demo_moments.json").read_text())
    metadata_payload = json.loads((FIXTURES / "moments" / "demo_metadata.json").read_text())
    if not isinstance(transcript_payload, dict) or not isinstance(moments_payload, dict):
        raise TypeError("fixture payload must be an object")
    if not isinstance(metadata_payload, dict):
        raise TypeError("fixture payload must be an object")
    transcript = Transcript.from_json(cast(dict[str, object], transcript_payload))
    return transcript, cast(dict[str, Any], moments_payload), cast(dict[str, dict[str, Any]], metadata_payload)


def ensure_source(path: Path) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "testsrc=size=960x540:rate=30",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=440:sample_rate=48000",
            "-t",
            SOURCE_SECONDS,
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-shortest",
            str(path),
        ],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr[-1500:])


def face_track(t0: float, t1: float, center_x: int) -> list[FaceSample]:
    samples: list[FaceSample] = []
    t = t0
    while t <= t1:
        samples.append(FaceSample(t=t, track_id="face", x=center_x - 40, y=180, w=80, h=80, confidence=0.9))
        t += 0.5
    return samples


def main() -> None:
    transcript, moment_payload, metadata_payload = load_fixtures()
    client = FixtureToolClient(moment_payload, metadata_payload)
    chosen = select_moments(client, transcript.sentences, transcript.words, needed=3)
    if len(chosen) < 3:
        raise RuntimeError(f"expected 3 moments, got {len(chosen)}")
    chosen = chosen[:3]

    OUT.mkdir(parents=True, exist_ok=True)
    source = OUT / "source.mp4"
    ensure_source(source)
    centers = (200, 480, 760)
    report: list[dict[str, Any]] = []
    hashes: list[str] = []
    ranges: list[tuple[int, int]] = []

    for index, moment in enumerate(chosen, start=1):
        words = [
            word
            for word in transcript.words
            if word.end_ms > moment.start_ms and word.start_ms < moment.end_ms
        ]
        plan = build_crop_plan(
            frame_w=960,
            frame_h=540,
            t0=moment.start_ms / 1000,
            t1=moment.end_ms / 1000,
            words=words,
            faces=face_track(moment.start_ms / 1000, moment.end_ms / 1000, centers[index - 1]),
            overrides={"A": "face"},
        )
        ass_path = OUT / f"clip-{index:02d}.ass"
        ass_path.write_text(
            build_ass(words, hook_line=moment.hook_line, origin_ms=moment.start_ms),
            encoding="utf-8",
        )
        output = OUT / f"clip-{index:02d}.mp4"
        render_clip(str(source), str(ass_path), str(output), plan, preset="veryfast")
        meta = write_metadata(
            client,
            transcript.sentences,
            start_sentence_id=moment.start_sentence_id,
            end_sentence_id=moment.end_sentence_id,
        )
        thumb = OUT / f"clip-{index:02d}.png"
        digest = phash_file(str(output), str(thumb))
        checks = run_checks(
            video_path=str(output),
            words=words,
            hook_line=moment.hook_line,
            origin_ms=moment.start_ms,
            end_ms=moment.end_ms,
            metadata_texts=[str(meta["youtube_title"]), str(meta["instagram_caption"])],
            phash=digest,
            other_hashes=list(hashes),
            other_ranges=list(ranges),
            rights_confirmed_at="fixture",
            rights_confirmed_by="fixture-operator",
        )
        hashes.append(digest)
        ranges.append((moment.start_ms, moment.end_ms))
        if index == 1:
            write_thumbnail(str(output), str(OUT / "clip-01-frame.png"), 1.0)
        failed = [check.code for check in checks if check.blocking and check.status == "fail"]
        report.append(
            {
                "clip": output.name,
                "hook": moment.hook_line,
                "start_ms": moment.start_ms,
                "end_ms": moment.end_ms,
                "phash": digest,
                "metadata_title": meta["youtube_title"],
                "checks": [
                    {"code": check.code, "status": check.status, "detail": check.detail} for check in checks
                ],
                "failed": failed,
            }
        )
        if failed:
            raise RuntimeError(f"{output.name} failed {failed}")

    (OUT / "qa.json").write_text(json.dumps(report, indent=2) + "\n")
    artifacts = Path("/opt/cursor/artifacts")
    if artifacts.is_dir():
        for name in ("clip-01.mp4", "clip-02.mp4", "clip-03.mp4", "clip-01-frame.png", "qa.json"):
            shutil.copy(OUT / name, artifacts / name)
    print(json.dumps({"clips": [item["clip"] for item in report], "out": str(OUT)}))


if __name__ == "__main__":
    main()

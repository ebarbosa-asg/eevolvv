from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass


class ProbeError(RuntimeError):
    pass


@dataclass(frozen=True)
class Probe:
    duration_s: float
    width: int | None
    height: int | None
    video_codec: str | None
    audio_codec: str | None
    pix_fmt: str | None
    sample_rate: int | None
    profile: str | None


def ffprobe(path: str) -> Probe:
    proc = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-print_format",
            "json",
            "-show_streams",
            "-show_format",
            path,
        ],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise ProbeError(proc.stderr.strip() or "ffprobe failed")
    payload = json.loads(proc.stdout)
    streams = payload.get("streams")
    if not isinstance(streams, list):
        streams = []
    video = next((s for s in streams if isinstance(s, dict) and s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if isinstance(s, dict) and s.get("codec_type") == "audio"), None)
    fmt = payload.get("format") if isinstance(payload.get("format"), dict) else {}
    duration_raw = fmt.get("duration") if isinstance(fmt, dict) else None
    duration = float(duration_raw) if duration_raw not in (None, "N/A") else 0.0
    return Probe(
        duration_s=duration,
        width=int(video["width"]) if isinstance(video, dict) and video.get("width") else None,
        height=int(video["height"]) if isinstance(video, dict) and video.get("height") else None,
        video_codec=str(video["codec_name"]) if isinstance(video, dict) and video.get("codec_name") else None,
        audio_codec=str(audio["codec_name"]) if isinstance(audio, dict) and audio.get("codec_name") else None,
        pix_fmt=str(video["pix_fmt"]) if isinstance(video, dict) and video.get("pix_fmt") else None,
        sample_rate=int(audio["sample_rate"]) if isinstance(audio, dict) and audio.get("sample_rate") else None,
        profile=str(video["profile"]) if isinstance(video, dict) and video.get("profile") else None,
    )


def require_video(probe: Probe) -> Probe:
    if probe.video_codec is None or probe.duration_s <= 0:
        raise ProbeError("reject: audio-only or non-video")
    return probe

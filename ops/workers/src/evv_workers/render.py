from __future__ import annotations

import subprocess
from pathlib import Path

from evv_workers.reframe import TARGET_ASPECT

TARGET_W = 1080
TARGET_H = 1920


class RenderError(RuntimeError):
    pass


def is_letterbox(segment: dict[str, float | int]) -> bool:
    width = float(segment["w"])
    height = float(segment["h"])
    if height <= 0:
        return True
    return abs((width / height) - TARGET_ASPECT) > 0.02


def _escape_filter_path(path: str) -> str:
    return path.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")


def video_filter(plan: list[dict[str, float | int]], ass_path: str) -> str:
    if not plan:
        raise RenderError("crop plan is empty")
    chains: list[str] = []
    labels: list[str] = []
    for index, segment in enumerate(plan):
        label = f"v{index}"
        t0 = float(segment["t0"])
        t1 = float(segment["t1"])
        if is_letterbox(segment):
            chains.append(
                f"[0:v]trim=start={t0}:end={t1},setpts=PTS-STARTPTS,split=2[fg{index}][bg{index}];"
                f"[bg{index}]scale={TARGET_W}:{TARGET_H},boxblur=20:1[bgb{index}];"
                f"[fg{index}]scale={TARGET_W}:{TARGET_H}:force_original_aspect_ratio=decrease[fgs{index}];"
                f"[bgb{index}][fgs{index}]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30[{label}]"
            )
        else:
            chains.append(
                f"[0:v]trim=start={t0}:end={t1},setpts=PTS-STARTPTS,"
                f"crop={int(segment['w'])}:{int(segment['h'])}:{int(segment['x'])}:{int(segment['y'])},"
                f"scale={TARGET_W}:{TARGET_H},setsar=1,fps=30[{label}]"
            )
        labels.append(f"[{label}]")
    ass = _escape_filter_path(ass_path)
    concat = "".join(labels) + f"concat=n={len(plan)}:v=1:a=0[vc];[vc]ass='{ass}'[v]"
    return ";".join(chains) + ";" + concat


def ffmpeg_args(
    source: str,
    ass_path: str,
    output: str,
    plan: list[dict[str, float | int]],
    *,
    preset: str | None = None,
) -> list[str]:
    t0 = float(plan[0]["t0"])
    t1 = float(plan[-1]["t1"])
    video_codec = ["-c:v", "libx264"]
    if preset:
        video_codec.extend(["-preset", preset])
    video_codec.extend(["-profile:v", "high"])
    return [
        "ffmpeg",
        "-y",
        "-i",
        source,
        "-filter_complex",
        video_filter(plan, ass_path),
        "-map",
        "[v]",
        "-map",
        "0:a?",
        "-af",
        f"atrim=start={t0}:end={t1},asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1:LRA=11",
        *video_codec,
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-b:v",
        "8M",
        "-c:a",
        "aac",
        "-ar",
        "48000",
        "-ac",
        "2",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        output,
    ]


def render_clip(
    source: str,
    ass_path: str,
    output: str,
    plan: list[dict[str, float | int]],
    *,
    preset: str | None = None,
) -> None:
    proc = subprocess.run(
        ffmpeg_args(source, ass_path, output, plan, preset=preset),
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        tail = proc.stderr[-2000:]
        raise RenderError(tail)


def write_thumbnail(video: str, image: str, at_s: float) -> None:
    proc = subprocess.run(
        ["ffmpeg", "-y", "-ss", f"{at_s:.3f}", "-i", video, "-frames:v", "1", image],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise RenderError(proc.stderr[-1000:])


def average_hash(image_path: str) -> str:
    from PIL import Image

    img = Image.open(image_path).convert("L").resize((8, 8))
    pixels = list(img.tobytes())
    average = sum(pixels) / len(pixels)
    bits = "".join("1" if pixel >= average else "0" for pixel in pixels)
    return f"{int(bits, 2):016x}"


def hamming(left: str, right: str) -> int:
    return (int(left, 16) ^ int(right, 16)).bit_count()


def moov_before_mdat(path: str) -> bool:
    with Path(path).open("rb") as handle:
        while True:
            header = handle.read(8)
            if len(header) < 8:
                return False
            size = int.from_bytes(header[:4], "big")
            name = header[4:8]
            header_len = 8
            if size == 1:
                extra = handle.read(8)
                if len(extra) < 8:
                    return False
                size = int.from_bytes(extra, "big")
                header_len = 16
            if name == b"moov":
                return True
            if name == b"mdat":
                return False
            if size < header_len:
                return False
            handle.seek(size - header_len, 1)

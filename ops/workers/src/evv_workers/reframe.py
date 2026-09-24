from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any, cast

from evv_workers.transcript import Word

MIN_SEGMENT_S = 1.5
FACE_CONFIDENCE_MIN = 0.6
TARGET_ASPECT = 9 / 16


@dataclass(frozen=True)
class FaceSample:
    t: float
    track_id: str
    x: int
    y: int
    w: int
    h: int
    confidence: float


@dataclass(frozen=True)
class SpeakerTurn:
    speaker: str
    t0: float
    t1: float


@dataclass(frozen=True)
class CropSegment:
    t0: float
    t1: float
    x: int
    y: int
    w: int
    h: int

    def as_dict(self) -> dict[str, float | int]:
        return {
            "t0": self.t0,
            "t1": self.t1,
            "x": self.x,
            "y": self.y,
            "w": self.w,
            "h": self.h,
        }


def speaker_turns(words: list[Word] | tuple[Word, ...]) -> list[SpeakerTurn]:
    ordered = list(words)
    if not ordered:
        return []
    turns: list[SpeakerTurn] = []
    start = ordered[0]
    prev = ordered[0]
    for word in ordered[1:]:
        if word.speaker != start.speaker:
            turns.append(SpeakerTurn(start.speaker, start.start_ms / 1000, prev.end_ms / 1000))
            start = word
        prev = word
    turns.append(SpeakerTurn(start.speaker, start.start_ms / 1000, prev.end_ms / 1000))
    return turns


def _solo(turn: SpeakerTurn, words: list[Word] | tuple[Word, ...]) -> bool:
    for word in words:
        if word.speaker == turn.speaker:
            continue
        if word.start_ms / 1000 < turn.t1 and word.end_ms / 1000 > turn.t0:
            return False
    return True


def assign_speaker_faces(
    turns: list[SpeakerTurn],
    words: list[Word] | tuple[Word, ...],
    faces: list[FaceSample],
    overrides: dict[str, str] | None = None,
) -> dict[str, str | None]:
    """Map each speaker to a face track by majority overlap on solo turns."""
    forced = overrides or {}
    assigned: dict[str, str | None] = {}
    for speaker in sorted({turn.speaker for turn in turns}):
        if speaker in forced:
            assigned[speaker] = forced[speaker]
            continue
        counts: dict[str, int] = {}
        for turn in turns:
            if turn.speaker != speaker or not _solo(turn, words):
                continue
            for face in faces:
                if turn.t0 <= face.t <= turn.t1:
                    counts[face.track_id] = counts.get(face.track_id, 0) + 1
        if not counts:
            assigned[speaker] = None
        else:
            assigned[speaker] = max(counts, key=lambda track: (counts[track], track))
    return assigned


def _even(value: int) -> int:
    value = max(2, value)
    return value if value % 2 == 0 else value - 1


def crop_9_16(
    frame_w: int,
    frame_h: int,
    cx: float,
    cy: float,
    bounds: tuple[int, int, int, int] | None = None,
) -> tuple[int, int, int, int]:
    bx, by, bw, bh = bounds or (0, 0, frame_w, frame_h)
    if bw / bh <= TARGET_ASPECT:
        width = bw
        height = int(round(width / TARGET_ASPECT))
        if height > bh:
            height = bh
            width = int(round(height * TARGET_ASPECT))
    else:
        height = bh
        width = int(round(height * TARGET_ASPECT))
        if width > bw:
            width = bw
            height = int(round(width / TARGET_ASPECT))
    width = min(_even(width), _even(bw))
    height = min(_even(height), _even(bh))
    x = int(round(cx - width / 2))
    y = int(round(cy - height / 2))
    x = min(max(bx, x), bx + bw - width)
    y = min(max(by, y), by + bh - height)
    return x, y, width, height


def gallery_tile(
    frame_w: int,
    frame_h: int,
    faces_at_t: list[FaceSample],
    track_id: str,
) -> tuple[int, int, int, int] | None:
    """When two or more faces are on screen, crop inside that face's tile."""
    tracks = {face.track_id: face for face in faces_at_t}
    if len(tracks) < 2 or track_id not in tracks:
        return None
    ordered = sorted(tracks.values(), key=lambda face: face.x + face.w / 2)
    centers = [face.x + face.w / 2 for face in ordered]
    index = next(i for i, face in enumerate(ordered) if face.track_id == track_id)
    edges = [0.0]
    for left, right in zip(centers, centers[1:], strict=False):
        edges.append((left + right) / 2)
    edges.append(float(frame_w))
    x = int(math.floor(edges[index]))
    right_edge = int(math.ceil(edges[index + 1]))
    return x, 0, max(2, right_edge - x), frame_h


def _median_face(samples: list[FaceSample]) -> FaceSample | None:
    if not samples:
        return None
    ordered = sorted(samples, key=lambda face: face.confidence)
    return ordered[len(ordered) // 2]


def _merge_short(segments: list[CropSegment]) -> list[CropSegment]:
    if len(segments) <= 1:
        return segments
    changed = True
    while changed and len(segments) > 1:
        changed = False
        for index, segment in enumerate(segments):
            if segment.t1 - segment.t0 >= MIN_SEGMENT_S:
                continue
            if index == 0:
                nxt = segments[1]
                segments[1] = CropSegment(segment.t0, nxt.t1, nxt.x, nxt.y, nxt.w, nxt.h)
                del segments[0]
            else:
                prev = segments[index - 1]
                segments[index - 1] = CropSegment(prev.t0, segment.t1, prev.x, prev.y, prev.w, prev.h)
                del segments[index]
            changed = True
            break
    return segments


def build_crop_plan(
    *,
    frame_w: int,
    frame_h: int,
    t0: float,
    t1: float,
    words: list[Word] | tuple[Word, ...],
    faces: list[FaceSample],
    overrides: dict[str, str] | None = None,
) -> list[dict[str, float | int]]:
    window_words = [
        word
        for word in words
        if word.end_ms / 1000 > t0 and word.start_ms / 1000 < t1
    ]
    turns = speaker_turns(window_words)
    if not turns:
        turns = [SpeakerTurn("A", t0, t1)]
    assignment = assign_speaker_faces(turns, window_words, faces, overrides)
    raw: list[CropSegment] = []
    cursor = t0
    for turn in turns:
        seg_t0 = max(t0, turn.t0)
        seg_t1 = min(t1, turn.t1)
        if seg_t1 <= seg_t0:
            continue
        if seg_t0 > cursor + 0.001:
            raw.append(CropSegment(cursor, seg_t0, 0, 0, frame_w, frame_h))
        track = assignment.get(turn.speaker)
        samples = [
            face
            for face in faces
            if face.track_id == track and seg_t0 <= face.t <= seg_t1
        ]
        chosen = _median_face(samples)
        if chosen is None or chosen.confidence < FACE_CONFIDENCE_MIN:
            raw.append(CropSegment(seg_t0, seg_t1, 0, 0, frame_w, frame_h))
        else:
            visible = [face for face in faces if seg_t0 <= face.t <= seg_t1]
            tile = gallery_tile(frame_w, frame_h, visible, chosen.track_id)
            cx = chosen.x + chosen.w / 2
            cy = chosen.y + chosen.h / 2
            x, y, w, h = crop_9_16(frame_w, frame_h, cx, cy, tile)
            raw.append(CropSegment(seg_t0, seg_t1, x, y, w, h))
        cursor = seg_t1
    if cursor < t1:
        raw.append(CropSegment(cursor, t1, 0, 0, frame_w, frame_h))
    merged = _merge_short(raw)
    return [segment.as_dict() for segment in merged]


def haar_confidence(level_weight: float) -> float:
    """Map an OpenCV Haar levelWeight into 0–1.

    levelWeight is not a probability. This squash is only so the 0.6 gate
    has a stable input. It is not a calibrated accuracy number.
    """
    if level_weight <= 0:
        return 0.0
    return max(0.0, min(1.0, 1.0 - math.exp(-level_weight / 4.0)))


def detect_faces_opencv(path: str, *, sample_every: int = 5) -> list[FaceSample]:
    import cv2

    capture = cv2.VideoCapture(path)
    if not capture.isOpened():
        raise RuntimeError(f"could not open video: {path}")
    cascade = cv2.CascadeClassifier(  # noqa: B009 — kept as a direct call; see type ignore below
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"  # type: ignore[attr-defined]
    )
    fps = capture.get(cv2.CAP_PROP_FPS) or 30.0
    tracks: list[tuple[float, float, FaceSample]] = []
    next_id = 1
    frame_index = 0
    samples: list[FaceSample] = []
    try:
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            if frame_index % sample_every == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                rects, _rejects, weights = cascade.detectMultiScale3(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    outputRejectLevels=True,
                )
                t = frame_index / fps
                for rect, weight in zip(rects, weights, strict=False):
                    x, y, w, h = (int(rect[0]), int(rect[1]), int(rect[2]), int(rect[3]))
                    cx = x + w / 2
                    cy = y + h / 2
                    track_id: str | None = None
                    best = 80.0
                    for prev_t, prev_cx, prev in tracks:
                        if t - prev_t > 1.0:
                            continue
                        dist = math.hypot(cx - prev_cx, cy - (prev.y + prev.h / 2))
                        if dist < best:
                            best = dist
                            track_id = prev.track_id
                    if track_id is None:
                        track_id = f"face-{next_id}"
                        next_id += 1
                    raw_weight = cast(Any, weight)
                    if isinstance(raw_weight, int | float):
                        weight_value = float(raw_weight)
                    else:
                        weight_value = float(raw_weight[0])
                    sample = FaceSample(
                        t=t,
                        track_id=track_id,
                        x=x,
                        y=y,
                        w=w,
                        h=h,
                        confidence=haar_confidence(weight_value),
                    )
                    samples.append(sample)
                    tracks.append((t, cx, sample))
            frame_index += 1
    finally:
        capture.release()
    return samples

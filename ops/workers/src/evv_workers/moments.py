from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from evv_workers.llm import ToolClient, validated_tool_call
from evv_workers.transcript import Sentence, Word

PRE_PAD_MS = 120
POST_PAD_MS = 250
MIN_MS = 20_000
MAX_MS = 75_000
MAX_LEADING_SILENCE_MS = 1_500
IOU_DEDUPE = 0.3

# MVP priors are 0. Rank = 0.6*llm + 0.2*prior + 0.1*energy + 0.1*topic_diversity.
W_LLM = 0.6
W_PRIOR = 0.2
W_ENERGY = 0.1
W_DIVERSITY = 0.1
ARCHETYPE_PRIOR = 0.0

ARCHETYPES = (
    "contrarian",
    "number",
    "story",
    "how_to",
    "mistake",
    "prediction",
    "confession",
    "question",
)

PROMPT_PATH = Path(__file__).resolve().parents[2] / "prompts" / "moments_v1.md"

MOMENTS_TOOL_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "required": ["moments"],
    "properties": {
        "moments": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": [
                    "start_sentence_id",
                    "end_sentence_id",
                    "hook_line",
                    "hook_archetype",
                    "topic",
                    "standalone_score",
                    "rationale",
                ],
                "properties": {
                    "start_sentence_id": {"type": "string"},
                    "end_sentence_id": {"type": "string"},
                    "hook_line": {"type": "string"},
                    "hook_archetype": {"type": "string", "enum": list(ARCHETYPES)},
                    "topic": {"type": "string"},
                    "standalone_score": {"type": "number", "minimum": 0, "maximum": 10},
                    "rationale": {"type": "string"},
                },
            },
        }
    },
}


@dataclass(frozen=True)
class MomentCandidate:
    start_sentence_id: str
    end_sentence_id: str
    hook_line: str
    hook_archetype: str
    topic: str
    standalone_score: float
    rationale: str
    start_ms: int
    end_ms: int
    rank_score: float


def prompt_text() -> str:
    return PROMPT_PATH.read_text()


def validate_moment_payload(
    payload: dict[str, Any],
    sentences: list[Sentence] | tuple[Sentence, ...],
    needed: int,
) -> tuple[bool, dict[str, Any] | None, str | None]:
    moments = payload.get("moments")
    if not isinstance(moments, list):
        return False, None, "missing moments"
    minimum = needed * 2
    if len(moments) < minimum:
        return False, None, f"expected at least {minimum} moments"
    index = {sentence.id: pos for pos, sentence in enumerate(sentences)}
    cleaned: list[dict[str, Any]] = []
    for item in moments:
        if not isinstance(item, dict):
            return False, None, "moment must be an object"
        start_id = item.get("start_sentence_id")
        end_id = item.get("end_sentence_id")
        if not isinstance(start_id, str) or not isinstance(end_id, str):
            return False, None, "sentence id required"
        if start_id not in index or end_id not in index:
            return False, None, "unknown sentence id"
        if index[start_id] > index[end_id]:
            return False, None, "sentence range is reversed"
        archetype = item.get("hook_archetype")
        if archetype not in ARCHETYPES:
            return False, None, "hook_archetype is not allowed"
        score = item.get("standalone_score")
        if isinstance(score, bool) or not isinstance(score, int | float):
            return False, None, "standalone_score must be a number"
        if score < 0 or score > 10:
            return False, None, "standalone_score out of range"
        for field in ("hook_line", "topic", "rationale"):
            if not isinstance(item.get(field), str) or not str(item.get(field)).strip():
                return False, None, f"{field} is required"
        cleaned.append(
            {
                "start_sentence_id": start_id,
                "end_sentence_id": end_id,
                "hook_line": str(item["hook_line"]),
                "hook_archetype": str(archetype),
                "topic": str(item["topic"]),
                "standalone_score": float(score),
                "rationale": str(item["rationale"]),
            }
        )
    return True, {"moments": cleaned}, None


def snap_range(
    sentences: list[Sentence] | tuple[Sentence, ...],
    words: list[Word] | tuple[Word, ...],
    start_sentence_id: str,
    end_sentence_id: str,
) -> tuple[int, int] | None:
    """Map sentence ids to a padded, clamped millisecond range.

    Returns None when the range cannot sit inside 20–75s or starts with more
    than 1.5s of silence before the first word.
    """
    order = list(sentences)
    index = {sentence.id: pos for pos, sentence in enumerate(order)}
    if start_sentence_id not in index or end_sentence_id not in index:
        return None
    i0 = index[start_sentence_id]
    i1 = index[end_sentence_id]
    if i1 < i0:
        return None

    def bounds(left: int, right: int) -> tuple[int, int]:
        t0 = max(0, order[left].start_ms - PRE_PAD_MS)
        t1 = order[right].end_ms + POST_PAD_MS
        return t0, t1

    while bounds(i0, i1)[1] - bounds(i0, i1)[0] > MAX_MS and i1 > i0:
        i1 -= 1
    while bounds(i0, i1)[1] - bounds(i0, i1)[0] < MIN_MS and i1 + 1 < len(order):
        i1 += 1
    while bounds(i0, i1)[1] - bounds(i0, i1)[0] < MIN_MS and i0 > 0:
        i0 -= 1
    t0, t1 = bounds(i0, i1)
    if t1 - t0 < MIN_MS or t1 - t0 > MAX_MS:
        return None
    first_speech: int | None = None
    for word in words:
        if word.end_ms > t0 and word.start_ms < t1:
            first_speech = word.start_ms
            break
    if first_speech is None:
        return None
    if first_speech - t0 > MAX_LEADING_SILENCE_MS:
        return None
    return t0, t1


def speech_energy(words: list[Word] | tuple[Word, ...], t0: int, t1: int) -> float:
    span = t1 - t0
    if span <= 0:
        return 0.0
    covered = 0
    for word in words:
        left = max(word.start_ms, t0)
        right = min(word.end_ms, t1)
        if right > left:
            covered += right - left
    return min(1.0, covered / span)


def interval_iou(a0: int, a1: int, b0: int, b1: int) -> float:
    inter = max(0, min(a1, b1) - max(a0, b0))
    union = (a1 - a0) + (b1 - b0) - inter
    if union <= 0:
        return 0.0
    return inter / union


def rank_moments(
    candidates: list[MomentCandidate],
    words: list[Word] | tuple[Word, ...],
) -> list[MomentCandidate]:
    """Greedy topic diversity: unseen topics receive the 0.1 term first."""
    scored: list[tuple[float, float, MomentCandidate]] = []
    for candidate in candidates:
        llm = candidate.standalone_score / 10
        energy = speech_energy(words, candidate.start_ms, candidate.end_ms)
        base = W_LLM * llm + W_PRIOR * ARCHETYPE_PRIOR + W_ENERGY * energy
        scored.append((base, energy, candidate))
    scored.sort(key=lambda item: item[0], reverse=True)
    seen: set[str] = set()
    ranked: list[MomentCandidate] = []
    for _base, energy, candidate in scored:
        diversity = 0.0 if candidate.topic in seen else 1.0
        seen.add(candidate.topic)
        total = (
            W_LLM * (candidate.standalone_score / 10)
            + W_PRIOR * ARCHETYPE_PRIOR
            + W_ENERGY * energy
            + W_DIVERSITY * diversity
        )
        ranked.append(
            MomentCandidate(
                start_sentence_id=candidate.start_sentence_id,
                end_sentence_id=candidate.end_sentence_id,
                hook_line=candidate.hook_line,
                hook_archetype=candidate.hook_archetype,
                topic=candidate.topic,
                standalone_score=candidate.standalone_score,
                rationale=candidate.rationale,
                start_ms=candidate.start_ms,
                end_ms=candidate.end_ms,
                rank_score=total,
            )
        )
    ranked.sort(key=lambda item: item.rank_score, reverse=True)
    return ranked


def dedupe_moments(ranked: list[MomentCandidate]) -> list[MomentCandidate]:
    kept: list[MomentCandidate] = []
    for candidate in ranked:
        if any(
            interval_iou(candidate.start_ms, candidate.end_ms, other.start_ms, other.end_ms)
            > IOU_DEDUPE
            for other in kept
        ):
            continue
        kept.append(candidate)
    return kept


def build_moments(
    payload: dict[str, Any],
    sentences: list[Sentence] | tuple[Sentence, ...],
    words: list[Word] | tuple[Word, ...],
) -> list[MomentCandidate]:
    raw = payload["moments"]
    if not isinstance(raw, list):
        raise TypeError("moments payload")
    snapped: list[MomentCandidate] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        window = snap_range(
            sentences,
            words,
            str(item["start_sentence_id"]),
            str(item["end_sentence_id"]),
        )
        if window is None:
            continue
        snapped.append(
            MomentCandidate(
                start_sentence_id=str(item["start_sentence_id"]),
                end_sentence_id=str(item["end_sentence_id"]),
                hook_line=str(item["hook_line"]),
                hook_archetype=str(item["hook_archetype"]),
                topic=str(item["topic"]),
                standalone_score=float(item["standalone_score"]),
                rationale=str(item["rationale"]),
                start_ms=window[0],
                end_ms=window[1],
                rank_score=0.0,
            )
        )
    return dedupe_moments(rank_moments(snapped, words))


def select_moments(
    client: ToolClient,
    sentences: list[Sentence] | tuple[Sentence, ...],
    words: list[Word] | tuple[Word, ...],
    *,
    needed: int,
) -> list[MomentCandidate]:
    sentence_lines = "\n".join(
        f"{sentence.id} [{sentence.start_ms}-{sentence.end_ms}] {sentence.speaker}: {sentence.text}"
        for sentence in sentences
    )
    user = (
        f"Select at least {needed * 2} moments.\n\nSentences:\n{sentence_lines}"
    )

    def validate(payload: dict[str, Any]) -> tuple[bool, dict[str, Any] | None, str | None]:
        return validate_moment_payload(payload, sentences, needed)

    parsed = validated_tool_call(
        client,
        system=prompt_text(),
        user=user,
        tool_name="submit_moments",
        tool_schema=MOMENTS_TOOL_SCHEMA,
        validate=validate,
    )
    return build_moments(parsed, sentences, words)

from __future__ import annotations

from pathlib import Path
from typing import Any

from evv_workers.llm import ToolClient, validated_tool_call
from evv_workers.transcript import Sentence

PROMPT_PATH = Path(__file__).resolve().parents[2] / "prompts" / "metadata_v1.md"
BANNED_PATH = Path(__file__).resolve().parents[2] / "banned_terms.txt"
YOUTUBE_TITLE_MAX = 100
INSTAGRAM_CAPTION_MAX = 2200
HASHTAG_MAX = 5

METADATA_TOOL_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "required": [
        "youtube_title",
        "youtube_description",
        "instagram_caption",
        "tiktok_caption",
        "hashtags",
        "claims",
    ],
    "properties": {
        "youtube_title": {"type": "string"},
        "youtube_description": {"type": "string"},
        "instagram_caption": {"type": "string"},
        "tiktok_caption": {"type": "string"},
        "hashtags": {"type": "array", "items": {"type": "string"}},
        "claims": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["text", "sentence_ids"],
                "properties": {
                    "text": {"type": "string"},
                    "sentence_ids": {"type": "array", "items": {"type": "string"}},
                },
            },
        },
    },
}


def load_banned_terms(path: Path | None = None) -> tuple[str, ...]:
    terms: list[str] = []
    for line in (path or BANNED_PATH).read_text().splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        terms.append(stripped.lower())
    return tuple(terms)


def clip_sentence_ids(
    sentences: list[Sentence] | tuple[Sentence, ...],
    start_sentence_id: str,
    end_sentence_id: str,
) -> set[str]:
    order = list(sentences)
    index = {sentence.id: pos for pos, sentence in enumerate(order)}
    if start_sentence_id not in index or end_sentence_id not in index:
        raise KeyError("clip sentence id is not in the transcript")
    start = index[start_sentence_id]
    end = index[end_sentence_id]
    if end < start:
        raise ValueError("clip sentence range is reversed")
    return {sentence.id for sentence in order[start : end + 1]}


def _texts(payload: dict[str, Any]) -> list[str]:
    values = [
        str(payload.get("youtube_title") or ""),
        str(payload.get("youtube_description") or ""),
        str(payload.get("instagram_caption") or ""),
        str(payload.get("tiktok_caption") or ""),
    ]
    hashtags = payload.get("hashtags")
    if isinstance(hashtags, list):
        values.extend(str(tag) for tag in hashtags)
    claims = payload.get("claims")
    if isinstance(claims, list):
        for claim in claims:
            if isinstance(claim, dict):
                values.append(str(claim.get("text") or ""))
    return values


def validate_metadata(
    payload: dict[str, Any],
    allowed_ids: set[str],
    banned: tuple[str, ...] | None = None,
) -> tuple[bool, dict[str, Any] | None, str | None]:
    required = (
        "youtube_title",
        "youtube_description",
        "instagram_caption",
        "tiktok_caption",
        "hashtags",
        "claims",
    )
    for field in required:
        if field not in payload:
            return False, None, f"missing {field}"
    title = payload["youtube_title"]
    caption = payload["instagram_caption"]
    hashtags = payload["hashtags"]
    claims = payload["claims"]
    if not isinstance(title, str) or len(title) > YOUTUBE_TITLE_MAX:
        return False, None, "youtube title must be at most 100 characters"
    if not isinstance(caption, str) or len(caption) > INSTAGRAM_CAPTION_MAX:
        return False, None, "instagram caption must be at most 2200 characters"
    if not isinstance(hashtags, list) or len(hashtags) > HASHTAG_MAX:
        return False, None, "at most 5 hashtags"
    if any(not isinstance(tag, str) or any(ch.isspace() for ch in tag) for tag in hashtags):
        return False, None, "hashtags must be single tokens"
    if not isinstance(claims, list):
        return False, None, "claims must be a list"
    for claim in claims:
        if not isinstance(claim, dict):
            return False, None, "claim must be an object"
        ids = claim.get("sentence_ids")
        if not isinstance(ids, list) or not ids:
            return False, None, "factual claim is missing sentence ids"
        if any(not isinstance(sentence_id, str) or sentence_id not in allowed_ids for sentence_id in ids):
            return False, None, "claim cites sentence outside clip"
    terms = banned if banned is not None else load_banned_terms()
    blob = "\n".join(_texts(payload)).lower()
    for term in terms:
        if term in blob:
            return False, None, f"banned term: {term}"
    return True, payload, None


def write_metadata(
    client: ToolClient,
    sentences: list[Sentence] | tuple[Sentence, ...],
    *,
    start_sentence_id: str,
    end_sentence_id: str,
) -> dict[str, Any]:
    allowed = clip_sentence_ids(sentences, start_sentence_id, end_sentence_id)
    lines = "\n".join(
        f"{sentence.id}: {sentence.text}"
        for sentence in sentences
        if sentence.id in allowed
    )
    user = f"Clip sentences:\n{lines}"

    def validate(payload: dict[str, Any]) -> tuple[bool, dict[str, Any] | None, str | None]:
        return validate_metadata(payload, allowed)

    return validated_tool_call(
        client,
        system=PROMPT_PATH.read_text(),
        user=user,
        tool_name="submit_metadata",
        tool_schema=METADATA_TOOL_SCHEMA,
        validate=validate,
    )

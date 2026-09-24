from __future__ import annotations

from evv_workers.captions import (
    DEFAULT_ACCENT,
    HOOK_SECONDS,
    accent_to_ass,
    box_in_safe_zone,
    build_ass,
    chunk_words,
    hook_in_top_third,
    layout_boxes,
)
from evv_workers.llm import LlmValidationError
from evv_workers.metadata import validate_metadata, write_metadata
from evv_workers.transcript import Sentence, Word


def _words() -> list[Word]:
    return [
        Word("w1", 0, 200, "A", "Hello"),
        Word("w2", 200, 400, "A", "there"),
        Word("w3", 700, 900, "A", "friend"),
    ]


def test_chunks_break_on_pause_and_length() -> None:
    chunks = chunk_words(_words())
    assert [chunk.text for chunk in chunks] == ["Hello there", "friend"]
    long = [
        Word("a", 0, 100, "A", "abcdefghij"),
        Word("b", 100, 200, "A", "klmnopqrs"),
    ]
    assert len(chunk_words(long)) == 2


def test_ass_highlights_accent_and_stays_in_safe_zone() -> None:
    ass = build_ass(_words(), hook_line="Do this", accent=DEFAULT_ACCENT)
    assert "PlayResX: 1080" in ass
    assert "PlayResY: 1920" in ass
    assert "0:00:00.00" in ass
    assert "0:00:02.50" in ass
    assert accent_to_ass("#3DFF8A") == "&H8AFF3D&"
    assert "&H8AFF3D&" in ass
    assert HOOK_SECONDS == 2.5
    boxes = layout_boxes(chunk_words(_words()), "Do this")
    assert boxes
    assert all(box_in_safe_zone(box) for box in boxes)
    assert all(hook_in_top_third(box) for box in boxes if box.role == "hook")
    golden = (Path_ass())
    assert ass == golden


def Path_ass() -> str:
    from pathlib import Path

    path = Path(__file__).parent / "golden" / "captions_basic.ass"
    return path.read_text()


class Scripted:
    def __init__(self, outputs: list[dict[str, object]]) -> None:
        self.outputs = outputs
        self.calls = 0

    def tool_call(
        self,
        *,
        system: str,
        user: str,
        tool_name: str,
        tool_schema: dict[str, object],
    ) -> dict[str, object]:
        output = self.outputs[self.calls]
        self.calls += 1
        return output


def _meta(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "youtube_title": "How the handoff works",
        "youtube_description": "A walk through the handoff.",
        "instagram_caption": "The handoff is the first change.",
        "tiktok_caption": "Start with the handoff.",
        "hashtags": ["#handoff", "#ops"],
        "claims": [{"text": "The handoff is the first change.", "sentence_ids": ["s0001"]}],
    }
    payload.update(overrides)
    return payload


def test_metadata_rejects_limits_banned_terms_and_uncited_claims() -> None:
    allowed = {"s0001", "s0002"}
    ok, _parsed, reason = validate_metadata(_meta(), allowed)
    assert ok and reason is None
    title = "x" * 101
    bad, _parsed, reason = validate_metadata(_meta(youtube_title=title), allowed)
    assert not bad and reason is not None and "100" in reason
    tags = [f"#t{i}" for i in range(6)]
    bad, _parsed, reason = validate_metadata(_meta(hashtags=tags), allowed)
    assert not bad and reason is not None and "5" in reason
    outside = _meta(claims=[{"text": "A later point.", "sentence_ids": ["s0099"]}])
    bad, _parsed, reason = validate_metadata(outside, allowed)
    assert not bad and reason == "claim cites sentence outside clip"
    banned = _meta(instagram_caption="This is guaranteed viral.")
    bad, _parsed, reason = validate_metadata(banned, allowed)
    assert not bad and reason is not None and "banned term" in reason


def test_metadata_retries_once_then_fails() -> None:
    sentences = [
        Sentence("s0001", 0, 1000, "A", "The handoff is the first change."),
        Sentence("s0002", 1000, 2000, "A", "Then we review it."),
    ]
    client = Scripted(
        [
            _meta(claims=[{"text": "Nope.", "sentence_ids": ["s0099"]}]),
            _meta(instagram_caption="guaranteed viral"),
        ]
    )
    try:
        write_metadata(client, sentences, start_sentence_id="s0001", end_sentence_id="s0002")
    except LlmValidationError as exc:
        assert "banned term" in exc.reason
    else:
        raise AssertionError("expected failure")
    assert client.calls == 2

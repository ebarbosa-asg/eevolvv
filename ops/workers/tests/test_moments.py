from __future__ import annotations

from evv_workers.llm import LlmValidationError
from evv_workers.moments import (
    ARCHETYPE_PRIOR,
    IOU_DEDUPE,
    MAX_LEADING_SILENCE_MS,
    POST_PAD_MS,
    PRE_PAD_MS,
    build_moments,
    prompt_text,
    select_moments,
    snap_range,
    validate_moment_payload,
)
from evv_workers.transcript import Sentence, Word


class Scripted:
    def __init__(self, outputs: list[dict[str, object]]) -> None:
        self.outputs = outputs
        self.calls = 0
        self.users: list[str] = []

    def tool_call(
        self,
        *,
        system: str,
        user: str,
        tool_name: str,
        tool_schema: dict[str, object],
    ) -> dict[str, object]:
        self.users.append(user)
        output = self.outputs[self.calls]
        self.calls += 1
        return output


def _sentences(count: int, each_ms: int = 5000) -> list[Sentence]:
    sentences: list[Sentence] = []
    for index in range(count):
        start = index * each_ms
        sentences.append(
            Sentence(
                id=f"s{index + 1:04d}",
                start_ms=start,
                end_ms=start + each_ms - 50,
                speaker="A",
                text=f"Sentence {index}.",
            )
        )
    return sentences


def _words_for(sentences: list[Sentence]) -> list[Word]:
    words: list[Word] = []
    for sentence in sentences:
        words.append(
            Word(
                id=f"w{len(words) + 1:04d}",
                start_ms=sentence.start_ms,
                end_ms=sentence.start_ms + 400,
                speaker=sentence.speaker,
                text=sentence.text,
            )
        )
    return words


def _moment(start: str, end: str, score: float, topic: str) -> dict[str, object]:
    return {
        "start_sentence_id": start,
        "end_sentence_id": end,
        "hook_line": "Here is the point",
        "hook_archetype": "how_to",
        "topic": topic,
        "standalone_score": score,
        "rationale": "It stands alone.",
    }


def test_prompt_is_versioned_file() -> None:
    text = prompt_text()
    assert "moments_v1" in text
    assert "start_sentence_id" in text
    assert "Never timestamps" in text


def test_validation_requires_double_count_and_sentence_ids() -> None:
    sentences = _sentences(8)
    ok, _parsed, reason = validate_moment_payload({"moments": [_moment("s0001", "s0002", 8, "a")]}, sentences, needed=2)
    assert not ok
    assert reason is not None and "at least 4" in reason
    bad_moment = {**_moment("s0001", "s0002", 8, "a"), "start_sentence_id": 12}
    bad, _parsed, reason = validate_moment_payload(
        {"moments": [bad_moment, bad_moment]},
        sentences,
        needed=1,
    )
    assert not bad
    assert reason == "sentence id required"
    archetype, _parsed, reason = validate_moment_payload(
        {"moments": [{**_moment("s0001", "s0002", 8, "a"), "hook_archetype": "viral"}] * 2},
        sentences,
        needed=1,
    )
    assert not archetype
    assert reason == "hook_archetype is not allowed"


def test_retry_then_fail() -> None:
    sentences = _sentences(8)
    words = _words_for(sentences)
    client = Scripted([{"moments": []}, {"moments": []}])
    try:
        select_moments(client, sentences, words, needed=2)
    except LlmValidationError as exc:
        assert "at least 4" in exc.reason
    else:
        raise AssertionError("expected validation failure")
    assert client.calls == 2
    assert "rejected" in client.users[1]


def test_snap_pads_clamps_and_drops_leading_silence() -> None:
    assert PRE_PAD_MS == 120
    assert POST_PAD_MS == 250
    assert MAX_LEADING_SILENCE_MS == 1500
    assert ARCHETYPE_PRIOR == 0.0
    sentences = _sentences(12, each_ms=5000)
    words = _words_for(sentences)
    window = snap_range(sentences, words, "s0001", "s0002")
    assert window is not None
    assert window[1] - window[0] <= 75_000
    assert window[1] - window[0] >= 20_000
    assert window[0] == 0
    long = snap_range(sentences, words, "s0001", "s0012")
    assert long is not None
    assert long[1] - long[0] <= 75_000
    silent_words = [Word("w0001", 5000, 5400, "A", "late")]
    silent_sentences = [Sentence("s0001", 0, 30000, "A", "late")]
    assert snap_range(silent_sentences, silent_words, "s0001", "s0001") is None


def test_rank_and_iou_dedupe() -> None:
    sentences = _sentences(20, each_ms=5000)
    words = _words_for(sentences)
    payload = {
        "moments": [
            _moment("s0001", "s0006", 9, "handoff"),
            _moment("s0002", "s0007", 8, "handoff"),
            _moment("s0010", "s0015", 7, "archive"),
            _moment("s0011", "s0016", 6, "archive"),
        ]
    }
    ranked = build_moments(payload, sentences, words)
    assert len(ranked) == 2
    assert ranked[0].topic == "handoff"
    assert ranked[0].rank_score > ranked[1].rank_score
    overlap = abs(ranked[0].start_ms - ranked[1].start_ms)
    assert overlap > 0
    assert IOU_DEDUPE == 0.3

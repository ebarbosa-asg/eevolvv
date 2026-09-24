"""Write the committed demo transcript and mocked model payloads.

Run from anywhere:
  python ops/fixtures/build_demo_fixtures.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

GROUPS = [
    (
        0,
        [
            "Send the full episode.",
            "We listen for a moment that stands alone.",
            "A strong hook names the tension first.",
            "The cut starts and ends on a full thought.",
            "Captions follow the words that were said.",
            "That is the point of a careful clip.",
        ],
    ),
    (
        28_000,
        [
            "The client approves before a post is queued.",
            "A promise we cannot support waits for a person.",
            "Rights are confirmed on the source file.",
            "We only take files the client authorized.",
            "The crop stays on the person speaking.",
            "A long silent open is dropped.",
        ],
    ),
    (
        56_000,
        [
            "Metadata points at sentences in the clip.",
            "A title can stay short and still be clear.",
            "Hashtags stay few so the caption is readable.",
            "The same moment should not ship twice.",
            "Loudness is checked before the clip moves on.",
            "A person still reviews the cut.",
        ],
    ),
]

HOOKS = [
    ("Send the episode", "how_to", "intake"),
    ("Client approves", "confession", "approval"),
    ("Cite the sentence", "how_to", "metadata"),
]
SENTENCE_MS = 4_000


def main() -> None:
    words: list[dict[str, object]] = []
    sentences: list[dict[str, object]] = []
    sentence_index = 1
    word_index = 1
    for origin, lines in GROUPS:
        for offset, line in enumerate(lines):
            start = origin + offset * SENTENCE_MS
            end = start + SENTENCE_MS
            sentence_id = f"s{sentence_index:02d}"
            sentence_index += 1
            tokens = line.replace(".", "").split()
            gap = 40
            slot = (SENTENCE_MS - gap * (len(tokens) - 1)) // len(tokens)
            cursor = start
            sentence_words: list[str] = []
            for token in tokens:
                word_end = cursor + slot
                words.append(
                    {
                        "id": f"w{word_index:03d}",
                        "start_ms": cursor,
                        "end_ms": word_end,
                        "speaker": "A",
                        "text": token,
                    }
                )
                sentence_words.append(token)
                word_index += 1
                cursor = word_end + gap
            sentences.append(
                {
                    "id": sentence_id,
                    "start_ms": start,
                    "end_ms": end,
                    "speaker": "A",
                    "text": " ".join(sentence_words) + ".",
                }
            )

    moments: list[dict[str, object]] = []
    for group_index, (_origin, _lines) in enumerate(GROUPS):
        start_id = f"s{group_index * 6 + 1:02d}"
        end_id = f"s{group_index * 6 + 6:02d}"
        hook, archetype, topic = HOOKS[group_index]
        for copy, score in ((1, 9), (2, 4)):
            moments.append(
                {
                    "start_sentence_id": start_id,
                    "end_sentence_id": end_id,
                    "hook_line": hook,
                    "hook_archetype": archetype,
                    "topic": topic,
                    "standalone_score": score,
                    "rationale": f"Fixture moment {copy} for {topic}.",
                }
            )

    metadata = {}
    for group_index, (_origin, _lines) in enumerate(GROUPS):
        start_id = f"s{group_index * 6 + 1:02d}"
        hook, _archetype, topic = HOOKS[group_index]
        metadata[start_id] = {
            "youtube_title": hook,
            "youtube_description": f"A clip about {topic}.",
            "instagram_caption": hook,
            "tiktok_caption": hook,
            "hashtags": ["eevolvv", topic],
            "claims": [{"text": hook, "sentence_ids": [start_id]}],
        }

    (ROOT / "transcripts").mkdir(exist_ok=True)
    (ROOT / "moments").mkdir(exist_ok=True)
    (ROOT / "transcripts" / "demo_episode.json").write_text(
        json.dumps({"words": words, "sentences": sentences, "speakers": ["A"]}, indent=2) + "\n"
    )
    (ROOT / "moments" / "demo_moments.json").write_text(json.dumps({"moments": moments}, indent=2) + "\n")
    (ROOT / "moments" / "demo_metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()

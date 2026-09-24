from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Word:
    id: str
    start_ms: int
    end_ms: int
    speaker: str
    text: str


@dataclass(frozen=True)
class Sentence:
    id: str
    start_ms: int
    end_ms: int
    speaker: str
    text: str


@dataclass(frozen=True)
class Transcript:
    words: tuple[Word, ...]
    sentences: tuple[Sentence, ...]
    speakers: tuple[str, ...]

    def to_json(self) -> dict[str, object]:
        return {
            "words": [asdict(word) for word in self.words],
            "sentences": [asdict(sentence) for sentence in self.sentences],
            "speakers": list(self.speakers),
        }

    @classmethod
    def from_json(cls, payload: dict[str, object]) -> Transcript:
        words_raw = payload["words"]
        sentences_raw = payload["sentences"]
        speakers_raw = payload["speakers"]
        if not isinstance(words_raw, list) or not isinstance(sentences_raw, list):
            raise TypeError("transcript words and sentences must be lists")
        if not isinstance(speakers_raw, list):
            raise TypeError("transcript speakers must be a list")
        words = tuple(_word(item) for item in words_raw)
        sentences = tuple(_sentence(item) for item in sentences_raw)
        speakers = tuple(str(item) for item in speakers_raw)
        return cls(words=words, sentences=sentences, speakers=speakers)


def _mapping(item: object) -> dict[str, object]:
    if not isinstance(item, dict):
        raise TypeError("transcript entry must be an object")
    return {str(key): value for key, value in item.items()}


def _word(item: object) -> Word:
    raw = _mapping(item)
    return Word(
        id=str(raw["id"]),
        start_ms=int(str(raw["start_ms"])),
        end_ms=int(str(raw["end_ms"])),
        speaker=str(raw["speaker"]),
        text=str(raw["text"]),
    )


def _sentence(item: object) -> Sentence:
    raw = _mapping(item)
    return Sentence(
        id=str(raw["id"]),
        start_ms=int(str(raw["start_ms"])),
        end_ms=int(str(raw["end_ms"])),
        speaker=str(raw["speaker"]),
        text=str(raw["text"]),
    )

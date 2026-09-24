from __future__ import annotations

import os
import time
from collections.abc import Callable
from decimal import Decimal
from typing import Any

import httpx

from evv_workers.cost import cost_meter
from evv_workers.transcript import Sentence, Transcript, Word

PAUSE_SPLIT_MS = 700
_END = (".", "!", "?")


class TranscriptionError(RuntimeError):
    pass


class AssemblyAIClient:
    """Submit a presigned URL and poll. The API key is never logged."""

    def __init__(
        self,
        api_key: str | None = None,
        *,
        base_url: str = "https://api.assemblyai.com",
        sleeper: Callable[[float], None] = time.sleep,
        client: httpx.Client | None = None,
    ) -> None:
        key = api_key if api_key is not None else os.environ.get("ASSEMBLYAI_API_KEY", "")
        if not key:
            raise RuntimeError("ASSEMBLYAI_API_KEY is not set")
        self._key = key
        self._base = base_url.rstrip("/")
        self._sleeper = sleeper
        self._client = client or httpx.Client(timeout=60)

    def submit(self, audio_url: str) -> str:
        response = self._client.post(
            f"{self._base}/v2/transcript",
            headers={"authorization": self._key},
            json={
                "audio_url": audio_url,
                "speaker_labels": True,
                "speech_model": "universal-2",
            },
        )
        response.raise_for_status()
        body = response.json()
        transcript_id = body.get("id")
        if not isinstance(transcript_id, str) or not transcript_id:
            raise TranscriptionError("submit response missing id")
        return transcript_id

    def poll(self, transcript_id: str, *, max_polls: int = 12) -> dict[str, Any]:
        delay = 1.0
        for _ in range(max_polls):
            response = self._client.get(
                f"{self._base}/v2/transcript/{transcript_id}",
                headers={"authorization": self._key},
            )
            response.raise_for_status()
            body = response.json()
            if not isinstance(body, dict):
                raise TranscriptionError("poll response was not an object")
            status = body.get("status")
            if status == "completed":
                return body
            if status == "error":
                raise TranscriptionError(str(body.get("error") or "transcription error"))
            self._sleeper(delay)
            delay = min(delay * 2, 30.0)
        raise TranscriptionError("transcription poll exceeded max attempts")

    def transcribe(self, audio_url: str) -> dict[str, Any]:
        return self.poll(self.submit(audio_url))


def _majority_speaker(words: list[Word]) -> str:
    counts: dict[str, int] = {}
    for word in words:
        counts[word.speaker] = counts.get(word.speaker, 0) + 1
    return max(counts, key=lambda speaker: (counts[speaker], speaker))


def normalize(raw_words: list[dict[str, Any]]) -> Transcript:
    """Split on terminal punctuation or a pause of at least 700ms."""
    words: list[Word] = []
    for index, raw in enumerate(raw_words, start=1):
        words.append(
            Word(
                id=f"w{index:04d}",
                start_ms=int(raw["start"]),
                end_ms=int(raw["end"]),
                speaker=str(raw.get("speaker") or "A"),
                text=str(raw["text"]),
            )
        )
    sentences: list[Sentence] = []
    buffer: list[Word] = []

    def flush() -> None:
        if not buffer:
            return
        sentences.append(
            Sentence(
                id=f"s{len(sentences) + 1:04d}",
                start_ms=buffer[0].start_ms,
                end_ms=buffer[-1].end_ms,
                speaker=_majority_speaker(buffer),
                text=" ".join(word.text for word in buffer),
            )
        )
        buffer.clear()

    for word in words:
        if buffer and word.start_ms - buffer[-1].end_ms >= PAUSE_SPLIT_MS:
            flush()
        buffer.append(word)
        if word.text.endswith(_END):
            flush()
    flush()
    speakers = tuple(sorted({word.speaker for word in words}))
    return Transcript(words=tuple(words), sentences=tuple(sentences), speakers=speakers)


def audio_hours_from_payload(payload: dict[str, Any], transcript: Transcript) -> Decimal:
    """AssemblyAI `audio_duration` is seconds. Fall back to the word span."""
    duration = payload.get("audio_duration")
    if isinstance(duration, int | float) and not isinstance(duration, bool):
        return Decimal(str(duration)) / Decimal(3600)
    if not transcript.words:
        return Decimal(0)
    span_ms = transcript.words[-1].end_ms - transcript.words[0].start_ms
    return Decimal(span_ms) / Decimal(3_600_000)


def transcribe_and_bill(
    conn: Any,
    client: AssemblyAIClient,
    audio_url: str,
    *,
    client_id: Any = None,
    job_id: Any = None,
) -> Transcript:
    raw = client.transcribe(audio_url)
    word_list = raw.get("words")
    if not isinstance(word_list, list):
        raise TranscriptionError("completed transcript missing words")
    transcript = normalize(word_list)
    hours = audio_hours_from_payload(raw, transcript)
    with cost_meter(
        conn,
        sku="assemblyai.universal-2.audio_hour",
        units=hours,
        client_id=client_id,
        job_id=job_id,
        meta={"speech_model": "universal-2"},
    ):
        pass
    return transcript

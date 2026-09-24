from __future__ import annotations

from decimal import Decimal
from typing import Any

import httpx
import psycopg
import respx

from evv_workers.transcribe import AssemblyAIClient, normalize, transcribe_and_bill


def test_normalize_splits_on_punctuation_and_pause() -> None:
    raw = [
        {"text": "Hello", "start": 0, "end": 200, "speaker": "A"},
        {"text": "there.", "start": 220, "end": 400, "speaker": "A"},
        {"text": "Next", "start": 1200, "end": 1400, "speaker": "B"},
        {"text": "line", "start": 1420, "end": 1600, "speaker": "B"},
    ]
    transcript = normalize(raw)
    assert [word.id for word in transcript.words] == ["w0001", "w0002", "w0003", "w0004"]
    assert [sentence.text for sentence in transcript.sentences] == ["Hello there.", "Next line"]
    assert transcript.sentences[0].id == "s0001"
    assert transcript.sentences[0].speaker == "A"
    assert transcript.sentences[1].speaker == "B"
    assert transcript.sentences[1].start_ms == 1200
    assert transcript.speakers == ("A", "B")


@respx.mock
def test_submit_presigned_url_and_poll_backoff(conn: psycopg.Connection[dict[str, Any]]) -> None:
    delays: list[float] = []
    respx.post("https://api.assemblyai.com/v2/transcript").mock(
        return_value=httpx.Response(200, json={"id": "tx_1"})
    )
    polls = {"n": 0}

    def poll(request: httpx.Request) -> httpx.Response:
        assert request.headers["authorization"] == "test-key"
        polls["n"] += 1
        if polls["n"] < 3:
            return httpx.Response(200, json={"id": "tx_1", "status": "processing"})
        return httpx.Response(
            200,
            json={
                "id": "tx_1",
                "status": "completed",
                "audio_duration": 3600,
                "words": [{"text": "Hi.", "start": 0, "end": 300, "speaker": "A"}],
            },
        )

    respx.get("https://api.assemblyai.com/v2/transcript/tx_1").mock(side_effect=poll)
    client = AssemblyAIClient("test-key", sleeper=delays.append)
    with httpx.Client() as http:
        client._client = http
        transcript = transcribe_and_bill(conn, client, "https://files.example/signed")
    assert delays == [1.0, 2.0]
    assert transcript.sentences[0].text == "Hi."
    row = conn.execute("SELECT amount_usd, sku FROM cost_events").fetchone()
    assert row is not None
    assert row["sku"] == "assemblyai.universal-2.audio_hour"
    assert Decimal(row["amount_usd"]) == Decimal("0.150000")


def test_missing_key_raises_before_network(monkeypatch: Any) -> None:
    monkeypatch.delenv("ASSEMBLYAI_API_KEY", raising=False)
    try:
        AssemblyAIClient("")
    except RuntimeError as exc:
        assert "ASSEMBLYAI_API_KEY" in str(exc)
    else:
        raise AssertionError("expected missing key")

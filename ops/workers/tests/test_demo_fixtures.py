from __future__ import annotations

from evv_workers.demo import FixtureToolClient, load_fixtures
from evv_workers.moments import select_moments


def test_mocked_moments_keep_three_nonoverlapping_windows() -> None:
    transcript, moments, metadata = load_fixtures()
    assert isinstance(moments["moments"], list)
    assert len(moments["moments"]) == 6
    chosen = select_moments(FixtureToolClient(moments, metadata), transcript.sentences, transcript.words, needed=3)
    assert len(chosen) == 3
    spans = sorted((moment.start_ms, moment.end_ms) for moment in chosen)
    for left, right in zip(spans, spans[1:], strict=False):
        assert left[1] <= right[0]
    for moment in chosen:
        assert 20_000 <= moment.end_ms - moment.start_ms <= 75_000
    assert metadata["s01"]["claims"][0]["sentence_ids"] == ["s01"]
    assert "s07" in metadata and "s13" in metadata

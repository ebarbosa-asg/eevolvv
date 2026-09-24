from __future__ import annotations

from decimal import Decimal
from typing import Any

import psycopg
import pytest

from evv_workers.cost import UnknownSkuError, cost_meter, load_catalog


def test_catalog_has_verified_sources() -> None:
    catalog = load_catalog()
    prices = catalog.all()
    assert prices
    for price in prices:
        assert price.verified_on.isoformat() == "2026-09-24"
        assert price.source.startswith("https://")
        assert price.usd_per_unit > 0


def test_unknown_sku_raises_and_writes_nothing(conn: psycopg.Connection[dict[str, Any]]) -> None:
    with pytest.raises(UnknownSkuError):
        with cost_meter(conn, sku="not-a-real-sku", units=Decimal(1)):
            pass
    row = conn.execute("SELECT count(*) AS n FROM cost_events").fetchone()
    assert row is not None and row["n"] == 0


def test_meter_writes_decimal_amount(conn: psycopg.Connection[dict[str, Any]]) -> None:
    with cost_meter(conn, sku="assemblyai.universal-2.audio_hour", units=Decimal("2")):
        pass
    row = conn.execute("SELECT amount_usd, unit FROM cost_events").fetchone()
    assert row is not None
    assert Decimal(row["amount_usd"]) == Decimal("0.300000")
    assert row["unit"] == "audio_hour"


def test_meter_skips_write_when_body_fails(conn: psycopg.Connection[dict[str, Any]]) -> None:
    with pytest.raises(RuntimeError):
        with cost_meter(conn, sku="anthropic.claude-sonnet-4-6.input_mtok", units=Decimal("1.5")):
            raise RuntimeError("no charge")
    row = conn.execute("SELECT count(*) AS n FROM cost_events").fetchone()
    assert row is not None and row["n"] == 0

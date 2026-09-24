from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any
from uuid import UUID

import yaml
from psycopg import Connection
from psycopg.types.json import Json

_PRICES_PATH = Path(__file__).resolve().parents[2] / "prices.yaml"


class UnknownSkuError(KeyError):
    """Raised when a cost event names a SKU that is not in prices.yaml."""


@dataclass(frozen=True)
class Price:
    sku: str
    usd_per_unit: Decimal
    unit: str
    verified_on: date
    source: str


class PriceCatalog:
    def __init__(self, prices: dict[str, Price]) -> None:
        self._prices = prices

    def require(self, sku: str) -> Price:
        try:
            return self._prices[sku]
        except KeyError as exc:
            raise UnknownSkuError(sku) from exc

    def all(self) -> tuple[Price, ...]:
        return tuple(self._prices.values())


def load_catalog(path: Path | None = None) -> PriceCatalog:
    raw_text = (path or _PRICES_PATH).read_text()
    loaded = yaml.safe_load(raw_text)
    if not isinstance(loaded, dict) or not isinstance(loaded.get("skus"), dict):
        raise ValueError("prices.yaml must contain a skus mapping")
    prices: dict[str, Price] = {}
    skus: dict[object, object] = loaded["skus"]
    for sku, spec in skus.items():
        if not isinstance(sku, str) or not isinstance(spec, dict):
            raise ValueError("each SKU must be a string key with a mapping value")
        spec_map: dict[str, Any] = spec
        for field in ("usd_per_unit", "unit", "verified_on", "source"):
            if field not in spec_map:
                raise ValueError(f"{sku} missing {field}")
        prices[sku] = Price(
            sku=sku,
            usd_per_unit=Decimal(str(spec_map["usd_per_unit"])),
            unit=str(spec_map["unit"]),
            verified_on=date.fromisoformat(str(spec_map["verified_on"])),
            source=str(spec_map["source"]),
        )
    return PriceCatalog(prices)


@contextmanager
def cost_meter(
    conn: Connection[dict[str, Any]],
    *,
    sku: str,
    units: Decimal,
    client_id: UUID | None = None,
    job_id: UUID | None = None,
    meta: dict[str, Any] | None = None,
    catalog: PriceCatalog | None = None,
) -> Iterator[Price]:
    """Write one cost_events row after the block succeeds.

    Unknown SKUs raise before the block runs. A raised body writes nothing.
    """
    price = (catalog or load_catalog()).require(sku)
    yield price
    amount = (Decimal(units) * price.usd_per_unit).quantize(Decimal("0.000001"))
    with conn.transaction():
        conn.execute(
            """
            INSERT INTO cost_events (client_id, job_id, sku, units, unit, amount_usd, meta)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (client_id, job_id, sku, units, price.unit, amount, Json(meta or {})),
        )

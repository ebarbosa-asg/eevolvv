import { readFileSync } from "node:fs";
import { isStale, parseSnapshot } from "../lib/proof";

const missingSource = parseSnapshot({
  kpis: [{ id: "views", label: "Views", unit: "count", value: 1, asOf: "2026-01-01T00:00:00.000Z" }],
});
if (missingSource.ok) {
  console.error("schema accepted a KPI without source");
  process.exit(1);
}

const fractionalCents = parseSnapshot({
  kpis: [{ id: "spend", label: "Spend", unit: "cents", value: 10.5, source: "stripe", asOf: "2026-01-01T00:00:00.000Z" }],
});
if (fractionalCents.ok) {
  console.error("schema accepted fractional cents");
  process.exit(1);
}

if (!isStale("2020-01-01T00:00:00.000Z", Date.parse("2020-01-04T00:00:00.000Z"))) {
  console.error("expected a 72h-old KPI to be stale");
  process.exit(1);
}

const file = "content/proof/snapshot.json";
const raw = JSON.parse(readFileSync(file, "utf8"));
const parsed = parseSnapshot(raw);
if (!parsed.ok) {
  console.error(parsed.error);
  process.exit(1);
}
console.log(`proof:check ok (${parsed.data.kpis.length} kpis)`);

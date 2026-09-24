import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { formatKpiValue, isStale, parseSnapshot, type ProofKpi } from "@/lib/proof";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Proof · eevolvv" },
  description: "Receipts from eevolvv’s own channels. Missing data stays missing.",
  alternates: { canonical: absoluteUrl("/proof") },
  robots: { index: false, follow: false },
};

function loadSnapshot(): ProofKpi[] {
  try {
    const raw = JSON.parse(readFileSync(path.join(process.cwd(), "content/proof/snapshot.json"), "utf8"));
    const parsed = parseSnapshot(raw);
    if (!parsed.ok) return [];
    return [...parsed.data.kpis];
  } catch {
    return [];
  }
}

export default function ProofPage() {
  const kpis = loadSnapshot();
  return (
    <section className="section proof">
      <div className="wrap proof-wrap">
        <p className="kicker">Proof</p>
        <h1>Receipts, not screenshots</h1>
        <p className="lead">Our own channels. Live numbers, updated nightly. Missing data stays missing.</p>
        {kpis.length === 0 ? (
          <p className="proof-empty">Awaiting first export.</p>
        ) : (
          <ul className="proof-list">
            {kpis.map((kpi) => (
              <li key={kpi.id}>
                <span className="proof-label">{kpi.label}</span>
                <strong>{formatKpiValue(kpi)}</strong>
                <span className="muted">
                  {kpi.source} · {kpi.asOf}
                </span>
                {isStale(kpi.asOf) ? <span className="stale">Stale</span> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

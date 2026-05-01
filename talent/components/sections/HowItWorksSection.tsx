"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

const OP_STEPS = [
  ["SIGNAL", "Résumé or paragraph. We extract skills; you correct the misses."],
  ["WAIT", "No spam, no data resale. Quiet until there’s real scope."],
  ["MATCH", "Scoped work lands. Opt in — or pass."],
];

const BUYER_STEPS = [
  ["BRIEF", "What must ship — task, contract, or consult."],
  ["PLACE", "One matched operator from the pool."],
  ["DELIVER", "Work ships. Payout clears. Next."],
];

export function HowItWorksSection() {
  return (
    <section id="how" style={{ padding: "72px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader number="02" eyebrow="HOW IT MOVES" title="Three beats. Two sides." note="3 · 3" />
        <div className="process-shell">
          <div className="process-tab process-tab--l mono" role="presentation">
            OPERATOR · TALENT
          </div>
          <div className="process-vline" aria-hidden />
          <div className="process-tab process-tab--r mono" role="presentation">
            BUYER · WORK
          </div>
          <ProcessTrack className="process-col--l" items={OP_STEPS} cta="JOIN THE POOL →" href="/join" />
          <ProcessTrack className="process-col--r" items={BUYER_STEPS} cta="POST WORK →" href="/post" />
        </div>
      </div>
    </section>
  );
}

function ProcessTrack({
  className = "",
  items,
  cta,
  href,
}: {
  className?: string;
  items: string[][];
  cta: string;
  href: string;
}) {
  return (
    <div className={["process-col", className].filter(Boolean).join(" ")}>
      <div>
        {items.map(([k, v], i) => (
          <div
            key={k}
            style={{
              display: "grid",
              gridTemplateColumns: "38px 1fr",
              gap: 12,
              padding: "11px 0",
              borderBottom: i < items.length - 1 ? "1px dashed var(--rule)" : "none",
            }}
          >
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--accent)", fontWeight: 600 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, letterSpacing: "-0.01em" }}>{k}</div>
              <div style={{ fontSize: 12, opacity: 0.68, lineHeight: 1.45 }}>{v}</div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href={href}
        className="mono"
        style={{
          display: "block",
          marginTop: 16,
          width: "100%",
          padding: "11px 0",
          background: "var(--ink)",
          color: "var(--paper)",
          fontSize: 10,
          letterSpacing: "0.18em",
          fontWeight: 600,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

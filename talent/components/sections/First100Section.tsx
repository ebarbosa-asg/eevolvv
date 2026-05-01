"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

// ─── Abundance mosaic data ─────────────────────────────────────────────────
// Each row is an array of { width (flex units), label, accent }
// Together they form a packed mosaic suggesting every scale of scope
const MOSAIC_ROWS: { flex: number; label: string; accent?: boolean }[][] = [
  [
    { flex: 3, label: "Enterprise program", accent: true },
    { flex: 2, label: "Staff aug" },
    { flex: 1, label: "Task" },
    { flex: 1, label: "Task" },
  ],
  [
    { flex: 1, label: "Fix" },
    { flex: 1, label: "Task" },
    { flex: 4, label: "Multi-year contract", accent: true },
    { flex: 1, label: "Audit" },
  ],
  [
    { flex: 2, label: "Sprint project" },
    { flex: 1, label: "Fix" },
    { flex: 1, label: "Fix" },
    { flex: 3, label: "R&D engagement", accent: true },
  ],
  [
    { flex: 1, label: "Task" },
    { flex: 2, label: "Consulting block" },
    { flex: 1, label: "Task" },
    { flex: 2, label: "Fractional role" },
    { flex: 1, label: "Fix" },
  ],
  [
    { flex: 3, label: "Government contract", accent: true },
    { flex: 1, label: "Task" },
    { flex: 2, label: "Design sprint" },
    { flex: 1, label: "Fix" },
  ],
  [
    { flex: 1, label: "Fix" },
    { flex: 1, label: "Task" },
    { flex: 2, label: "Data project" },
    { flex: 1, label: "Task" },
    { flex: 3, label: "Platform build", accent: true },
  ],
  [
    { flex: 2, label: "Advisory block" },
    { flex: 3, label: "Systems integration", accent: true },
    { flex: 1, label: "Task" },
    { flex: 1, label: "Fix" },
  ],
  [
    { flex: 1, label: "Task" },
    { flex: 2, label: "Proposal support" },
    { flex: 1, label: "Fix" },
    { flex: 1, label: "Task" },
    { flex: 2, label: "QA engagement" },
    { flex: 1, label: "Task" },
  ],
];

export function First100Section() {
  return (
    <section style={{ padding: "120px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader
          number="05"
          eyebrow="THE SCOPE OF WORK"
          title="Every size. Every domain."
          note="ABUNDANCE"
        />

        <div className="grid mt-14 abundance-grid" style={{ gap: 64, marginTop: 64 }}>
          {/* Left — copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(20,20,19,0.80)", margin: 0 }}>
              The work isn&apos;t scarce. Small tasks, large programs, fractional roles, one-off builds — it&apos;s all out there, constantly.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(20,20,19,0.60)", marginTop: 18 }}>
              The gap has never been a shortage of work. It&apos;s been the distance between the person who can do it and the person who needs it done.
            </p>
            <p
              className="serif"
              style={{ fontStyle: "italic", fontSize: 20, lineHeight: 1.45, marginTop: 32, color: "rgba(20,20,19,0.78)", maxWidth: 420 }}
            >
              &ldquo;Any scope. Any domain. The right person, dispatched.&rdquo;
            </p>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.5, marginTop: 12 }}>
              — EEVOLVV/TALENT, MISSION STATEMENT
            </div>

            <Link
              href="/join"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 40,
                background: "var(--ink)", color: "var(--paper)",
                padding: "16px 28px",
                fontSize: 14, fontWeight: 600, letterSpacing: "0.02em",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              Get in the pool →
            </Link>
          </div>

          {/* Right — mosaic */}
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 14 }}>
              SCOPE · ALL SIZES · ALL DOMAINS
            </div>
            <div
              style={{
                border: "1px solid var(--ink)",
                padding: 12,
                background: "rgba(255,255,255,0.45)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {MOSAIC_ROWS.map((row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 6 }}>
                  {row.map((cell, ci) => (
                    <MosaicCell key={ci} flex={cell.flex} label={cell.label} accent={cell.accent} />
                  ))}
                </div>
              ))}
            </div>
            <div
              className="mono"
              style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10, letterSpacing: "0.18em", opacity: 0.5 }}
            >
              <span>↳ EVERY SCOPE HAS A LEVER</span>
              <span>· YOU ARE THE LEVER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid responsive styles */}
      <style>{`
        .abundance-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .abundance-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function MosaicCell({
  flex,
  label,
  accent,
}: {
  flex: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="mono mosaic-cell"
      style={{
        flex,
        padding: "10px 10px",
        border: `1px solid ${accent ? "var(--accent)" : "var(--rule)"}`,
        background: accent ? "rgba(22,189,170,0.07)" : "rgba(255,255,255,0.5)",
        fontSize: 9,
        letterSpacing: "0.12em",
        color: accent ? "var(--accent)" : "rgba(20,20,19,0.5)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,
        transition: "background 0.15s, color 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "var(--ink)";
        el.style.color = "var(--paper)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = accent ? "rgba(22,189,170,0.07)" : "rgba(255,255,255,0.5)";
        el.style.color = accent ? "var(--accent)" : "rgba(20,20,19,0.5)";
      }}
    >
      {label.toUpperCase()}
    </div>
  );
}

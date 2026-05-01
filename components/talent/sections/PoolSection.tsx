"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/talent/SectionHeader";
import { SKILLS_BY_DOMAIN, DOMAINS } from "@/data/talent/domains";

export function PoolSection() {
  const [openDomain, setOpenDomain] = useState(DOMAINS[0]);

  return (
    <section id="pool" className="pool-section" style={{ padding: "88px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="pool-wave" aria-hidden>
        <svg
          viewBox="0 0 1200 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 14, display: "block" }}
        >
          <path
            d="M0 10 Q300 2 600 10 T1200 10"
            stroke="currentColor"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 13 Q280 7 560 13 T1120 13"
            stroke="currentColor"
            strokeWidth="0.85"
            opacity={0.65}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px", position: "relative" }}>
        <SectionHeader number="03" eyebrow="CHART THE DEPTHS" title="Eight currents. One pool." note={`N=${DOMAINS.length}`} />

        <p className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.48, marginTop: 14, marginBottom: 0 }}>
          EIGHT CURRENTS · SELECT A DOMAIN TO SOUND SAMPLE SKILLS
        </p>

        <div className="grid pool-grid" style={{ gap: 40, marginTop: 36, borderTop: "1px solid var(--ink)", paddingTop: 4 }}>
          <div>
            {DOMAINS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => setOpenDomain(d)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--rule)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: openDomain === d ? 600 : 400,
                  color: openDomain === d ? "var(--ink)" : "rgba(20,20,19,0.55)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    openDomain === d ? "var(--ink)" : "rgba(20,20,19,0.55)";
                }}
              >
                <span>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.5, marginRight: 12 }}>
                    D-{String(i + 1).padStart(2, "0")}
                  </span>
                  {d}
                </span>
                <span style={{ color: "var(--accent)", opacity: openDomain === d ? 1 : 0 }} aria-hidden>
                  ●
                </span>
              </button>
            ))}
          </div>

          <div className="pool-basin">
            <div key={openDomain} className="pool-skills-panel">
              <div className="mono pool-readout-kicker" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.55, marginBottom: 18 }}>
                READOUT · {openDomain.toUpperCase()}
              </div>
              <div className="pool-skill-tags">
                {SKILLS_BY_DOMAIN[openDomain].map((s) => (
                  <span key={s} className="pool-skill-chip">
                    {s}
                  </span>
                ))}
              </div>
              <p className="serif pool-readout-quote">
                &ldquo;Give me a lever long enough and a place to stand, and I shall move the world.&rdquo;
              </p>
              <div className="mono pool-readout-datum" style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.5, marginTop: 10 }}>
                DATUM LINE · ARCHIMEDES OF SYRACUSE, c. 250 BCE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from "@/components/talent/SectionHeader";
import { WORK_TYPES } from "@/data/talent/workTypes";

export function WorkTypesSection() {
  return (
    <section id="work" style={{ padding: "120px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader number="01" eyebrow="WHAT IS THE WORK" title="Three shapes of scope." note="A · B · C" />
        <div
          className="grid mt-12 work-types-grid"
          style={{ gap: 0, marginTop: 56, border: "1px solid var(--ink)" }}
        >
          {WORK_TYPES.map((w, i) => (
            <div
              key={w.code}
              className="work-card"
              style={{
                borderRight: i < 2 ? "1px solid var(--ink)" : "none",
                padding: 32,
                position: "relative",
              }}
            >
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 20 }}>
                TYPE · {w.code}
              </div>
              <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>
                {w.name}
              </div>
              <div className="serif" style={{ fontStyle: "italic", fontSize: 18, color: "var(--accent)", marginBottom: 20 }}>
                {w.plain}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.75, margin: 0, marginBottom: 28 }}>
                {w.long}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                <div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", opacity: 0.5 }}>RANGE</div>
                  <div className="mono" style={{ fontSize: 13, marginTop: 4 }}>{w.range}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", opacity: 0.5 }}>SPAN</div>
                  <div className="mono" style={{ fontSize: 13, marginTop: 4 }}>{w.span}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

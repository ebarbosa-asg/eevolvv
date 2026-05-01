import { SectionHeader } from "@/components/SectionHeader";

const STATUS_ITEMS = [
  { label: "STATUS", value: "Open for briefs", state: "live" },
  { label: "POOL SIZE", value: "Small. Growing by hand.", state: "neutral" },
  { label: "MATCHING", value: "Manually, by the founder", state: "live" },
  { label: "PRICING", value: "Set per engagement", state: "neutral" },
  { label: "GEOGRAPHY", value: "U.S. — remote and on-site", state: "neutral" },
  { label: "PROOF", value: "We haven't earned it yet", state: "honest" },
  { label: "BACKED BY", value: "Nobody. Bootstrapped.", state: "neutral" },
  { label: "SUPPORTED HOURS", value: "Whenever the founder is awake", state: "honest" },
];

export function TrueTodaySection() {
  return (
    <section style={{ padding: "120px 0", borderBottom: "1px solid var(--rule)", background: "rgba(20,20,19,0.02)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader number="04" eyebrow="WHAT IS TRUE TODAY" title="A status sheet, kept honest." note="UPDATED BY HAND" />

        <div
          className="grid mt-12"
          style={{ gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 56, border: "1px solid var(--ink)" }}
        >
          {STATUS_ITEMS.map((it, i) => (
            <div
              key={i}
              className="status-cell"
              style={{
                padding: "22px 28px",
                borderRight: i % 2 === 0 ? "1px solid var(--ink)" : "none",
                borderBottom: i < STATUS_ITEMS.length - 2 ? "1px solid var(--ink)" : "none",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 18,
                alignItems: "baseline",
              }}
            >
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, minWidth: 110 }}>
                {it.label}
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
                {it.state === "live" && (
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", flexShrink: 0 }} />
                )}
                {it.state === "honest" && (
                  <span className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: "0.2em" }}>※</span>
                )}
                <span>{it.value}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.5, marginTop: 18, textAlign: "right" }}>
          ※ THESE WILL CHANGE. WE&apos;LL UPDATE THIS PAGE WHEN THEY DO.
        </p>
      </div>
    </section>
  );
}

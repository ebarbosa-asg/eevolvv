import { SectionHeader } from "@/components/talent/SectionHeader";

const NOT_ITEMS = [
  ["NOT A JOB BOARD", "No infinite scroll of \"actively recruiting\" listings that closed six weeks ago."],
  ["NOT A RECRUITER", "Nobody here is going to e-mail you with \"exciting rocket-ship opportunity 🚀.\""],
  ["NOT AN ALGORITHM", "No black box that decides you're an 82% fit for a job you'd hate."],
  ["NOT A NETWORK", "We will not ask you to congratulate your seventh-grade lab partner on her work anniversary."],
  ["NOT A FUNNEL", "There is no 47-question application. There is no take-home. There is no \"final round\" with five strangers."],
  ["NOT FOR EVERYONE", "If you don't fit, we'll say so. The kindest answer is the honest one."],
];

export function NotSection() {
  return (
    <section style={{ padding: "120px 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <SectionHeader number="07" eyebrow="WHAT WE ARE NOT" title="A short list of relief." note="¬" />
        <div
          className="grid mt-12 not-grid"
          style={{ gap: 0, marginTop: 56, border: "1px solid var(--ink)" }}
        >
          {NOT_ITEMS.map(([k, v], i) => (
            <div
              key={i}
              className="not-cell"
              style={{
                padding: 28,
                borderRight: i % 2 === 0 ? "1px solid var(--ink)" : "none",
                borderBottom: i < NOT_ITEMS.length - 2 ? "1px solid var(--ink)" : "none",
              }}
            >
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent)", marginBottom: 12, fontWeight: 600 }}>
                ¬ {k}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.85 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

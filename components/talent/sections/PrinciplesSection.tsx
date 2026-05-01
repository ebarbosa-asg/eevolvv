const TENETS = [
  [
    "One match, picked by hand",
    "When scope arrives, you get one person who fits — not five résumés. Software helps us read; humans choose. We won’t pretend otherwise.",
  ],
  [
    "No ghosting. No warehouse",
    "If we don’t have the fit, we say so the same day. We don’t store you to sell you — leave the pool, and your record goes with you.",
  ],
  ["Scope or nothing", "Every engagement starts with a written scope. Vague work is unhappy work."],
  ["Pay clears, fast", "Operators get paid on delivery. We don’t sit on funds. Net-zero is the goal."],
];

export function PrinciplesSection() {
  return (
    <section
      className="principles-section"
      style={{ padding: "88px 0", borderBottom: "1px solid var(--rule)", background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <header className="principles-head">
          <p className="mono principles-kicker">§ 06 · OPERATING PRINCIPLES</p>
          <h2 className="principles-title">
            Four things we hold to <em className="serif">before</em> we have customers.
          </h2>
          <p className="principles-lede">
            A company will tell you anything once it has revenue to protect. Here&apos;s what we believe now, while it still
            costs nothing to say.
          </p>
        </header>

        <div className="principles-grid">
          {TENETS.map(([k, v], i) => (
            <div key={k} className="tenet-cell">
              <div className="mono tenet-index">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="tenet-title">{k}.</div>
                <p className="tenet-body">{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

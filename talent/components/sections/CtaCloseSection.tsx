import Link from "next/link";

export function CtaCloseSection() {
  return (
    <section style={{ padding: "120px 0", background: "var(--ink)", color: "var(--paper)" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.5, marginBottom: 24 }}>
          EEVOLVV / TALENT · CALL TO ACTION
        </div>
        <h2
          style={{
            fontSize: "clamp(48px, 8vw, 128px)",
            fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.92, margin: 0,
          }}
        >
          You bring the{" "}
          <em className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>skills.</em>
          <br />
          We bring the{" "}
          <em className="serif" style={{ fontStyle: "italic" }}>work.</em>
        </h2>
        <div className="cta-close-actions" style={{ marginTop: 56 }}>
          <Link
            href="/join"
            style={{
              background: "var(--accent)", color: "var(--paper)",
              padding: "20px 32px",
              fontSize: 16, fontWeight: 600, letterSpacing: "0.02em",
              textDecoration: "none", display: "inline-block",
            }}
          >
            Join the pool →
          </Link>
        </div>
      </div>
    </section>
  );
}

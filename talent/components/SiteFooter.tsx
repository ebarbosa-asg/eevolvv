import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", padding: "56px 0 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.4fr) repeat(3,minmax(0,1fr))", gap: 48 }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <LogoMark />
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.18em", fontWeight: 600 }}>
                EEVOLVV <span style={{ color: "var(--accent)" }}>/ TALENT</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.65, margin: 0 }}>
              Skilled work, placed by hand. Founded 2026. Bootstrapped. Operating one brief at a time.
            </p>
          </div>

          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 16 }}>
              EEVOLVV
            </div>
            <a href="https://eevolvv.com" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              eevolvv.com ↗
            </a>
            <a href="https://eevolvv.com/#diagnostic" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              Free AI Audit
            </a>
            <a href="https://eevolvv.com/#pricing" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              Pricing
            </a>
          </div>

          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 16 }}>
              TALENT
            </div>
            <Link href="/join" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              Join the pool
            </Link>
            <a href="#how" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              How it works
            </a>
          </div>

          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", opacity: 0.55, marginBottom: 16 }}>
              LEGAL
            </div>
            <Link href="/privacy" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              Privacy
            </Link>
            <Link href="/terms" className="link-rule" style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}>
              Terms
            </Link>
            <a
              href="mailto:hello@eevolvv.com"
              className="link-rule"
              style={{ display: "block", fontSize: 14, marginBottom: 10, color: "var(--ink)", textDecoration: "none" }}
            >
              Contact
            </a>
          </div>
        </div>

        <div
          className="mono flex items-center justify-between"
          style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--rule)", fontSize: 10, letterSpacing: "0.22em", opacity: 0.5 }}
        >
          <span>© 2026 EEVOLVV / TALENT · DAY ZERO</span>
          <span>EEVOLVVING FORWARD, TOGETHER</span>
        </div>
      </div>
    </footer>
  );
}

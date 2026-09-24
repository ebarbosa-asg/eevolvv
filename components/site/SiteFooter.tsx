import Link from "next/link";
import { LogoMark } from "@/components/site/art";
import { contactEmail } from "@/lib/seo";
import { formatUsd, packages } from "@/lib/packages";

export function SiteFooter() {
  const email = contactEmail();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="logo" href="/">
            <LogoMark />
            eevolvv
          </Link>
          <p className="muted" style={{ marginTop: 16, maxWidth: "34rem" }}>
            Your content is the place to stand. Our automation is the lever. Done-for-you clipping and posting for creators who record plenty but never post enough.
          </p>
        </div>
        <div>
          <strong>Services</strong>
          <ul className="footer-links">
            <li>
              <Link href="/packages/clip-and-ship">
                Clip & Ship — {formatUsd(packages.ship.price)}/mo
              </Link>
            </li>
            <li>
              <Link href="/packages/clip-and-dominate">
                Clip & Dominate — {formatUsd(packages.dominate.price)}/mo
              </Link>
            </li>
            <li>
              <Link href="/#packages">Compare packages</Link>
            </li>
            <li>
              <Link href="/sample">Free sample cut</Link>
            </li>
          </ul>
        </div>
        <div>
          <strong>Niches</strong>
          <ul className="footer-links">
            <li>
              <Link href="/niches/podcasts">Business & money podcasts</Link>
            </li>
            <li>
              <Link href="/niches/saas">SaaS & AI founders</Link>
            </li>
            <li>
              <Link href="/niches/coaches">Coaches & course sellers</Link>
            </li>
            <li>
              <Link href="/case-studies">Case studies</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} eevolvv, Inc.</span>
        <span>
          <a href={`mailto:${email}`}>{email}</a>
          {" · "}
          <Link href="/legal/privacy">Privacy</Link>
          {" · "}
          <Link href="/legal/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import { contactEmail } from "@/lib/seo";

export function SiteFooter() {
  const email = contactEmail();
  return (
    <footer className="site-footer">
      <div className="wrap footer-brand">
        <Link className="logo" href="/" aria-label="eevolvv home">
          <Wordmark />
        </Link>
        <span className="footer-domain">eevolvv.com</span>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} eevolvv, Inc.</span>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/packages/clip-and-ship">Clip & Ship</Link>
          <Link href="/packages/clip-and-dominate">Clip & Dominate</Link>
          <Link href="/niches/podcasts">Podcasts</Link>
          <Link href="/niches/saas">SaaS</Link>
          <Link href="/niches/coaches">Coaches</Link>
          <Link href="/case-studies">Case studies</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/sample">Sample</Link>
          <Link href="/proof">Proof</Link>
          <a href={`mailto:${email}`}>{email}</a>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

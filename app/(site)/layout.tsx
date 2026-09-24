import type { Metadata } from "next";
import Script from "next/script";
import { SiteHeader, StickyBook } from "@/components/site/chrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { mono, sans } from "@/components/site/fonts";
import { jsonLdScript, organizationGraph, plausibleDomain, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../site.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: `${SITE_NAME} — your show is the place to stand`,
  },
  description:
    "Daily Shorts, TikToks, Reels, and LinkedIn clips cut from the episodes you already record. Posted on your accounts, after you approve. Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo.",
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "eevolvv — your content is the place to stand" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`eevolvv-site ${sans.variable} ${mono.variable}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="bg-matrix" aria-hidden="true" />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <StickyBook />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationGraph()) }} />
      {plausibleDomain() ? (
        <Script
          defer
          data-domain={plausibleDomain()}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </div>
  );
}

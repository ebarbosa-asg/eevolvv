import type { Metadata } from "next";
import Script from "next/script";
import { Martian_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader, StickyBook } from "@/components/site/chrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { jsonLdScript, organizationGraph, plausibleDomain, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../site.css";

const display = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-display",
});

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
  },
  robots: { index: true, follow: true },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`eevolvv-site ${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}>
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

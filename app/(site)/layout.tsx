import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteHeader, StickyBook } from "@/components/site/chrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { jsonLdScript, organizationGraph, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../site.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: `${SITE_NAME} — clipping for creators who record but never post enough`,
  },
  description:
    "Done-for-you Shorts, TikToks, and Reels. Your content is the place to stand; our automation is the lever. Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo.",
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
    <div className={`eevolvv-site ${sans.variable} ${mono.variable}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="bg-matrix" aria-hidden="true" />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <StickyBook />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationGraph()) }} />
      {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import { SiteHeader, StickyBook } from "@/components/site/chrome";
import { SiteFooter } from "@/components/site/SiteFooter";
import { mono, sans } from "@/components/site/fonts";
import { NotFoundView } from "@/components/site/NotFoundView";
import "./site.css";

export const metadata: Metadata = {
  title: { absolute: "Page not found · eevolvv" },
  description: "That page is not on eevolvv. The clipping packages are still here.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={`eevolvv-site ${sans.variable} ${mono.variable}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="bg-matrix" aria-hidden="true" />
      <SiteHeader />
      <main id="main">
        <NotFoundView />
      </main>
      <SiteFooter />
      <StickyBook />
    </div>
  );
}

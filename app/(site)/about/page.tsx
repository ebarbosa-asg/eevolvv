import type { Metadata } from "next";
import { LeverArt } from "@/components/site/art";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: "eevolvv, Inc. is a short-form clipping and distribution practice. Your content is the place to stand. Automation is the lever.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap split">
          <div>
            <p className="eyebrow">eevolvv, Inc.</p>
            <h1>The lever, not a login</h1>
            <p className="lead">
              eevolvv, Inc. is a Delaware corporation. The public offer is done-for-you clipping and posting for people who already record and do not post enough.
            </p>
            <p className="lead">
              Give me a lever and a place to stand, and I’ll move the world. Here, the place to stand is the long-form you already made. The lever is the system that captions it, titles it, and puts it on your accounts.
            </p>
          </div>
          <div className="hero-art" style={{ minHeight: 380 }}>
            <LeverArt />
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap triad">
          <article className="card">
            <h2>What we sell</h2>
            <p>Two retainers. Clip & Ship and Clip & Dominate. Published prices. No virality promise.</p>
          </article>
          <article className="card">
            <h2>What we don’t invent</h2>
            <p>No client logos, testimonials, or view counts until a real engagement produces them and you approve the story.</p>
          </article>
          <article className="card">
            <h2>Who it’s for</h2>
            <p>Business podcasts, SaaS and AI founders, and coaches who already have a library of long-form.</p>
          </article>
        </div>
      </section>
    </>
  );
}

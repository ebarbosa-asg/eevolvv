import type { Metadata } from "next";
import { LeverArt } from "@/components/site/art";
import { legalEntity, legalParty, legalState, pageMeta } from "@/lib/seo";

const entity = legalEntity();
const state = legalState();

export const metadata: Metadata = pageMeta({
  title: "About",
  description: entity
    ? `${entity} operates eevolvv, a short-form clipping and distribution service.${state ? ` Organized in ${state}.` : ""}`
    : "eevolvv is a short-form clipping and distribution service. Your content is the place to stand. Automation is the lever.",
  path: "/about",
});

function sentence(party: string) {
  return party.charAt(0).toUpperCase() + party.slice(1);
}

export default function AboutPage() {
  const party = legalParty();
  const organized = legalState();
  return (
    <>
      <section className="page-hero">
        <div className="wrap split">
          <div>
            <p className="eyebrow">eevolvv</p>
            <h1>The lever, not a login</h1>
            <p className="lead">
              eevolvv is a done-for-you clipping and posting service for people who already record and do not post enough. The offer is made by {party}.
              {organized ? ` ${sentence(party)} is organized in ${organized}.` : null}
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

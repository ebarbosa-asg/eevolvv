import Link from "next/link";
import { FlowDiagram, NicheArt } from "@/components/site/art";
import { FaqList } from "@/components/site/FaqList";
import { formatUsd, packages } from "@/lib/packages";
import { faqGraph, jsonLdScript } from "@/lib/seo";
import type { Niche } from "@/lib/niches";

export function NicheView({ niche }: { niche: Niche }) {
  const pack = packages[niche.packageId];
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Niches</span>
            <span aria-hidden="true">/</span>
            <span>{niche.nav}</span>
          </nav>
          <p className="eyebrow">{niche.eyebrow}</p>
          <h1>{niche.h1}</h1>
          <p className="lead">{niche.lead}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href="/#book">
              Book a call
            </a>
            <Link className="btn btn-secondary" href={`/packages/${pack.slug}`}>
              Start with {pack.name}
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <NicheArt slug={niche.slug} />
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The cut</p>
            <h2>{niche.diagramTitle}</h2>
          </div>
          <FlowDiagram steps={niche.steps} />
          <ul className="feature-list" style={{ marginTop: 22, maxWidth: 640 }}>
            {niche.points.map((point) => (
              <li key={point}>
                <span aria-hidden="true">→</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <article className={niche.packageId === "dominate" ? "package-card featured" : "package-card"}>
            <p className="eyebrow">Recommended</p>
            <h2 style={{ margin: 0 }}>{pack.name}</h2>
            <p className="price">
              {formatUsd(pack.price)} <small>/mo</small>
            </p>
            <p className="muted">{niche.packageNote}</p>
            <Link className="btn btn-primary" href={`/packages/${pack.slug}`}>
              View {pack.name}
            </Link>
          </article>
          <div>
            <p className="eyebrow">FAQ</p>
            <FaqList items={niche.faqs} />
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqGraph(niche.faqs)) }} />
    </>
  );
}

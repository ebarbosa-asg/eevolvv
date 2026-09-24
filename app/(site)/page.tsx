import Link from "next/link";
import { FunnelGraphic, LeverArt, LeverTriad, PhoneWall, TerminalStrip } from "@/components/site/art";
import { LeverUpgrade } from "@/components/site/LeverUpgrade";
import { BookPanel } from "@/components/site/BookPanel";
import { FaqList } from "@/components/site/FaqList";
import { MatrixCanvas } from "@/components/site/MatrixCanvas";
import { PackageCards, PillChooser } from "@/components/site/PackageCards";
import { PipelineDiagram } from "@/components/site/PipelineDiagram";
import { homeFaqs } from "@/lib/packages";
import { faqGraph, jsonLdScript } from "@/lib/seo";
import { niches } from "@/lib/niches";

export default function HomePage() {
  return (
    <>
      <section className="wrap hero">
        <div>
          <p className="eyebrow">eevolvv 2.0</p>
          <h1>The clipping team for creators who record plenty but never post enough</h1>
          <blockquote className="quote">
            “Give me a lever and a place to stand, and I’ll move the world.”
            <p>Your content is the place to stand. Our automation is the lever.</p>
          </blockquote>
          <div className="btn-row">
            <a className="btn btn-primary" href="#book">
              Book a call
            </a>
            <a className="btn btn-secondary" href="#packages">
              See packages
            </a>
          </div>
        </div>
        <div className="hero-art">
          <MatrixCanvas />
          <LeverArt />
          <LeverUpgrade />
          <TerminalStrip />
        </div>
      </section>

      <section className="section" id="lever">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The lever</p>
            <h2>A small force, applied well, moves more than raw effort</h2>
          </div>
          <LeverTriad />
        </div>
      </section>

      <section className="section" id="pipeline" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The pipeline</p>
            <h2>Five steps. One finished result.</h2>
          </div>
          <PipelineDiagram />
        </div>
      </section>

      <section className="section" id="packages" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Two packages · published prices</p>
            <h2>Pick a finished offer. Not a quote call.</h2>
          </div>
          <PackageCards />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Choose</p>
            <h2>Pick your lever length</h2>
          </div>
          <PillChooser />
        </div>
      </section>

      <section className="section" id="capture" style={{ paddingTop: 0 }}>
        <div className="wrap funnel-wrap">
          <FunnelGraphic />
          <div>
            <p className="eyebrow">Audience capture</p>
            <h2>Clicks alone won’t make anyone viral.</h2>
            <p className="lead">Volume and consistency get you seen. The system turns viewers into followers, subscribers, and customers.</p>
          </div>
        </div>
      </section>

      <section className="section" id="niches" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Built for</p>
            <h2>Three niches we start with</h2>
          </div>
          <div className="niche-grid">
            {niches.map((niche) => (
              <Link className="card" key={niche.slug} href={`/niches/${niche.slug}`}>
                <p className="eyebrow">{niche.nav}</p>
                <h3>{niche.cardTitle}</h3>
                <p>{niche.lead}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="samples" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Sample output</p>
            <h2>Clips ship here. Real samples are still coming.</h2>
            <p className="lead">No borrowed logos and no invented view counts. These frames stay illustrated until real vertical clips exist.</p>
          </div>
          <PhoneWall />
          <div className="btn-row">
            <Link className="btn btn-secondary" href="/sample">
              Send an episode
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2>Straight answers</h2>
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <BookPanel />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqGraph(homeFaqs)) }} />
    </>
  );
}

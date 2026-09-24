import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { CaptureMark, PhoneWall } from "@/components/site/art";
import { BookPanel } from "@/components/site/BookPanel";
import { FaqList } from "@/components/site/FaqList";
import { FigureFrame } from "@/components/site/FigureFrame";
import { HackSection } from "@/components/site/HackSection";
import { HeroStage } from "@/components/site/HeroStage";
import { PillChooser } from "@/components/site/PillChooser";
import { PipelineDiagram } from "@/components/site/PipelineDiagram";
import { homeFaqs } from "@/lib/packages";
import { faqGraph, jsonLdScript } from "@/lib/seo";
import { niches } from "@/lib/niches";

const transcript = fs.readFileSync(path.join(process.cwd(), "content/rain/episode-01.txt"), "utf8");

const captureTools = ["Hooks", "Series", "CTAs", "Pinned comments", "Link-in-bio", "Retarget winners"];

export default function HomePage() {
  return (
    <>
      <HeroStage transcript={transcript} />
      <HackSection />

      <section className="section" id="packages">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">Packages</p>
            <h2>Pick your pill.</h2>
          </div>
          <PillChooser />
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">How it works</p>
            <h2>Long-form in. Feed-ready out.</h2>
          </div>
          <FigureFrame n="02">
            <PipelineDiagram />
          </FigureFrame>
        </div>
      </section>

      <section className="section" id="honest">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">Audience</p>
            <h2>Views are motion. Audience is the move.</h2>
            <p className="lead">
              Volume + consistency gets you seen.
              <br />
              The premium extras are about audience capture.
            </p>
          </div>
          <div className="audience">
            <ol className="audience-bars">
              <li className="viewer">Viewer</li>
              <li className="follower">Follower</li>
              <li className="sub">Sub / email</li>
              <li className="customer">Customer</li>
            </ol>
            <div className="capture-side">
              <CaptureMark />
              <ul className="tool-chips">
                {captureTools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section quiet" id="niches">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Niches</p>
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

      <section className="section quiet" id="samples">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Samples</p>
            <h2>Clips from our own channel.</h2>
            <p className="lead">Client work shows up here only with written permission.</p>
            <p className="proof-empty">Real clips land here soon.</p>
          </div>
          <FigureFrame n="03">
            <PhoneWall />
          </FigureFrame>
          <div className="btn-row">
            <Link className="btn btn-secondary" href="/sample">
              Send an episode
            </Link>
          </div>
        </div>
      </section>

      <section className="section quiet" id="faq">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">FAQ</p>
            <h2>Straight answers</h2>
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <section className="section book-section">
        <div className="wrap">
          <BookPanel />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqGraph(homeFaqs)) }} />
    </>
  );
}

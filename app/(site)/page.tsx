import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { CaptureMark, FunnelGraphic, LeverArt, LeverTriad, PhoneWall, PillDuo } from "@/components/site/art";
import { BookPanel } from "@/components/site/BookPanel";
import { FaqList } from "@/components/site/FaqList";
import { HeroRain } from "@/components/site/HeroRain";
import { PillChooser } from "@/components/site/PillChooser";
import { PipelineDiagram } from "@/components/site/PipelineDiagram";
import { homeFaqs } from "@/lib/packages";
import { faqGraph, jsonLdScript } from "@/lib/seo";
import { niches } from "@/lib/niches";

const transcript = fs.readFileSync(path.join(process.cwd(), "content/rain/episode-01.txt"), "utf8");
const FOOTNOTE =
  "Legally. There's no secret setting. The hack is showing up every day with clips worth watching, then turning viewers into people you can reach again.";

const captureTools = ["Hooks", "Series", "CTAs", "Pinned comments", "Link-in-bio", "Retarget winners"];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="rain" aria-hidden="true">
          <div className="rain-poster">
            {transcript
              .split("\n")
              .slice(0, 9)
              .map((line) => (
                <span key={line}>{line.slice(0, 42)}</span>
              ))}
          </div>
          <HeroRain source={transcript} />
        </div>
        <div className="wrap hero-copy">
          <ul className="hero-chips">
            <li>No bots</li>
            <li>No fake views</li>
          </ul>
          <h1 id="hack-title">
            Hack the algorithm*
            <br />
            Move the world.
          </h1>
          <p className="lead">
            Your long-form is the place to stand.
            <br />
            Our pipeline is the lever.
          </p>
          <p id="hack-note" className="hack-note">
            *{FOOTNOTE}
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary btn-lg" href="/#book">
              Book a call
            </Link>
            <a className="btn btn-secondary btn-lg" href="#packages">
              See packages
            </a>
          </div>
          <p className="hero-domain">eevolvv.com</p>
          {/* TODO: swap LeverArt for a Rive state machine at public/rive/lever.riv (idle, hover lift, click pulse). The SVG is the poster until that file exists. */}
          <div className="hero-art">
            <LeverArt />
          </div>
        </div>
      </section>

      <section className="section" id="stand">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">The lever</p>
            <h2>A small force, applied well.</h2>
            <p className="lead">
              The recording already exists. The lever is the cut, the caption, and the post.
            </p>
          </div>
          <LeverTriad />
        </div>
      </section>

      <section className="section" id="packages">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">Packages</p>
            <h2>Pick your pill.</h2>
            <PillDuo />
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
          <PipelineDiagram />
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
            <FunnelGraphic />
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
          <PhoneWall />
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

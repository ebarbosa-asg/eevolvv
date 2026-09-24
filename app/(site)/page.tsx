import Link from "next/link";
import { CaptureMark, LeverArt, PhoneWall, PillDuo } from "@/components/site/art";
import { LeverUpgrade } from "@/components/site/LeverUpgrade";
import { BookPanel } from "@/components/site/BookPanel";
import { FaqList } from "@/components/site/FaqList";
import { PackageCards } from "@/components/site/PackageCards";
import { PipelineDiagram } from "@/components/site/PipelineDiagram";
import { homeFaqs } from "@/lib/packages";
import { faqGraph, jsonLdScript } from "@/lib/seo";
import { niches } from "@/lib/niches";

const captureTools = ["Hooks", "Series", "CTAs", "Pinned comments", "Link-in-bio", "Retarget winners"];

export default function HomePage() {
  return (
    <>
      <section className="wrap hero">
        <div className="hero-copy">
          <ul className="hero-chips">
            <li>No bots</li>
            <li>No fake views</li>
          </ul>
          <h1>
            Hack the algorithm.
            <br />
            Move the world.
          </h1>
          <div className="hero-art">
            <LeverArt />
            <LeverUpgrade />
            <div className="lever-labels" aria-hidden="true">
              <span className="lbl-content">Content</span>
              <span className="lbl-pipeline">Pipeline</span>
              <span className="lbl-feed">The feed</span>
            </div>
          </div>
          <p className="lead">
            Your long-form is the place to stand.
            <br />
            Our pipeline is the lever.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary btn-lg" href="#book">
              Book a call
            </a>
            <a className="btn btn-secondary btn-lg hero-secondary" href="#packages">
              See packages
            </a>
          </div>
          <p className="hero-domain">eevolvv.com</p>
        </div>
      </section>

      <section className="section" id="packages">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">// Packages</p>
            <h2>Pick your pill.</h2>
            <PillDuo />
          </div>
          <PackageCards />
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">// How it works</p>
            <h2>Long-form in. Feed-ready out.</h2>
          </div>
          <PipelineDiagram />
        </div>
      </section>

      <section className="section" id="honest">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker kicker-red">// No B*llsh*t</p>
            <h2>Clicks alone won’t make anyone viral.</h2>
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
            <p className="kicker">// Niches</p>
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
            <p className="kicker">// Samples</p>
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

      <section className="section quiet" id="faq">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">// FAQ</p>
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

'use client'

import '@/app/homepage-v3.css'
import SiteHeader from '@/components/sections/site-header'
import SiteFooter from '@/components/sections/site-footer'
import { VolvvECard } from '@/components/VolvvE'
import ChatEngine from '@/components/ChatEngine'
import { IndustryPricingTiers } from '@/components/conversion/IndustryPricingTiers'
import { RiskReversal } from '@/components/conversion/RiskReversal'
import { serviceSchema } from '@/lib/schemas'
import type { VerticalConfig } from '@/lib/vertical-data'

export default function VerticalPage({ data }: { data: VerticalConfig }) {
  return (
    <main style={{ background: 'var(--paper)' }}>
      <SiteHeader />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="vert-hero">
        <div className="site-rail mx-auto">
          <div className="vert-section-label">§ 01 · {data.proSection}</div>
          <h1 className="vert-hero-title" dangerouslySetInnerHTML={{ __html: `${data.heroBeforeBr}<br />${data.heroAfterBr}` }} />
          <p className="vert-hero-body">{data.heroBody}</p>
          <div className="vert-hero-actions">
            <a href="#diagnostic" className="mono btn-gradient vert-hero-btn">
              {data.ctaText}
            </a>
            <span className="mono vert-hero-tag">10 minutes · no signup · instant report</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="vert-stats-bar">
        <div className="site-rail mx-auto">
          <div className="vert-stats-grid">
            {data.stats.map((s, i) => (
              <div key={i} className="vert-stat-cell">
                <div className="vert-stat-val">{s.value}</div>
                <div className="mono vert-stat-label">{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ghost Work Grid ───────────────────────────────────────────────────── */}
      <section className="vert-section">
        <div className="site-rail mx-auto">
          <div className="vert-section-head">
            <div>
              <div className="vert-section-label">§ 02 · WHERE THE HOURS GO</div>
              <h2 className="vert-section-title">{data.ghostWorkTitle}</h2>
            </div>
            <div className="vert-section-head-body">
              <p>{data.ghostWorkBody}</p>
            </div>
          </div>

          <div className="vert-ghost-grid">
            {data.ghostWork.map((item, i) => (
              <div key={i} className="vert-ghost-row">
                <div className="mono vert-ghost-code">{item.code}</div>
                <div className="vert-ghost-pain">
                  <div className="vert-ghost-label">{item.label}</div>
                  <div className="vert-ghost-desc">{item.pain}</div>
                </div>
                <div className="vert-ghost-win">
                  <div className="mono vert-ghost-win-label">→ AFTER EEVOLVV</div>
                  <div className="vert-ghost-win-text">{item.win}</div>
                </div>
                <div className="mono vert-ghost-hrs">{item.hrs}</div>
              </div>
            ))}
          </div>

          <div className="mono vert-ghost-total">
            Total: {data.ghostWorkTotal}
          </div>
        </div>
      </section>

      {/* ── Studio Types ────────────────────────────────────────────────────── */}
      <section className="vert-dark-section">
        <div className="site-rail mx-auto">
          <div className="vert-section-label vert-label-light">§ 03 · WHO WE BUILD FOR</div>
          <h2 className="vert-section-title vert-title-light">{data.section3Title}</h2>
          <div className="vert-type-grid">
            {data.studioTypes.map((s, i) => (
              <div key={i} className="vert-type-cell">
                <div className="mono vert-type-id">{s.id}</div>
                <div className="vert-type-name">{s.name}</div>
                <div className="vert-type-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="vert-section">
        <div className="site-rail mx-auto">
          <div className="vert-section-label">§ 04 · THE PROCESS</div>
          <h2 className="vert-section-title vert-title-narrow">{data.section4Title}</h2>
          <div className="vert-process-grid">
            {data.processSteps.map((step, i) => (
              <div key={i} className="vert-process-card">
                <div className="mono vert-process-num">{step.n}</div>
                <div className="vert-process-card-title">{step.title}</div>
                <p className="vert-process-body">{step.body}</p>
                <div className="mono vert-process-note">→ {step.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools we integrate ──────────────────────────────────────────────── */}
      <section className="vert-tools-section">
        <div className="site-rail mx-auto vert-tools-rail">
          <div className="mono vert-tools-label">INTEGRATES WITH</div>
          <div className="vert-tools-list">
            {data.tools.map((tool) => (
              <span key={tool} className="mono vert-tool">{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="vert-section">
        <div className="site-rail mx-auto">
          <div className="vert-section-label">{data.resultSection}</div>
          <div className="vert-testimonial-grid">
            {data.testimonials.map((t, i) => (
              <div key={i} className="vert-testimonial-card">
                <div className="mono vert-testimonial-stat">{t.stat}</div>
                <p className="vert-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="vert-testimonial-author">
                  <div className="vert-testimonial-name">{t.name}</div>
                  <div className="mono vert-testimonial-biz">{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing tiers (direct buy) ───────────────────────────────────────── */}
      <IndustryPricingTiers />

      {/* ── Risk reversal block ──────────────────────────────────────────────── */}
      <section className="vert-risk-section">
        <div className="site-rail mx-auto">
          <RiskReversal />
        </div>
      </section>

      {/* ── Diagnostic CTA ────────────────────────────────────────────────────── */}
      <section id="diagnostic" className="vert-diagnostic-section">
        <div className="site-rail mx-auto">
          <div className="vert-diagnostic-copy">
            <div className="mono vert-section-label vert-label-accent">§ 06 · FREE AUDIT</div>
            <h2 className="vert-diagnostic-title">Find your ghost work. Free, in 10 minutes.</h2>
            <p className="vert-diagnostic-body">
              Our AI maps your practice&apos;s operation, identifies every automation opportunity, and
              delivers a custom Evolution Report with a 90-day build roadmap — specific to your
              business type, tools, and revenue range.
            </p>
          </div>

          <div className="vert-diagnostic-chat">
            <ChatEngine defaultTier="core" defaultIndustry={data.defaultIndustry} />
          </div>

          <div className="mono vert-diagnostic-footer">
            FREE AUDIT · NO CREDIT CARD · REPORT DELIVERED INSTANTLY
          </div>
        </div>
      </section>

      {/* ── Bottom trust bar ──────────────────────────────────────────────────── */}
      <section className="vert-bottom-bar">
        <div className="site-rail mx-auto vert-bottom-rail">
          <div>
            <div className="vert-bottom-headline">Not ready to start yet?</div>
            <p className="vert-bottom-sub">See full pricing and what&apos;s included in each tier.</p>
          </div>
          <div className="vert-bottom-actions">
            <a href="/pricing" className="mono vert-bottom-btn-outline">
              VIEW PRICING →
            </a>
            <a href="https://calendly.com/hello-eevolvv" target="_blank" rel="noopener noreferrer" className="mono vert-bottom-btn-solid">
              BOOK A CALL →
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: data.serviceSchemaName,
              description: data.serviceSchemaDesc,
              providerName: 'eevolvv, Inc.',
              areaServed: 'Dallas',
            })
          ),
        }}
      />

      <SiteFooter />
    </main>
  )
}
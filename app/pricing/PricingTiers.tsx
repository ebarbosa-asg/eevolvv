'use client'

import { useState } from 'react'
import { TIER_CONFIGS, type Tier } from '@/lib/stripe-prices'
import { ADD_ONS, WEBSITE_ADD_ON } from '@/lib/agent-products'
import { FIRST_FIX_PRODUCT } from '@/lib/cash-products'
import { ReportRoadmapOffer } from '@/components/ReportRoadmapOffer'
import { RiskReversal } from '@/components/conversion/RiskReversal'
import { TrustMarks } from '@/components/conversion/TrustMarks'

const DISPLAY_FEATURES: Record<Tier, string[]> = {
  seed: [
    'Client Dashboard (private URL)',
    'Weekly performance report (what ran, what moved, one next step)',
    '1 active automation (built and documented)',
    'Search + ChatGPT optimization available as add-on',
  ],
  core: [
    'Client Dashboard (private URL)',
    'Weekly performance report (what ran, what moved, one next step)',
    '3 active automations (built and documented)',
    'Search + ChatGPT optimization available as add-on',
  ],
  evolve: [
    'Client Dashboard (private URL)',
    'Weekly performance report (what ran, what moved, one next step)',
    'Up to 5 automations (built and documented)',
    'Ads, SEO, and Search + ChatGPT optimization included',
  ],
}

export function PricingTiers() {
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [firstFixLoading, setFirstFixLoading] = useState(false)
  const [firstFixError, setFirstFixError] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState('')

  async function handleFirstFix() {
    setFirstFixError('')
    setFirstFixLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'first-fix' }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { setFirstFixError(data.error ?? 'Something went wrong.'); setFirstFixLoading(false) }
    } catch {
      setFirstFixError('Network error. Please try again.')
      setFirstFixLoading(false)
    }
  }

  async function handleReport() {
    setReportError('')
    setReportLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'report-roadmap' }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { setReportError(data.error ?? 'Something went wrong.'); setReportLoading(false) }
    } catch {
      setReportError('Network error. Please try again.')
      setReportLoading(false)
    }
  }

  async function handleStart(tier: Tier) {
    setErrors(e => ({ ...e, [tier]: '' }))
    setLoading(tier)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setErrors(e => ({ ...e, [tier]: data.error ?? 'Something went wrong. Try again.' }))
        setLoading(null)
      }
    } catch {
      setErrors(e => ({ ...e, [tier]: 'Network error. Please try again.' }))
      setLoading(null)
    }
  }

  return (
    <>
      {/* Free-first trust block */}
      <div style={{ marginBottom: 28 }}>
        <RiskReversal />
      </div>

      {/* ─── SECTION A — Vertical Outcome Pilots ─── */}
      <div style={{ marginBottom: 8 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 6, fontWeight: 700 }}>
          § 01 · OUTCOME PRODUCTS
        </div>
        <p style={{ fontSize: 13, opacity: 0.6, margin: '0 0 24px', lineHeight: 1.5 }}>
          Named results for two verticals. Pilot first, monthly after proof.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Card 1 — AI Client Intake */}
          <a
            href="/intake"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div
              style={{
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: 28,
                transition: 'border-color 0.15s',
                cursor: 'pointer',
                height: '100%',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--rule)'
                e.currentTarget.style.borderLeftColor = 'var(--accent)'
              }}
            >
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 12 }}>
                VERTICAL OUTCOME · LAW FIRMS
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                AI Client Intake
              </div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 16 }}>
                $997 pilot → $499/mo
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {[
                  'Web + phone intake answered in <60 seconds',
                  'Qualified leads pushed into your CRM',
                  'Automated follow-up sequence until signed',
                ].map((f, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8, padding: '5px 0', fontSize: 13, lineHeight: 1.45, borderBottom: '1px solid var(--rule)' }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span style={{ opacity: 0.82 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, color: 'var(--accent)' }}>
                SEE HOW IT WORKS →
              </div>
            </div>
          </a>

          {/* Card 2 — Missed-Call Textback */}
          <a
            href="/textback"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <div
              style={{
                border: '1px solid var(--rule)',
                borderLeft: '3px solid var(--accent)',
                padding: 28,
                transition: 'border-color 0.15s',
                cursor: 'pointer',
                height: '100%',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--rule)'
                e.currentTarget.style.borderLeftColor = 'var(--accent)'
              }}
            >
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 12 }}>
                VERTICAL OUTCOME · GYMS &amp; STUDIOS
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                Missed-Call Textback
              </div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 16 }}>
                $497 pilot → $299/mo
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {[
                  'Instant text-back on every missed call',
                  '5-touch follow-up sequence',
                  'Trial booking flow built in',
                ].map((f, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8, padding: '5px 0', fontSize: 13, lineHeight: 1.45, borderBottom: '1px solid var(--rule)' }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span style={{ opacity: 0.82 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, color: 'var(--accent)' }}>
                SEE HOW IT WORKS →
              </div>
            </div>
          </a>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />

      {/* ─── SECTION B — One-Time Products ─── */}
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 6, fontWeight: 700 }}>
          § 02 · START HERE — FREE OR $97
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24 }}>
          {/* Free Diagnostic */}
          <div style={{ border: '1px solid var(--rule)', padding: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Free Diagnostic
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 12 }}>
              $0 — no credit card
            </div>
            <p style={{ fontSize: 13, opacity: 0.65, lineHeight: 1.55, margin: '0 0 24px' }}>
              Ghost work analysis. Instant report. Volvv-E scans your ops for recurring time sinks (e.g. manual follow-up, untracked leads, and repetitive data entry).
            </p>
            <a
              href="/diagnostic"
              className="mono"
              style={{
                display: 'inline-block',
                padding: '13px 22px',
                border: '1px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                textDecoration: 'none',
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 700,
              }}
            >
              START FREE →
            </a>
          </div>

          {/* $97 Report + Roadmap */}
          <div style={{ border: '1px solid var(--ink)', padding: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
              $97 Full Report + Roadmap
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 12 }}>
              $97 — one-time
            </div>
            <p style={{ fontSize: 13, opacity: 0.65, lineHeight: 1.55, margin: '0 0 24px' }}>
              Complete ghost work analysis, prioritized roadmap, and tool-specific next steps. Delivered instantly.
            </p>
            {reportError && (
              <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>{reportError}</div>
            )}
            <button
              onClick={handleReport}
              disabled={reportLoading}
              className="mono"
              style={{
                padding: '13px 22px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                border: 'none',
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 700,
                cursor: reportLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {reportLoading ? 'REDIRECTING...' : 'GET REPORT + ROADMAP → $97'}
            </button>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />

      {/* ─── SECTION C — First Fix ─── */}
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 24, fontWeight: 700 }}>
          § 03 · CUSTOM BUILD — $1,997
        </div>
        <div style={{ border: '2px solid var(--accent)', padding: 32, position: 'relative' }}>
          <div className="mono" style={{ position: 'absolute', top: -11, left: 24, background: 'var(--paper)', padding: '0 10px', fontSize: 9, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700 }}>
            FASTEST PATH TO RESULTS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {FIRST_FIX_PRODUCT.name} — {FIRST_FIX_PRODUCT.price} <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.5 }}>one-time</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.65, marginBottom: 16, lineHeight: 1.5 }}>
                {FIRST_FIX_PRODUCT.tagline} Need something that doesn&apos;t fit a menu item? We scope one automation from your diagnostic, build it, integrate it with your tools, and hand it off documented. 7-day delivery.
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap' as const, gap: '4px 20px' }}>
                {FIRST_FIX_PRODUCT.features.map((f, i) => (
                  <li key={i} className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.06em' }}>→ {f}</li>
                ))}
              </ul>
            </div>
            <div style={{ minWidth: 180, textAlign: 'right' as const }}>
              {firstFixError && <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>{firstFixError}</div>}
              <button
                onClick={handleFirstFix}
                disabled={firstFixLoading}
                className="mono"
                style={{ padding: '14px 24px', background: 'var(--accent)', color: 'var(--paper)', border: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, cursor: firstFixLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' as const }}
              >
                {firstFixLoading ? 'REDIRECTING...' : 'GET FIRST FIX →'}
              </button>
              <div className="mono" style={{ fontSize: 9, opacity: 0.5, marginTop: 8, letterSpacing: '0.1em' }}>NO SUBSCRIPTION</div>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />

      {/* ─── SECTION D — Managed Plans ─── */}
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 6, fontWeight: 700 }}>
          § 04 · MANAGED PLANS — 3+ OUTCOMES MONTHLY
        </div>
        <p style={{ fontSize: 13, opacity: 0.6, margin: '0 0 28px', lineHeight: 1.5, maxWidth: 560 }}>
          For businesses ready for multiple outcomes, managed monthly. Includes client dashboard, weekly reports, and quarterly recalibration.
        </p>

        {/* Compact report offer */}
        <ReportRoadmapOffer compact />

        {/* Billing interval toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          {(['annual', 'monthly'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setInterval(opt)}
              className="mono"
              style={{
                padding: '8px 18px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
                background: interval === opt ? 'var(--ink)' : 'transparent',
                color: interval === opt ? 'var(--paper)' : 'var(--ink)',
                border: '1px solid var(--ink)', cursor: 'pointer',
              }}
            >
              {opt.toUpperCase()}
            </button>
          ))}
          {interval === 'annual' && (
            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
              2 MONTHS FREE
            </span>
          )}
        </div>

        {/* Tier grid */}
        <div className="pricing-tier-grid">
          {TIER_CONFIGS.map((config, i) => {
            const price = config.prices[interval]
            const isCore = config.tier === 'core'
            const isLoading = loading === config.tier
            const features = DISPLAY_FEATURES[config.tier]
            return (
              <div
                key={config.tier}
                style={{
                  padding: 32,
                  borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                  background: isCore ? 'var(--ink)' : 'transparent',
                  color: isCore ? 'var(--paper)' : 'var(--ink)',
                  display: 'flex', flexDirection: 'column', position: 'relative',
                }}
              >
                {isCore && (
                  <div className="mono" style={{
                    position: 'absolute', top: -12, left: 32,
                    background: 'var(--accent)', color: 'var(--paper)',
                    padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 700,
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                  {config.name}
                </div>
                <div style={{ fontSize: 13, opacity: 0.62, marginBottom: 20, lineHeight: 1.45 }}>
                  {config.tagline}
                </div>

                <div style={{
                  borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                  paddingTop: 18, marginBottom: 24,
                }}>
                  <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
                    {price.amountDisplay}
                  </div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, marginTop: 6 }}>
                    {interval === 'annual' ? '/ YEAR · BILLED ONCE' : '/ MONTH · CANCEL ANYTIME'}
                  </div>
                  {price.annualSavingsDisplay && interval === 'annual' && (
                    <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 6, letterSpacing: '0.1em' }}>
                      {price.annualSavingsDisplay.toUpperCase()}
                    </div>
                  )}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', flex: 1 }}>
                  {features.map((f, j) => (
                    <li key={j} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 10, padding: '8px 0', fontSize: 13, lineHeight: 1.5, borderBottom: `1px solid ${isCore ? 'rgba(244,241,234,0.1)' : 'var(--rule)'}` }}>
                      <span style={{ color: 'var(--accent)' }}>→</span>
                      <span style={{ opacity: 0.88 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 28 }}>
                  {errors[config.tier] && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>{errors[config.tier]}</div>
                  )}
                  <button
                    onClick={() => handleStart(config.tier)}
                    disabled={loading !== null}
                    className="mono"
                    style={{
                      width: '100%', padding: '16px 0', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
                      background: isCore ? 'var(--accent)' : 'var(--ink)',
                      color: 'var(--paper)',
                      border: 'none', cursor: loading !== null ? 'not-allowed' : 'pointer',
                      opacity: loading !== null && !isLoading ? 0.5 : 1,
                    }}
                  >
                    {isLoading ? 'REDIRECTING...' : `START ${config.name.toUpperCase()} →`}
                  </button>
                  <TrustMarks inverted={isCore} />
                  {interval === 'annual' && (
                    <div className="mono" style={{ fontSize: 9, marginTop: 8, letterSpacing: '0.08em', opacity: 0.55, textAlign: 'center' as const }}>
                      → 30-DAY MONEY-BACK ON ANNUAL PLANS
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Post-purchase note */}
        <div className="mono" style={{ marginTop: 14, padding: '12px 18px', background: 'rgba(20,20,19,0.04)', borderLeft: '3px solid var(--accent)', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.7 }}>
          → Checkout takes 2 minutes. Your Client Dashboard and first automation queue immediately.
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />

      {/* ─── Add-ons ─── */}
      <div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
          § ADD-ONS · TANGIBLE PRODUCTS
        </div>
        <div className="pricing-addon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', border: '1px solid var(--ink)' }}>
          {[
            {
              name: WEBSITE_ADD_ON.name,
              price: WEBSITE_ADD_ON.price,
              note: 'One flat website build: design, pages/sections, contact CTA, metadata, launch checklist, and a portal file.',
            },
            {
              name: 'Search + ChatGPT Optimization',
              price: ADD_ONS['sco-management'].price,
              note: 'Available on Agent One and Agent Three. Included in Agent Five. We turn your services, proof, FAQs, and content into discoverable assets on Google and AI search.',
            },
            {
              name: ADD_ONS['extra-automation'].name,
              price: ADD_ONS['extra-automation'].price,
              note: 'One extra workflow with one job, one trigger, one destination, one test, and one runbook.',
            },
          ].map((addOn, i) => (
            <div
              key={addOn.name}
              style={{
                padding: 24,
                borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                minHeight: 190,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
                {addOn.name}
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 14 }}>
                {addOn.price}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.68, margin: 0 }}>{addOn.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div style={{ marginTop: 56, display: 'grid', gap: 20 }}>
        {[
          { q: 'Can I try something free first?', a: 'Yes. Start with the free diagnostic — it maps your ghost work, shows the likely recovery, and suggests the first workflows before you choose a paid product.' },
          { q: 'Can I cancel?', a: 'Monthly plans cancel anytime in one click from your billing portal; access continues until the period closes. Annual plans are handled by the service agreement attached to the engagement.' },
          { q: 'What if a product runs late?', a: 'We extend your subscription by the exact delay — no extra charge. 14-day SLA on first agent.' },
          { q: 'What do I get on day one?', a: 'A Client Dashboard (private URL), your first workflow scoped and queued, and a 14-day delivery commitment. No demo call required.' },
          { q: 'What integrations are supported?', a: 'Anything with an API. Common: Google Workspace, HubSpot, Salesforce, Zapier, Make, Twilio, Stripe, Square, Acuity, Calendly, Slack, QuickBooks, Notion, Airtable. Tell us in onboarding.' },
          { q: 'What is the website add-on?', a: 'One flat $2,000 website build. The site becomes a visible product file in your Client Dashboard.' },
          { q: 'What is Search + ChatGPT Optimization?', a: 'Search and ChatGPT Optimization (Search + ChatGPT Optimization) — we turn your services, proof, FAQs, and content into discoverable assets so you show up on Google and in AI-generated answers.' },
          { q: 'Who owns the agents and data?', a: 'You do. If you cancel, your Client Dashboard, workflows, and data export as a portable bundle.' },
        ].map(({ q, a }) => (
          <div key={q} className="pricing-qa-row" style={{ paddingBottom: 20, borderBottom: '1px solid var(--rule)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{q}</div>
            <div style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
      </div>
    </>
  )
}

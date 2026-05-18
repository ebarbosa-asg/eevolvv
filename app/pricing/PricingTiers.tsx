'use client'

import { useState } from 'react'
import { TIER_CONFIGS, type Tier } from '@/lib/stripe-prices'
import { ADD_ONS, WEBSITE_ADD_ON } from '@/lib/agent-products'
import { ReportRoadmapOffer } from '@/components/ReportRoadmapOffer'
import { RiskReversal } from '@/components/conversion/RiskReversal'
import { TrustMarks } from '@/components/conversion/TrustMarks'

const DISPLAY_FEATURES: Record<Tier, string[]> = {
  seed: [
    'Private agent page',
    'Weekly recommendations',
    '1 active integration / automation',
    'SCO management available as add-on',
  ],
  core: [
    'Private agent page',
    'Weekly recommendations',
    '3 active integrations / automations',
    'SCO management available as add-on',
  ],
  evolve: [
    'Private agent page',
    'Weekly recommendations',
    'Up to 5 integrations / automations',
    'Ads, SEO, and SCO management included',
  ],
}

export function PricingTiers() {
  // Default to annual (the 2-months-free framing). Auto-checkout for
  // deep-links is handled separately by <AutoCheckoutHandler /> so this
  // component stays SSR-able.
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      {/* Risk reversal — guarantee + cancel-anytime + delivery SLA */}
      <div style={{ marginBottom: 28 }}>
        <RiskReversal />
      </div>

      {/* Toggle */}
      <ReportRoadmapOffer compact />

      {/* Toggle */}
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Post-purchase note */}
      <div className="mono" style={{ marginTop: 14, padding: '12px 18px', background: 'rgba(20,20,19,0.04)', borderLeft: '3px solid var(--accent)', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.7 }}>
        → Checkout takes 2 minutes. Your agent page, Ghost Locker, and first product file queue immediately.
      </div>

      {/* Tangible add-ons */}
      <div style={{ marginTop: 44 }}>
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
              name: ADD_ONS['sco-management'].name,
              price: ADD_ONS['sco-management'].price,
              note: 'Available on Agent One and Agent Three. Included in Agent Five with ads/SEO management.',
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

      {/* Compact FAQ */}
      <div style={{ marginTop: 56, display: 'grid', gap: 20 }}>
        {[
          { q: 'How does the money-back guarantee work?', a: 'If your first audit doesn\'t identify at least $2,000/month in recoverable ghost work, we refund the first month — no questions asked. Applies to all monthly plans and the first 30 days of annual plans.' },
          { q: 'Can I cancel?', a: 'Monthly: cancel anytime in one click from your billing portal; access continues until the period closes. Annual: full refund within the first 30 days; after that, prorated against work delivered.' },
          { q: 'What if a product runs late?', a: 'We extend your subscription by the exact delay — no extra charge. 14-day SLA on first agent.' },
          { q: 'What do I get on day one?', a: 'A private agent page, your first workflow scoped and queued, and a 14-day delivery commitment. No demo call required.' },
          { q: 'What integrations are supported?', a: 'Anything with an API. Common: Google Workspace, HubSpot, Salesforce, Zapier, Make, Twilio, Stripe, Square, Acuity, Calendly, Slack, QuickBooks, Notion, Airtable. Tell us in onboarding.' },
          { q: 'What is the website add-on?', a: 'One flat $2,000 website build. The site becomes a visible product file in your Ghost Locker.' },
          { q: 'What is SCO management?', a: 'Search and ChatGPT optimization: we turn your services, proof, FAQs, and content into discoverable assets.' },
          { q: 'Who owns the agents and data?', a: 'You do. If you cancel, your agent page, workflows, and data export as a portable bundle.' },
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

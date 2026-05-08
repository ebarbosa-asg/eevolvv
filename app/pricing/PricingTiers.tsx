'use client'

import { useState } from 'react'
import { TIER_CONFIGS, type Tier } from '@/lib/stripe-prices'

const DISPLAY_FEATURES: Record<Tier, string[]> = {
  seed: [
    'Landing page + 1 automation workflow',
    '24-hour build delivery',
    'Hosting, monitoring + 1 update/mo',
  ],
  core: [
    'Web app + 3–5 AI agents built for you',
    '3–5 day build delivery',
    'CRM integrations + monthly report',
  ],
  evolve: [
    'Full-stack build + CRM/ERP integrations',
    '7–10 day build delivery',
    'Full managed service + quarterly sessions',
  ],
}

export function PricingTiers() {
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
              <div style={{ fontSize: 13, opacity: 0.55, marginBottom: 20, lineHeight: 1.4 }}>
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Post-purchase note */}
      <div className="mono" style={{ marginTop: 14, padding: '12px 18px', background: 'rgba(20,20,19,0.04)', borderLeft: '3px solid var(--accent)', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.7 }}>
        → Checkout takes 2 minutes. Build queues immediately. Onboarding doc + client portal link sent to your inbox automatically.
      </div>

      {/* Compact FAQ */}
      <div style={{ marginTop: 56, display: 'grid', gap: 20 }}>
        {[
          { q: 'Can I cancel?', a: 'Monthly: cancel anytime, ends at period close. Annual: non-refundable once build starts.' },
          { q: 'What if the build runs late?', a: 'We extend your subscription by the delay — no charge.' },
          { q: 'Can I upgrade?', a: 'Yes, from your client portal. Stripe prorates automatically.' },
          { q: 'What\'s included in "managed"?', a: 'Hosting, monitoring, updates, and a monthly performance report.' },
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

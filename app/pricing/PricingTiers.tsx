'use client'

import { useState } from 'react'
import { TIER_CONFIGS, getPriceId, type Tier } from '@/lib/stripe-prices'

export function PricingTiers() {
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [emailInputs, setEmailInputs] = useState<Record<Tier, string>>({ seed: '', core: '', evolve: '' })
  const [loading, setLoading] = useState<Tier | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleStart(tier: Tier) {
    const email = emailInputs[tier].trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(e => ({ ...e, [tier]: 'Enter a valid email to continue.' }))
      return
    }
    setErrors(e => ({ ...e, [tier]: '' }))
    setLoading(tier)

    const priceId = getPriceId(tier, interval)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
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
            2 MONTHS FREE ON ANNUAL
          </span>
        )}
      </div>

      {/* Tier grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }}>
        {TIER_CONFIGS.map((config, i) => {
          const price = config.prices[interval]
          const isCore = config.tier === 'core'
          const isLoading = loading === config.tier
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
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.5, marginBottom: 10 }}>
                {config.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {config.name}
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.5 }}>
                {config.tagline}
              </div>

              <div style={{
                borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                paddingTop: 20, marginBottom: 20,
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em' }}>
                  {price.amountDisplay}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, marginTop: 4 }}>
                  {interval === 'annual' ? '/ YEAR · BILLED ONCE' : '/ MONTH · CANCEL ANYTIME'}
                </div>
                {price.annualSavingsDisplay && interval === 'annual' && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 8, letterSpacing: '0.1em' }}>
                    {price.annualSavingsDisplay.toUpperCase()}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {config.features.map((f, j) => (
                  <li key={j} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 10, padding: '7px 0', fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span style={{ opacity: 0.85 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mono" style={{ fontSize: 10, opacity: 0.45, marginBottom: 16, letterSpacing: '0.1em' }}>
                {config.buildSla.toUpperCase()}
              </div>

              {/* Email capture + CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={emailInputs[config.tier]}
                  onChange={e => setEmailInputs(prev => ({ ...prev, [config.tier]: e.target.value }))}
                  style={{
                    padding: '11px 14px',
                    border: `1px solid ${isCore ? 'rgba(244,241,234,0.3)' : 'var(--rule)'}`,
                    background: 'transparent',
                    color: isCore ? 'var(--paper)' : 'var(--ink)',
                    fontSize: 13, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                {errors[config.tier] && (
                  <div style={{ fontSize: 11, color: 'var(--accent)' }}>{errors[config.tier]}</div>
                )}
                <button
                  onClick={() => handleStart(config.tier)}
                  disabled={loading !== null}
                  className="mono"
                  style={{
                    padding: '14px 0', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
                    background: isCore ? 'var(--accent)' : 'var(--ink)',
                    color: 'var(--paper)',
                    border: 'none', cursor: loading !== null ? 'not-allowed' : 'pointer',
                    opacity: loading !== null && !isLoading ? 0.5 : 1,
                  }}
                >
                  {isLoading ? 'LOADING...' : `START ${config.name.toUpperCase()} →`}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 80 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 24, fontWeight: 600 }}>
          § 02 · COMMON QUESTIONS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Monthly plans cancel at end of billing period. Annual plans are non-refundable after the build starts.' },
            { q: 'What if my build takes longer than the SLA?', a: 'We extend your subscription by the delay — free of charge. SLA guarantees apply from when your technician claims your build.' },
            { q: 'Can I upgrade from Seed to Core?', a: 'Yes. Upgrade at any time from your client portal. Stripe prorates the difference automatically.' },
            { q: 'What does "managed service" mean?', a: 'We host, monitor, update, and maintain your build. You get a monthly report and one content/agent update per month included.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>{q}</div>
              <div style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

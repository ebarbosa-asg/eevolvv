'use client'

import { useState } from 'react'
import type { Tier, Interval } from '@/lib/stripe-prices'
import { TIER_CONFIGS } from '@/lib/stripe-prices'
import { RiskReversal } from '@/components/conversion/RiskReversal'
import { TrustMarks } from '@/components/conversion/TrustMarks'

const FEATURES: Record<Tier, string[]> = {
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

export default function BuyPage() {
  const [interval, setInterval] = useState<Interval>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleBuy(tier: Tier) {
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
    <main style={{ padding: '120px 24px 80px' }}>
      <div className="site-rail mx-auto">

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div
            className="mono"
            style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 14, fontWeight: 600 }}
          >
            § CHECKOUT
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
              color: 'var(--ink)',
              lineHeight: 1.1,
            }}
          >
            Choose your plan
          </h1>
          <p style={{ fontSize: 16, opacity: 0.6, maxWidth: 480, margin: '0 auto', lineHeight: 1.55 }}>
            Pick the tier that fits your business. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Trust signals */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
          <RiskReversal />
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          {(['annual', 'monthly'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setInterval(opt)}
              className="mono"
              style={{
                padding: '8px 18px',
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 600,
                background: interval === opt ? 'var(--ink)' : 'transparent',
                color: interval === opt ? 'var(--paper)' : 'var(--ink)',
                border: '1px solid var(--ink)',
                cursor: 'pointer',
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

        {/* Tier cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            border: '1px solid var(--ink)',
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          {TIER_CONFIGS.map((config, i) => {
            const price = config.prices[interval]
            const isCore = config.tier === 'core'
            const isLoading = loading === config.tier
            const features = FEATURES[config.tier]

            return (
              <div
                key={config.tier}
                style={{
                  padding: 36,
                  borderRight: i < 2 ? '1px solid var(--ink)' : 'none',
                  background: isCore ? 'var(--ink)' : 'transparent',
                  color: isCore ? 'var(--paper)' : 'var(--ink)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {isCore && (
                  <div
                    className="mono"
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: 36,
                      background: 'var(--accent)',
                      color: 'var(--paper)',
                      padding: '4px 10px',
                      fontSize: 9,
                      letterSpacing: '0.22em',
                      fontWeight: 700,
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
                  {config.name}
                </div>
                <div style={{ fontSize: 13, opacity: 0.62, marginBottom: 20, lineHeight: 1.45 }}>
                  {config.tagline}
                </div>

                {/* Price */}
                <div
                  style={{
                    borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                    paddingTop: 18,
                    marginBottom: 24,
                  }}
                >
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

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', flex: 1 }}>
                  {features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '14px 1fr',
                        gap: 10,
                        padding: '8px 0',
                        fontSize: 13,
                        lineHeight: 1.5,
                        borderBottom: `1px solid ${isCore ? 'rgba(244,241,234,0.1)' : 'var(--rule)'}`,
                      }}
                    >
                      <span style={{ color: 'var(--accent)' }}>→</span>
                      <span style={{ opacity: 0.88 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div style={{ marginTop: 28 }}>
                  {errors[config.tier] && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>
                      {errors[config.tier]}
                    </div>
                  )}
                  <button
                    onClick={() => handleBuy(config.tier)}
                    disabled={loading !== null}
                    className="mono"
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      fontWeight: 700,
                      background: isCore ? 'var(--accent)' : 'var(--ink)',
                      color: 'var(--paper)',
                      border: 'none',
                      cursor: loading !== null ? 'not-allowed' : 'pointer',
                      opacity: loading !== null && !isLoading ? 0.5 : 1,
                    }}
                  >
                    {isLoading
                      ? 'REDIRECTING...'
                      : `START ${config.name.toUpperCase()} →`}
                  </button>
                  <TrustMarks inverted={isCore} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Post-purchase note */}
        <div
          className="mono"
          style={{
            marginTop: 14,
            padding: '12px 18px',
            background: 'rgba(20,20,19,0.04)',
            borderLeft: '3px solid var(--accent)',
            fontSize: 11,
            letterSpacing: '0.06em',
            lineHeight: 1.7,
            maxWidth: 960,
            margin: '14px auto 0',
          }}
        >
          → Checkout takes 2 minutes. Your agent page, Ghost Locker, and first product file queue immediately.
        </div>

        {/* Bottom CTA for undecided */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            Not sure which tier?
          </div>
          <p style={{ fontSize: 14, opacity: 0.6, margin: '0 0 20px', lineHeight: 1.5 }}>
            Run the free AI diagnostic — it maps your business and tells you exactly where to start.
          </p>
          <a
            href="/diagnostic"
            className="mono"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              textDecoration: 'none',
              fontSize: 11,
              letterSpacing: '0.18em',
              fontWeight: 700,
            }}
          >
            FREE DIAGNOSTIC →
          </a>
        </div>

      </div>
    </main>
  )
}
'use client'

import { useState } from 'react'
import { TIER_CONFIGS, type Tier } from '@/lib/stripe-prices'
import posthog from 'posthog-js'

interface TierCardsProps {
  email?: string
  visible?: boolean
  recommendedTier?: string
}

function normalizeToTier(raw?: string): Tier | null {
  if (!raw) return null
  const map: Record<string, Tier> = { seed: 'seed', core: 'core', grow: 'core', evolve: 'evolve', scale: 'evolve', enterprise: 'evolve', retainer: 'evolve' }
  return map[raw.toLowerCase()] ?? null
}

export function TierCards({ email, visible = true, recommendedTier }: TierCardsProps) {
  const recommended = normalizeToTier(recommendedTier)
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelectTier(tier: Tier) {
    setLoading(tier)
    setError(null)

    const tierConfig = TIER_CONFIGS.find(c => c.tier === tier)
    const priceDisplay = tierConfig?.prices[interval]?.amountDisplay ?? tier
    posthog.capture('tier_selected', { tier, interval, price: priceDisplay })

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval, email }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Checkout failed. Please try again.')
        setLoading(null)
        return
      }

      posthog.capture('checkout_started', { tier, interval })
      window.location.href = data.url
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(null)
    }
  }

  if (!visible) return null

  return (
    <div style={{
      marginTop: 24,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>
          § 04 · START BUILDING
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>
          Your roadmap is ready. Choose your build tier.
        </div>
      </div>

      {/* Annual/Monthly toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setInterval('annual')}
          className="mono"
          style={{
            padding: '6px 14px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
            background: interval === 'annual' ? 'var(--ink)' : 'transparent',
            color: interval === 'annual' ? 'var(--paper)' : 'var(--ink)',
            border: '1px solid var(--ink)', cursor: 'pointer',
          }}
        >
          ANNUAL
        </button>
        <button
          onClick={() => setInterval('monthly')}
          className="mono"
          style={{
            padding: '6px 14px', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600,
            background: interval === 'monthly' ? 'var(--ink)' : 'transparent',
            color: interval === 'monthly' ? 'var(--paper)' : 'var(--ink)',
            border: '1px solid var(--ink)', cursor: 'pointer',
          }}
        >
          MONTHLY
        </button>
        {interval === 'annual' && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
            2 MONTHS FREE
          </span>
        )}
      </div>

      {/* Tier cards */}
      <div className="pricing-tier-grid">
        {TIER_CONFIGS.map((config, i) => {
          const price = config.prices[interval]
          const isRecommended = recommended ? config.tier === recommended : config.tier === 'core'
          const isLoading = loading === config.tier
          return (
            <div
              key={config.tier}
              style={{
                padding: '24px',
                borderRight: i < TIER_CONFIGS.length - 1 ? '1px solid var(--ink)' : 'none',
                background: isRecommended ? 'var(--ink)' : 'transparent',
                color: isRecommended ? 'var(--paper)' : 'var(--ink)',
                display: 'flex', flexDirection: 'column', position: 'relative',
                ...(isRecommended ? {} : { border: `2px solid transparent` }),
              }}
            >
              {isRecommended && (
                <div className="mono" style={{
                  position: 'absolute', top: -12, left: 24,
                  background: 'var(--accent)', color: 'var(--paper)',
                  padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600,
                }}>
                  {recommended ? 'RECOMMENDED FOR YOU' : 'MOST POPULAR'}
                </div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 8 }}>
                {config.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>{config.name}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>{config.tagline}</div>

              <div style={{
                borderTop: `1px solid ${isRecommended ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
                paddingTop: 16, marginBottom: 16,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {price.amountDisplay}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.55, marginTop: 4 }}>
                  {interval === 'annual' ? '/ YEAR' : '/ MONTH'}
                </div>
                {price.annualSavingsDisplay && interval === 'annual' && (
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 6, letterSpacing: '0.1em' }}>
                    {price.annualSavingsDisplay.toUpperCase()}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
                {config.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8,
                    padding: '5px 0', fontSize: 12, lineHeight: 1.5, opacity: 0.85,
                  }}>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 12, letterSpacing: '0.1em' }}>
                {config.buildSla.toUpperCase()}
              </div>

              <button
                onClick={() => handleSelectTier(config.tier)}
                disabled={loading !== null}
                className="mono"
                style={{
                  width: '100%', padding: '14px 0',
                  background: isRecommended ? 'var(--accent)' : 'transparent',
                  color: isRecommended ? 'var(--paper)' : 'var(--ink)',
                  border: isRecommended ? 'none' : '1px solid var(--ink)',
                  fontSize: 11, letterSpacing: '0.18em', fontWeight: 600,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading !== null && !isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? 'LOADING...' : `START ${config.name.toUpperCase()} →`}
              </button>
            </div>
          )
        })}
      </div>

      {/* TODO: replace with real testimonials */}
      <div style={{ marginTop: 24, display: 'grid', gap: 0, border: '1px solid var(--rule)', borderBottom: 'none' }}>
        {[
          { name: 'Marcus T.', biz: 'Home Services', quote: 'Recovered 18 hours a week in the first month. The report was eerily accurate.' },
          { name: 'Priya S.', biz: 'E-commerce Brand', quote: "We didn't realize how much the follow-up gap was costing us. Fixed in two weeks." },
          { name: 'Jordan R.', biz: 'Marketing Agency', quote: 'The roadmap they gave us was better than the consultant we paid $8K for.' },
        ].map(({ name: n, biz, quote }) => (
          <div key={n} style={{ padding: '16px 20px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
            <div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 4 }}>{biz}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.78 }}>&ldquo;{quote}&rdquo;</div>
            </div>
            <div className="mono" style={{ fontSize: 10, opacity: 0.45, whiteSpace: 'nowrap', paddingTop: 2 }}>— {n}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: 12, padding: '12px 16px',
          background: 'rgba(140,43,26,0.08)', border: '1px solid var(--accent)',
          fontSize: 13, color: 'var(--accent)',
        }}>
          {error}
        </div>
      )}

      <div className="mono" style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(20,20,19,0.04)', borderLeft: '3px solid var(--accent)', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.7 }}>
        → Build starts the moment checkout completes. Onboarding doc + client portal access sent to your inbox automatically.
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.5 }}>
        All plans include a build delivery guarantee. Cancel anytime after month 3.
      </div>
    </div>
  )
}

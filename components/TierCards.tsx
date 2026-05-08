'use client'

import { useState } from 'react'
import { TIER_CONFIGS, getPriceId, type Tier } from '@/lib/stripe-prices'
import posthog from 'posthog-js'

interface TierCardsProps {
  email?: string
  visible?: boolean
}

export function TierCards({ email, visible = true }: TierCardsProps) {
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState<Tier | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelectTier(tier: Tier) {
    const priceId = getPriceId(tier, interval)
    if (!priceId) {
      setError('Price configuration error. Please contact hello@eevolvv.com.')
      return
    }

    setLoading(tier)
    setError(null)

    // PostHog event — T24 will add more properties
    posthog.capture('tier_selected', { tier, interval, price: priceId })

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--ink)' }}>
        {TIER_CONFIGS.map((config, i) => {
          const price = config.prices[interval]
          const isCore = config.tier === 'core'
          const isLoading = loading === config.tier
          return (
            <div
              key={config.tier}
              style={{
                padding: '24px',
                borderRight: i < TIER_CONFIGS.length - 1 ? '1px solid var(--ink)' : 'none',
                background: isCore ? 'var(--ink)' : 'transparent',
                color: isCore ? 'var(--paper)' : 'var(--ink)',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}
            >
              {isCore && (
                <div className="mono" style={{
                  position: 'absolute', top: -12, left: 24,
                  background: 'var(--accent)', color: 'var(--paper)',
                  padding: '4px 10px', fontSize: 9, letterSpacing: '0.22em', fontWeight: 600,
                }}>
                  MOST POPULAR
                </div>
              )}
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.55, marginBottom: 8 }}>
                {config.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>{config.name}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>{config.tagline}</div>

              <div style={{
                borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`,
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
                  background: isCore ? 'var(--accent)' : 'transparent',
                  color: isCore ? 'var(--paper)' : 'var(--ink)',
                  border: isCore ? 'none' : '1px solid var(--ink)',
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

      {error && (
        <div style={{
          marginTop: 12, padding: '12px 16px',
          background: 'rgba(140,43,26,0.08)', border: '1px solid var(--accent)',
          fontSize: 13, color: 'var(--accent)',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.5 }}>
        All plans include a 30-day build delivery guarantee. Cancel anytime after month 3.
      </div>
    </div>
  )
}

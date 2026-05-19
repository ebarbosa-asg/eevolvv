'use client'

import Link from 'next/link'

/**
 * Inline 3-tier pricing block for industry / SEO landing pages.
 *
 * Mirrors the canonical /pricing tier cards but is a non-interactive teaser:
 * clicking any tier deep-links to /pricing with the tier pre-selected and
 * auto-redirects to Stripe checkout.
 *
 * Goal: a buyer never has to ask "what does it cost?" — three tiers, three
 * prices, three buy buttons, every industry page.
 */

const TIERS = [
  {
    tier: 'seed' as const,
    name: 'Agent One',
    price: '$499',
    cadence: '/ MONTH',
    annualNote: '$4,990/yr · 2 months free',
    tagline: 'One agent page. One workflow. Weekly direction.',
    features: ['Private agent page', 'Weekly recommendations', '1 active automation'],
    cta: 'START AGENT ONE',
  },
  {
    tier: 'core' as const,
    name: 'Agent Three',
    price: '$999',
    cadence: '/ MONTH',
    annualNote: '$9,990/yr · 2 months free',
    tagline: 'Three connected workflows + stronger operating layer.',
    features: ['Private agent page', 'Weekly recommendations', '3 active automations'],
    cta: 'START AGENT THREE',
    highlight: true,
  },
  {
    tier: 'evolve' as const,
    name: 'Agent Five',
    price: '$1,999',
    cadence: '/ MONTH',
    annualNote: '$19,990/yr · 2 months free',
    tagline: 'Five workflows plus growth management.',
    features: ['Up to 5 integrations', 'Ads, SEO, SCO managed', 'Weekly + monthly reports'],
    cta: 'START AGENT FIVE',
  },
]

export function IndustryPricingTiers({ industryName }: { industryName?: string }) {
  return (
    <section style={{ padding: '72px 32px', borderBottom: '1px solid var(--ink)', background: 'var(--paper)' }}>
      <div className="site-rail mx-auto">
        <div style={{ marginBottom: 32 }}>
          <div
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)', fontWeight: 700, marginBottom: 14 }}
          >
            § PRICING · NO CALL REQUIRED
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
            Three tiers. Pick one. {industryName ? `Live in your ${industryName.toLowerCase()} ` : 'Live in '}14 days.
          </h2>
          <p style={{ fontSize: 15, opacity: 0.62, marginTop: 12, maxWidth: 620, lineHeight: 1.55 }}>
            Direct checkout — no sales call, no deck, no demo. Run the free report first, then pick the build tier when the next move is obvious.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            border: '1px solid var(--ink)',
          }}
        >
          {TIERS.map((t, i) => {
            const isCore = !!t.highlight
            return (
              <div
                key={t.tier}
                style={{
                  padding: 28,
                  borderRight: i < TIERS.length - 1 ? '1px solid var(--ink)' : 'none',
                  background: isCore ? 'var(--ink)' : 'transparent',
                  color: isCore ? 'var(--paper)' : 'var(--ink)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {isCore && (
                  <div
                    className="mono"
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: 28,
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
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 13, opacity: 0.62, marginBottom: 18, lineHeight: 1.45, minHeight: 38 }}>{t.tagline}</div>
                <div style={{ borderTop: `1px solid ${isCore ? 'rgba(244,241,234,0.18)' : 'var(--rule)'}`, paddingTop: 14, marginBottom: 18 }}>
                  <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>{t.price}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, marginTop: 6 }}>
                    {t.cadence}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 4, letterSpacing: '0.1em' }}>
                    {t.annualNote.toUpperCase()}
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', flex: 1 }}>
                  {t.features.map(f => (
                    <li
                      key={f}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '14px 1fr',
                        gap: 10,
                        padding: '6px 0',
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: 'var(--accent)' }}>→</span>
                      <span style={{ opacity: 0.85 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/pricing?tier=${t.tier}&checkout=1`}
                  className="mono"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 0',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: isCore ? 'var(--accent)' : 'var(--ink)',
                    color: 'var(--paper)',
                  }}
                >
                  {t.cta} →
                </Link>
              </div>
            )
          })}
        </div>

        <p
          className="mono"
          style={{
            marginTop: 20,
            fontSize: 11,
            letterSpacing: '0.1em',
            opacity: 0.55,
            textAlign: 'center',
          }}
        >
          → CHECKOUT TAKES 2 MINUTES · CANCEL MONTHLY ANYTIME · $97 FAST PATH AVAILABLE AT CHECKOUT
        </p>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'

/**
 * Sticky top price strip. Shows the three tiers + Fast Path + a direct buy
 * link, so any visitor on any page sees price + a buy button within 3 seconds.
 *
 * Used on industry pages, SEO pages, and any high-intent surface.
 */
export function PriceStrip({ recommendedTier = 'core' }: { recommendedTier?: 'seed' | 'core' | 'evolve' }) {
  return (
    <div
      className="mono"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--ink)',
        color: 'var(--paper)',
        borderBottom: '1px solid var(--accent)',
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        fontSize: 11,
        letterSpacing: '0.14em',
      }}
    >
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ opacity: 0.55 }}>AGENT ONE</span>
        <span style={{ fontWeight: 700 }}>$499/MO</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span style={{ opacity: 0.55 }}>AGENT THREE</span>
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>$999/MO</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span style={{ opacity: 0.55 }}>FAST PATH REPORT</span>
        <span style={{ fontWeight: 700 }}>$97</span>
      </div>
      <Link
        href={`/pricing?tier=${recommendedTier}&checkout=1`}
        style={{
          background: 'var(--accent)',
          color: 'var(--paper)',
          padding: '8px 18px',
          textDecoration: 'none',
          fontWeight: 700,
          letterSpacing: '0.18em',
          whiteSpace: 'nowrap',
        }}
      >
        BUY NOW →
      </Link>
    </div>
  )
}

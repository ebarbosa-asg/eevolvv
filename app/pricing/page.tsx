import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PricingTiers } from './PricingTiers'
import { AutoCheckoutHandler } from './AutoCheckoutHandler'

export const metadata: Metadata = {
  title: 'What to get first — eevolvv',
  description: 'Named vertical outcomes, a $97 diagnostic report, First Fix builds, and managed agent plans. Start free or pick a scoped pilot — every product is built and handed off in 30 days or less.',
  openGraph: {
    title: 'What to get first — eevolvv',
    description: 'Named vertical outcomes, a $97 diagnostic report, First Fix builds, and managed agent plans. Start free or pick a scoped pilot.',
    url: 'https://eevolvv.com/pricing',
  },
}

export default function PricingPage() {
  return (
    <main className="pricing-page-main">
      <div className="site-rail mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 14, fontWeight: 600 }}>
            § 00 · MENU
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px', color: 'var(--ink)', lineHeight: 1.1 }}>
            Pick your outcome. Start in 30 days.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.6, maxWidth: 540, margin: 0, lineHeight: 1.55 }}>
            Choose a named, measurable outcome — or start free with the diagnostic. Every product is scoped, built, and handed off with documentation.
          </p>
        </div>

        <Suspense fallback={null}>
          <AutoCheckoutHandler />
        </Suspense>
        <PricingTiers />

        {/* Bottom CTA */}
        <div className="pricing-bottom-cta" style={{ marginTop: 60 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Not sure which tier?</div>
            <p style={{ fontSize: 14, opacity: 0.6, margin: 0, lineHeight: 1.5 }}>Run the free AI diagnostic — it maps your business and tells you exactly where to start.</p>
          </div>
          <a
            href="/diagnostic"
            className="mono"
            style={{ padding: '16px 28px', background: 'var(--ink)', color: 'var(--paper)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            FREE DIAGNOSTIC →
          </a>
        </div>
      </div>
    </main>
  )
}

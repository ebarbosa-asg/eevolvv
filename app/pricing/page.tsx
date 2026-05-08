import type { Metadata } from 'next'
import { PricingTiers } from './PricingTiers'

export const metadata: Metadata = {
  title: 'Pricing — eevolvv | AI-Managed Business Builds',
  description: 'Seed from $99/mo, Core from $499/mo, Evolve from $1,999/mo. Annual pricing saves 2 months. AI-built and managed — landing pages, web apps, and full-stack systems.',
  openGraph: {
    title: 'Pricing — eevolvv',
    description: 'AI-built and managed business systems. Seed, Core, and Evolve tiers.',
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
            § 01 · PRICING
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px', color: 'var(--ink)', lineHeight: 1.1 }}>
            Pick your starting point.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.6, maxWidth: 480, margin: 0, lineHeight: 1.55 }}>
            We build it, host it, and maintain it every month. Not software — a service.
          </p>
        </div>

        <PricingTiers />

        {/* Bottom CTA */}
        <div className="pricing-bottom-cta" style={{ marginTop: 60 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Not sure which tier?</div>
            <p style={{ fontSize: 14, opacity: 0.6, margin: 0, lineHeight: 1.5 }}>Run the free AI diagnostic — it maps your business and tells you exactly where to start.</p>
          </div>
          <a
            href="/#diagnostic"
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

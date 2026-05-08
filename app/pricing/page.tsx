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
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '80px 32px' }}>
      <div className="site-rail mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
            § 01 · PRICING
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', color: 'var(--ink)', lineHeight: 1.1 }}>
            Every business has a<br />starting point.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.65, maxWidth: 540, margin: 0, lineHeight: 1.6 }}>
            A service, not software. We build, host, monitor, and maintain your AI-powered system — so you can focus on your business.
          </p>
        </div>

        <PricingTiers />

        {/* Bottom CTA */}
        <div style={{ marginTop: 80, padding: '40px', border: '1px solid var(--ink)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>NOT SURE WHERE TO START?</div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Get your free AI diagnostic first.</div>
            <p style={{ fontSize: 14, opacity: 0.65, margin: '6px 0 0', lineHeight: 1.5 }}>The diagnostic tells you exactly which tier fits your business and why.</p>
          </div>
          <a
            href="/#diagnostic"
            className="mono"
            style={{ padding: '16px 28px', background: 'var(--ink)', color: 'var(--paper)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            GET FREE REPORT →
          </a>
        </div>
      </div>
    </main>
  )
}

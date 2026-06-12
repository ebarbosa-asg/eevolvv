import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Accounting Firms & CPAs — eevolvv',
  description: 'CPA firms and bookkeeping services recover 15–25 hrs/week by automating document collection, billing, and reconciliation. Free AI audit in 10 minutes.',
  keywords: 'accounting firm automation, CPA firm AI, bookkeeping automation, document collection automation, accounting billing automation, tax firm management software',
  openGraph: {
    title: 'Stop Running Your Accounting Firm on Ghost Work — eevolvv',
    description: 'CPA firms and bookkeeping services recover 15–25 hrs/week by automating document collection, billing, and reconciliation. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/accounting',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/accounting',
  },
}

export default function AccountingPage() {
  return (
    <>
      {/* ── Vertical Outcome CTA ─────────────────────────────────────────── */}
      <section style={{
        background: 'var(--ink)',
        padding: '60px 32px',
        textAlign: 'center' as const,
      }}>
        <div className="site-rail mx-auto" style={{ maxWidth: 720 }}>
          <div className="mono" style={{
            fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)',
            marginBottom: 16, fontWeight: 700,
          }}>
            § BUILT FOR YOUR INDUSTRY
          </div>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: 'var(--paper)',
            letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            AI Client Intake — built specifically for law firms.
          </h2>
          <p style={{
            fontSize: 15, color: 'var(--paper)', opacity: 0.7, marginBottom: 32, lineHeight: 1.6,
          }}>
            Every new inquiry answered in under 60 seconds, qualified, and pushed into Clio or MyCase.
            $997 pilot, live in 14 days, 30-day money-back.
          </p>
          <a
            href="/intake"
            className="mono"
            style={{
              display: 'inline-block', padding: '16px 32px',
              background: 'var(--accent)', color: 'var(--paper)',
              textDecoration: 'none', fontSize: 11,
              letterSpacing: '0.18em', fontWeight: 700,
            }}
          >
            SEE THE INTAKE PILOT →
          </a>
        </div>
      </section>

      <VerticalPage data={{...VERTICALS['accounting']}} />
    </>
  )
}

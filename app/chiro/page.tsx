import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Chiropractic & Physical Therapy Practices — eevolvv',
  description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
  keywords: 'chiropractic automation, chiropractic office software AI, physical therapy automation, chiro practice management, patient recall automation, chiro no-show reduction',
  openGraph: {
    title: 'Stop Running Your Chiropractic Practice on Ghost Work — eevolvv',
    description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/chiro',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/chiro',
  },
}

export default function ChiroPage() {
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
            Missed-Call Textback — built for gyms and studios.
          </h2>
          <p style={{
            fontSize: 15, color: 'var(--paper)', opacity: 0.7, marginBottom: 32, lineHeight: 1.6,
          }}>
            Every missed call answered by text in 30 seconds. 5-touch follow-up sequence.
            $497 pilot, live in 7 days, 30-day money-back.
          </p>
          <a
            href="/textback"
            className="mono"
            style={{
              display: 'inline-block', padding: '16px 32px',
              background: 'var(--accent)', color: 'var(--paper)',
              textDecoration: 'none', fontSize: 11,
              letterSpacing: '0.18em', fontWeight: 700,
            }}
          >
            SEE THE TEXTBACK PILOT →
          </a>
        </div>
      </section>

      <VerticalPage data={{...VERTICALS['chiro']}} />
    </>
  )
}

import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Legal
const legalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a legal practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for legal practices typically starts at $499/month for a single workflow and scales up based on complexity and volume. Many firms see significant ROI within the first quarter."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a law firm?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Initial setup for your first automation can be live within 48-72 hours. A comprehensive diagnostic of your firm's needs is usually completed online in under 30 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "What legal software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv is designed to integrate with popular legal practice management systems such as Clio, MyCase, PracticePanther, Smokeball, and others, as well as common document management tools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI automation for a law firm?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Law firms leveraging AI automation can expect to save 10-15 hours per week per paralegal, reduce operational costs, improve client response times, and decrease errors in documentation and billing."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Law Firms — eevolvv',
  description: 'Law firms recover 15–20 hrs/week of non-billable time by automating intake, billing, and document workflows. Free AI audit in 10 minutes.',
  keywords: 'law firm automation, legal practice management AI, client intake automation, legal billing automation, law firm management software, legal document automation',
  openGraph: {
    title: 'Stop Running Your Law Firm on Ghost Work — eevolvv',
    description: 'Law firms recover 15–20 hrs/week of non-billable time by automating intake, billing, and document workflows. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/law-firms',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/law-firms',
  },
}

export default function LegalPage() {
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

      <VerticalPage data={{...VERTICALS['legal']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalFaqSchema) }}
      />
    </>
  )
}

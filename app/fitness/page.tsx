import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Fitness
const fitnessFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a fitness studio or gym?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for fitness businesses starts around $499/month for essential functions like class scheduling reminders and new member onboarding. Pricing varies with the scope of automation."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a fitness business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your first automated process can typically be live within 48-72 hours. An initial online assessment can identify key areas for automation quickly."
      }
    },
    {
      "@type": "Question",
      "name": "What fitness management software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with popular fitness and gym management software such as Mindbody, Glofox, Zenfit, GymMaster, and other industry-standard platforms."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for fitness businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fitness businesses can expect improved member retention through personalized communication, increased class booking rates, reduced administrative burden on staff, and better lead conversion for new memberships."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Gyms & Fitness Studios — eevolvv',
  description: 'CrossFit boxes, BJJ academies, and fitness studios recover 15–25 hrs/week and cut member churn 25–35% with eevolvv AI automation. Free audit in 10 minutes.',
  keywords: 'gym automation, fitness studio AI, crossfit automation, BJJ gym software, member retention automation, gym management AI, fitness business automation',
  openGraph: {
    title: 'Stop Running Your Gym on Ghost Work — eevolvv',
    description: 'Free AI diagnostic reveals exactly where your fitness studio is losing hours and members. CrossFit, BJJ, MMA, yoga — built for all of them.',
    url: 'https://eevolvv.com/fitness',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/fitness',
  },
}

export default function FitnessPage() {
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

      <VerticalPage data={{...VERTICALS['fitness']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fitnessFaqSchema) }}
      />
    </>
  )
}

import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Salon
const salonFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a salon or spa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for salons and spas generally starts at $499/month for managing bookings, confirmations, and reminders. Pricing adjusts based on the extent of automation required."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a salon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your first automated workflow, such as appointment reminders or rebooking prompts, can be operational within 48-72 hours. An online diagnostic can quickly highlight areas for automation."
      }
    },
    {
      "@type": "Question",
      "name": "What salon management software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with leading salon and spa management systems including Vagaro, Acuity Scheduling, Mindbody, Square Appointments, and other scheduling and CRM platforms."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for salons and spas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Salons and spas can see increased booking rates, reduced no-shows through automated reminders, improved client retention via personalized communication, and a significant reduction in administrative tasks for staff."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Salons & Barbershops — eevolvv',
  description: 'Salons and barbershops recover 10–15 hrs/week by automating no-shows, rebooking, and retail upsell. Free AI audit in 10 minutes. No signup.',
  keywords: 'salon automation, barbershop software, hair salon AI, beauty salon management software, no-show reduction salon, salon booking automation, salon client retention',
  openGraph: {
    title: 'Stop Running Your Salon on Ghost Work — eevolvv',
    description: 'Salons and barbershops recover 10–15 hrs/week by automating no-shows, rebooking, and retail upsell. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/salon',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/salon',
  },
}

export default function SalonPage() {
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

      <VerticalPage data={{...VERTICALS['salon']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(salonFaqSchema) }}
      />
    </>
  )
}

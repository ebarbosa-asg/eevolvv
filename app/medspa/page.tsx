import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Medspa
const medspaFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a medspa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for medspas typically starts at $499/month for tasks like appointment booking, follow-up communication, and client intake form management. Pricing varies with the number and complexity of automations."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a medspa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Initial AI workflows, such as automated appointment reminders or post-treatment follow-ups, can be live within 48-72 hours. A quick online diagnostic can identify key automation opportunities."
      }
    },
    {
      "@type": "Question",
      "name": "What medspa software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with popular medspa and aesthetic clinic management software such as Meevo 2, Jane, Square, and other practice management or CRM systems used in the industry."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for medspas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Medspas can experience higher client retention, reduced no-shows, more efficient patient intake, improved marketing campaign responses, and freed-up staff time for client consultations and services."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Med Spas & Aesthetic Clinics — eevolvv',
  description: 'Med spas and aesthetic clinics recover 15–20 hrs/week by automating bookings, recalls, and membership renewals. Free AI audit in 10 minutes. No signup.',
  keywords: 'med spa automation, aesthetic clinic AI, botox clinic software, med spa management software, medical aesthetics automation, membership automation med spa',
  openGraph: {
    title: 'Stop Running Your Med Spa on Ghost Work — eevolvv',
    description: 'Med spas and aesthetic clinics recover 15–20 hrs/week by automating bookings, recalls, and membership renewals. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/medspa',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/medspa',
  },
}

export default function MedspaPage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['medspa']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medspaFaqSchema) }}
      />
    </>
  )
}

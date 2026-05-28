import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Dental
const dentalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a dental practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for dental practices starts at $499/month for a single workflow and $999/month for three workflows. Most dental offices see ROI in the first month."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI take to set up for a dental office?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The first automation is live within 48 hours. The full diagnostic takes 10 minutes online with no signup required."
      }
    },
    {
      "@type": "Question",
      "name": "What practice management systems does AI integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with Dentrix, Eaglesoft, Open Dental, Carestream, Weave, NexHealth, and other major dental platforms."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for a dental practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most dental practices recover 15-20 hours per week and $2,000-$4,000 per month in lost revenue from no-shows, missed recalls, and manual intake."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Dental Practices — eevolvv',
  description: 'Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup.',
  keywords: 'dental practice automation, dental office AI, patient recall automation, dental no-show reduction, dental management software, dental intake automation',
  openGraph: {
    title: 'Stop Running Your Dental Practice on Ghost Work — eevolvv',
    description: 'Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/dental',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/dental',
  },
}

export default function DentalPage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['dental']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentalFaqSchema) }}
      />
    </>
  )
}

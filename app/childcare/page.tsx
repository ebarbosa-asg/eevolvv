import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Childcare
const childcareFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a childcare center?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for childcare centers typically starts at $499/month for managing inquiries, enrollment processes, and parent communication. Pricing scales with the number and complexity of automations."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a childcare facility?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Initial AI workflows, like automated response to enrollment inquiries or parent updates, can be live within 48-72 hours. A quick online diagnostic can identify key automation opportunities."
      }
    },
    {
      "@type": "Question",
      "name": "What childcare management software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with popular childcare management software such as Procare Solutions, Brightwheel, Kindertales, and other industry-specific platforms for seamless data flow."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for childcare centers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Childcare centers can expect improved enrollment rates, more efficient parent-teacher communication, reduced administrative tasks related to attendance and billing, and enhanced overall operational efficiency."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Childcare Centers & Daycares — eevolvv',
  description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
  keywords: 'childcare automation, daycare management software, childcare center AI, preschool enrollment automation, childcare billing automation, daycare parent communication',
  openGraph: {
    title: 'Stop Running Your Childcare Center on Ghost Work — eevolvv',
    description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/childcare',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/childcare',
  },
}

export default function ChildcarePage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['childcare']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(childcareFaqSchema) }}
      />
    </>
  )
}

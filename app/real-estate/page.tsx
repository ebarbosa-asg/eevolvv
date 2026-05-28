import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Real Estate
const realEstateFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a real estate agency?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for real estate agencies typically starts at $499/month for core workflows like lead qualification and appointment setting. Pricing adjusts based on the number and complexity of automations."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a real estate business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The first automated workflow can typically be deployed within 48-72 hours. An initial assessment of your agency's automation needs can be done online quickly."
      }
    },
    {
      "@type": "Question",
      "name": "What real estate CRM systems does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with leading real estate CRMs like Follow Up Boss, LionDesk, BoomTown, kvCORE, and others, as well as various MLS platforms and marketing tools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI for AI in real estate marketing and operations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Agencies can see increased lead conversion rates, faster response times to inquiries, reduced administrative overhead, and improved client communication, leading to higher sales volumes and agent efficiency."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Real Estate Agents & Brokerages — eevolvv',
  description: 'Real estate agents and brokerages recover 15–25 hrs/week and convert 9x more leads by automating follow-up and transaction coordination. Free AI audit in 10 minutes.',
  keywords: 'real estate automation, real estate AI, agent CRM automation, real estate lead follow-up, transaction coordination automation, brokerage management software',
  openGraph: {
    title: 'Stop Running Your Real Estate Business on Ghost Work — eevolvv',
    description: 'Real estate agents and brokerages recover 15–25 hrs/week and convert 9x more leads by automating follow-up and transaction coordination. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/real-estate',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/real-estate',
  },
}

export default function RealEstatePage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['real-estate']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateFaqSchema) }}
      />
    </>
  )
}

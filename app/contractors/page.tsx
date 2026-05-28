import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Contractors
const contractorsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a contracting business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for contractors typically starts at $499/month for managing lead inquiries and scheduling initial consultations. Costs vary with the number and complexity of automated workflows."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a contractor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The first automated process, like lead qualification or appointment booking, can be live within 48-72 hours. A brief online assessment can identify key automation opportunities."
      }
    },
    {
      "@type": "Question",
      "name": "What CRM or project management tools do contractors use with eevolvv?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with popular contractor CRM and project management software such as ServiceTitan, Jobber, Housecall Pro, Buildertrend, and others, allowing for seamless data flow."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for contractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contractors can experience better lead management, improved scheduling efficiency, reduced administrative time on paperwork, faster client communication, and enhanced project tracking, leading to increased profitability and client satisfaction."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Contractors & Trades — eevolvv',
  description: 'HVAC, plumbing, roofing, and general contractors recover 20–30 hrs/week by automating quoting, dispatch, and invoicing. Free AI audit in 10 minutes.',
  keywords: 'contractor automation, HVAC automation software, plumbing business automation, construction management AI, contractor scheduling software, trade business automation',
  openGraph: {
    title: 'Stop Running Your Contracting Business on Ghost Work — eevolvv',
    description: 'HVAC, plumbing, roofing, and general contractors recover 20–30 hrs/week by automating quoting, dispatch, and invoicing. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/contractors',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/contractors',
  },
}

export default function ContractorsPage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['contractors']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contractorsFaqSchema) }}
      />
    </>
  )
}

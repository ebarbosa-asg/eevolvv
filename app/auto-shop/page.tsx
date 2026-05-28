import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Auto Shop
const autoShopFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for an auto repair shop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for auto shops typically starts at $499/month for functionalities like appointment scheduling, service reminders, and customer follow-ups. Costs vary based on the number of automations."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for an auto shop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The first automated workflow, such as appointment booking confirmation or service reminders, can be live within 48-72 hours. An online diagnostic can quickly identify areas for automation."
      }
    },
    {
      "@type": "Question",
      "name": "What auto shop management software does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv integrates with common auto shop management systems like Mitchell 1, Shopkey, Snap-DDE, and other industry-specific software, as well as general CRM and scheduling tools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for auto shops?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Auto shops can achieve higher booking rates, significantly reduce no-shows through automated reminders, improve customer loyalty with proactive communication, and decrease administrative workloads for staff."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Auto Repair Shops — eevolvv',
  description: 'Auto repair shops recover 10–20 hrs/week by automating appointments, declined service follow-up, and reviews. Free AI audit in 10 minutes. No signup.',
  keywords: 'auto shop automation, auto repair software AI, automotive business automation, car repair shop management software, auto service reminder automation, shop management AI',
  openGraph: {
    title: 'Stop Running Your Auto Shop on Ghost Work — eevolvv',
    description: 'Auto repair shops recover 10–20 hrs/week by automating appointments, declined service follow-up, and reviews. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/auto-shop',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/auto-shop',
  },
}

export default function AutoShopPage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['auto-shop']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoShopFaqSchema) }}
      />
    </>
  )
}

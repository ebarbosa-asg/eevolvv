import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

// Define FAQ schema for Restaurant
const restaurantFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI automation cost for a restaurant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI automation for restaurants typically starts at $499/month for tasks like online order confirmation and customer feedback collection. Pricing is adjusted based on the number and complexity of automations."
      }
    },
    {
      "@type": "Question",
      "name": "How long does AI setup take for a restaurant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Initial AI workflows, such as managing online inquiries or reservation confirmations, can be live within 48-72 hours. A quick online diagnostic can pinpoint automation opportunities."
      }
    },
    {
      "@type": "Question",
      "name": "What restaurant POS systems does eevolvv integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "eevolvv is designed to integrate with leading restaurant POS systems like Toast, Square, Clover, Lightspeed, and other popular online ordering platforms and reservation systems."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of AI for restaurants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Restaurants can achieve better customer engagement, reduced order errors, optimized staffing through workflow automation, increased online visibility, and improved efficiency in managing reservations and feedback."
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'AI Automation for Restaurants — eevolvv',
  description: 'Restaurants recover 15–25 hrs/week by automating no-shows, scheduling, and inventory. Free AI audit in 10 minutes. No signup.',
  keywords: 'restaurant automation, restaurant AI software, restaurant no-show prevention, staff scheduling automation, restaurant management software, food service automation',
  openGraph: {
    title: 'Stop Running Your Restaurant on Ghost Work — eevolvv',
    description: 'Restaurants recover 15–25 hrs/week by automating no-shows, scheduling, and inventory. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/restaurant',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/restaurant',
  },
}

export default function RestaurantPage() {
  return (
    <>
      <VerticalPage data={{...VERTICALS['restaurant']}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantFaqSchema) }}
      />
    </>
  )
}

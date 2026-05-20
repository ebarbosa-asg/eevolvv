import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for E-commerce & Online Retail — eevolvv',
  description: 'E-commerce brands recover 10–15% abandoned cart revenue and cut stockouts 40–60% with AI automation. Free audit in 10 minutes. No signup.',
  keywords: 'ecommerce automation, online store AI, abandoned cart recovery, inventory automation, ecommerce email automation, shopify automation, DTC brand automation',
  openGraph: {
    title: 'Stop Running Your Store on Ghost Work — eevolvv',
    description: 'E-commerce brands recover 10–15% abandoned cart revenue and cut stockouts 40–60% with AI automation. Free audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/ecommerce',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/ecommerce',
  },
}

export default function EcommercePage() {
  return <VerticalPage data={{...VERTICALS['ecommerce']}} />
}

import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

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
  return <VerticalPage data={{...VERTICALS['real-estate']}} />
}

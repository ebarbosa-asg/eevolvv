import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'Local Business Automation — eevolvv',
  description: 'Local business automation for leads, reviews, booking, and weekly reports. Start with a free audit.',
  openGraph: {
    title: 'Local Business Automation — eevolvv',
    description: 'Local business automation for leads, reviews, booking, and weekly reports. Start with a free audit.',
    url: 'https://eevolvv.com/local-business-automation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/local-business-automation',
  },
}

export default function LocalBusinessAutomationPage() {
  return <VerticalPage data={{...VERTICALS['local-business-automation']}} />
}

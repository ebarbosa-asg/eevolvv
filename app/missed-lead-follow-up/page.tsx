import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'Missed Lead Follow-Up Automation — eevolvv',
  description: 'Automate missed lead follow-up for local service businesses. Capture inquiries, respond quickly, route to the owner.',
  openGraph: {
    title: 'Missed Lead Follow-Up Automation — eevolvv',
    description: 'Automate missed lead follow-up for local service businesses. Capture inquiries, respond quickly, route to the owner.',
    url: 'https://eevolvv.com/missed-lead-follow-up',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/missed-lead-follow-up',
  },
}

export default function MissedLeadFollowUpPage() {
  return <VerticalPage data={{...VERTICALS['missed-lead-follow-up']}} />
}

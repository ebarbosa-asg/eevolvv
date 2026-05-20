import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Marketing Agencies — eevolvv',
  description: 'Marketing and creative agencies recover 15–20 hrs/client/month by automating reporting, proposals, and client onboarding. Free AI audit in 10 minutes.',
  keywords: 'marketing agency automation, agency AI software, client reporting automation, agency proposal automation, retainer billing automation, agency management software',
  openGraph: {
    title: 'Stop Running Your Agency on Ghost Work — eevolvv',
    description: 'Marketing and creative agencies recover 15–20 hrs/client/month by automating reporting, proposals, and client onboarding. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/agency',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/agency',
  },
}

export default function AgencyPage() {
  return <VerticalPage data={{...VERTICALS['agency']}} />
}

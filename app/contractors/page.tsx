import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

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
  return <VerticalPage data={{...VERTICALS['contractors']}} />
}

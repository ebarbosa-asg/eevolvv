import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Law Firms — eevolvv',
  description: 'Law firms recover 15–20 hrs/week of non-billable time by automating intake, billing, and document workflows. Free AI audit in 10 minutes.',
  keywords: 'law firm automation, legal practice management AI, client intake automation, legal billing automation, law firm management software, legal document automation',
  openGraph: {
    title: 'Stop Running Your Law Firm on Ghost Work — eevolvv',
    description: 'Law firms recover 15–20 hrs/week of non-billable time by automating intake, billing, and document workflows. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/law-firms',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/law-firms',
  },
}

export default function LegalPage() {
  return <VerticalPage data={{...VERTICALS['legal']}} />
}

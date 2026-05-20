import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Accounting Firms & CPAs — eevolvv',
  description: 'CPA firms and bookkeeping services recover 15–25 hrs/week by automating document collection, billing, and reconciliation. Free AI audit in 10 minutes.',
  keywords: 'accounting firm automation, CPA firm AI, bookkeeping automation, document collection automation, accounting billing automation, tax firm management software',
  openGraph: {
    title: 'Stop Running Your Accounting Firm on Ghost Work — eevolvv',
    description: 'CPA firms and bookkeeping services recover 15–25 hrs/week by automating document collection, billing, and reconciliation. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/accounting',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/accounting',
  },
}

export default function AccountingPage() {
  return <VerticalPage data={{...VERTICALS['accounting']}} />
}

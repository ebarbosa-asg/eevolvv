import type { Metadata } from 'next'
import '../homepage-v3.css'
import IntakePageClient from './IntakePageClient'

export const metadata: Metadata = {
  title: 'AI Client Intake for Law Firms — 30-Day Pilot | eevolvv',
  description: 'Every new client inquiry answered in under 60 seconds. Web + phone intake, CRM push to Clio/MyCase, automated follow-up. $997 pilot, live in 14 days.',
  openGraph: {
    title: 'AI Client Intake for Law Firms — eevolvv',
    description: 'Stop losing clients to slow response times. AI intake layer live in 14 days.',
    url: 'https://eevolvv.com/intake',
    type: 'website',
  },
  alternates: { canonical: 'https://eevolvv.com/intake' },
}

export default function IntakePage() {
  return <IntakePageClient />
}

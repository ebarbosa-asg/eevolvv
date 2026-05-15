import type { Metadata } from 'next'
import { PartnersClient } from './PartnersClient'

export const metadata: Metadata = {
  title: 'Partner with eevolvv — 10% rev share, 12 months',
  description:
    'Give your clients a free AI ghost work assessment. eevolvv builds the workflows. You keep the relationship. 10% of subscription revenue for 12 months plus 10% on one-time add-ons.',
  keywords: [
    'eevolvv partner program',
    'agency referral program',
    'ai automation referral',
    'small business automation partner',
    'web designer referral',
    'fractional coo partner',
  ],
  alternates: { canonical: 'https://eevolvv.com/partners' },
  openGraph: {
    title: 'Partner with eevolvv',
    description:
      'Refer SMBs to eevolvv. We run the diagnostic, build the agent page, ship the workflows. You earn 10% of subscription revenue for 12 months.',
    url: 'https://eevolvv.com/partners',
    type: 'website',
  },
}

export default function PartnersPage() {
  return <PartnersClient />
}

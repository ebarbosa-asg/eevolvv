import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Med Spas & Aesthetic Clinics — eevolvv',
  description: 'Med spas and aesthetic clinics recover 15–20 hrs/week by automating bookings, recalls, and membership renewals. Free AI audit in 10 minutes. No signup.',
  keywords: 'med spa automation, aesthetic clinic AI, botox clinic software, med spa management software, medical aesthetics automation, membership automation med spa',
  openGraph: {
    title: 'Stop Running Your Med Spa on Ghost Work — eevolvv',
    description: 'Med spas and aesthetic clinics recover 15–20 hrs/week by automating bookings, recalls, and membership renewals. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/medspa',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/medspa',
  },
}

export default function MedspaPage() {
  return <VerticalPage data={{...VERTICALS['medspa']}} />
}

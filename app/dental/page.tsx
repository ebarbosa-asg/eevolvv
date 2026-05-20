import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Dental Practices — eevolvv',
  description: 'Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup.',
  keywords: 'dental practice automation, dental office AI, patient recall automation, dental no-show reduction, dental management software, dental intake automation',
  openGraph: {
    title: 'Stop Running Your Dental Practice on Ghost Work — eevolvv',
    description: 'Dental offices recover 15–20 hrs/week by automating recalls, no-shows, and patient intake. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/dental',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/dental',
  },
}

export default function DentalPage() {
  return <VerticalPage data={{...VERTICALS['dental']}} />
}

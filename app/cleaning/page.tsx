import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Cleaning & Home Service Businesses — eevolvv',
  description: 'Cleaning businesses recover 15–20 hrs/week by automating scheduling, invoicing, and lead follow-up. Free AI audit in 10 minutes. No signup.',
  keywords: 'cleaning business automation, home services automation, cleaning company software, maid service automation, janitorial business software, house cleaning management AI',
  openGraph: {
    title: 'Stop Running Your Cleaning Business on Ghost Work — eevolvv',
    description: 'Cleaning businesses recover 15–20 hrs/week by automating scheduling, invoicing, and lead follow-up. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/cleaning',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/cleaning',
  },
}

export default function CleaningPage() {
  return <VerticalPage data={{...VERTICALS['cleaning']}} />
}

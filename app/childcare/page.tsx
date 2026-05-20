import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Childcare Centers & Daycares — eevolvv',
  description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
  keywords: 'childcare automation, daycare management software, childcare center AI, preschool enrollment automation, childcare billing automation, daycare parent communication',
  openGraph: {
    title: 'Stop Running Your Childcare Center on Ghost Work — eevolvv',
    description: 'Childcare centers and daycares recover 15–20 hrs/week by automating enrollment, billing, and parent communication. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/childcare',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/childcare',
  },
}

export default function ChildcarePage() {
  return <VerticalPage data={{...VERTICALS['childcare']}} />
}

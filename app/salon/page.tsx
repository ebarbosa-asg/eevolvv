import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Salons & Barbershops — eevolvv',
  description: 'Salons and barbershops recover 10–15 hrs/week by automating no-shows, rebooking, and retail upsell. Free AI audit in 10 minutes. No signup.',
  keywords: 'salon automation, barbershop software, hair salon AI, beauty salon management software, no-show reduction salon, salon booking automation, salon client retention',
  openGraph: {
    title: 'Stop Running Your Salon on Ghost Work — eevolvv',
    description: 'Salons and barbershops recover 10–15 hrs/week by automating no-shows, rebooking, and retail upsell. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/salon',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/salon',
  },
}

export default function SalonPage() {
  return <VerticalPage data={{...VERTICALS['salon']}} />
}

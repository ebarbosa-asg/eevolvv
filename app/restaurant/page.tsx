import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Restaurants — eevolvv',
  description: 'Restaurants recover 15–25 hrs/week by automating no-shows, scheduling, and inventory. Free AI audit in 10 minutes. No signup.',
  keywords: 'restaurant automation, restaurant AI software, restaurant no-show prevention, staff scheduling automation, restaurant management software, food service automation',
  openGraph: {
    title: 'Stop Running Your Restaurant on Ghost Work — eevolvv',
    description: 'Restaurants recover 15–25 hrs/week by automating no-shows, scheduling, and inventory. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/restaurant',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/restaurant',
  },
}

export default function RestaurantPage() {
  return <VerticalPage data={{...VERTICALS['restaurant']}} />
}

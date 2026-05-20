import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Auto Repair Shops — eevolvv',
  description: 'Auto repair shops recover 10–20 hrs/week by automating appointments, declined service follow-up, and reviews. Free AI audit in 10 minutes. No signup.',
  keywords: 'auto shop automation, auto repair software AI, automotive business automation, car repair shop management software, auto service reminder automation, shop management AI',
  openGraph: {
    title: 'Stop Running Your Auto Shop on Ghost Work — eevolvv',
    description: 'Auto repair shops recover 10–20 hrs/week by automating appointments, declined service follow-up, and reviews. Free AI audit in 10 minutes. No signup.',
    url: 'https://eevolvv.com/auto-shop',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/auto-shop',
  },
}

export default function AutoShopPage() {
  return <VerticalPage data={{...VERTICALS['auto-shop']}} />
}

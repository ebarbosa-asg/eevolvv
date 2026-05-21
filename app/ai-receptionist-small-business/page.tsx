import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Receptionist for Small Business — eevolvv',
  description: 'AI receptionist workflows: intake, routing, reminders, FAQs, owner alerts, and follow-up.',
  openGraph: {
    title: 'AI Receptionist for Small Business — eevolvv',
    description: 'AI receptionist workflows: intake, routing, reminders, FAQs, owner alerts, and follow-up.',
    url: 'https://eevolvv.com/ai-receptionist-small-business',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/ai-receptionist-small-business',
  },
}

export default function AiReceptionistSmallBusinessPage() {
  return <VerticalPage data={{...VERTICALS['ai-receptionist-small-business']}} />
}

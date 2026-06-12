import type { Metadata } from 'next'
import '../homepage-v3.css'
import TextbackPageClient from './TextbackPageClient'

export const metadata: Metadata = {
  title: 'Missed-Call Textback for Gyms & Studios — 30-Day Pilot | eevolvv',
  description:
    'Every missed call answered by text in 30 seconds. Automated 5-touch follow-up. Trial booking + reminders. $497 pilot, live in 7 days. 30-day money-back.',
  openGraph: {
    title: 'Missed-Call Textback for Gyms & Studios — eevolvv',
    description: 'Stop losing leads to unanswered calls. AI textback system live in 7 days.',
    url: 'https://eevolvv.com/textback',
    type: 'website',
  },
  alternates: { canonical: 'https://eevolvv.com/textback' },
}

export default function TextbackPage() {
  return <TextbackPageClient />
}

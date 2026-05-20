import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Chiropractic & Physical Therapy Practices — eevolvv',
  description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
  keywords: 'chiropractic automation, chiropractic office software AI, physical therapy automation, chiro practice management, patient recall automation, chiro no-show reduction',
  openGraph: {
    title: 'Stop Running Your Chiropractic Practice on Ghost Work — eevolvv',
    description: 'Chiropractic offices and PT practices recover 15–20 hrs/week by automating recalls, intake, and patient retention. Free AI audit in 10 minutes.',
    url: 'https://eevolvv.com/chiro',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/chiro',
  },
}

export default function ChiroPage() {
  return <VerticalPage data={{...VERTICALS['chiro']}} />
}

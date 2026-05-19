import type { Metadata } from 'next'
import '../homepage-v3.css'
import DiagnosticClient from './DiagnosticClient'

export const metadata: Metadata = {
  title: 'Free Diagnostic Report — eevolvv',
  description: 'Get a free eevolvv diagnostic report that identifies ghost work, first automations, and whether a $97 roadmap upgrade makes sense.',
  openGraph: {
    title: 'Free Diagnostic Report — eevolvv',
    description: 'Find the ghost work first. Upgrade to the roadmap only if the signal is real.',
    url: 'https://eevolvv.com/diagnostic',
  },
}

export default function DiagnosticPage() {
  return <DiagnosticClient />
}

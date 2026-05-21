import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Agents for Small Business — eevolvv',
  description: 'AI agents for small businesses: lead follow-up, booking, reviews, reporting, and recommendations in one private agent page.',
  openGraph: {
    title: 'AI Agents for Small Business — eevolvv',
    description: 'AI agents for small businesses: lead follow-up, booking, reviews, reporting, and recommendations in one private agent page.',
    url: 'https://eevolvv.com/ai-agents-for-small-business',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/ai-agents-for-small-business',
  },
}

export default function AiAgentsForSmallBusinessPage() {
  return <VerticalPage data={{...VERTICALS['ai-agents-for-small-business']}} />
}

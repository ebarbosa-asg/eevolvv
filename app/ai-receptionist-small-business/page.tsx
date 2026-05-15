import type { Metadata } from 'next'
import { GrowthLandingPage } from '@/components/GrowthLandingPage'
import { getGrowthPage } from '@/lib/growth-pages'

const page = getGrowthPage('ai-receptionist-small-business')

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  keywords: page.keywords,
  alternates: { canonical: `https://eevolvv.com/${page.slug}` },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: `https://eevolvv.com/${page.slug}`,
    type: 'website',
  },
}

export default function AiReceptionistSmallBusinessPage() {
  return <GrowthLandingPage page={page} />
}

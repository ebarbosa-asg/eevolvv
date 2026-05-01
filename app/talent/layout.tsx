import type { Metadata } from 'next'
import '@/components/talent/talent-pages.css'
import { SiteHeader } from '@/components/talent/SiteHeader'
import { SiteFooter } from '@/components/talent/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://talent.eevolvv.com'),
  title: 'eevolvv/talent — Skilled work, placed right',
  description:
    'We match talent to scope. No feed. No résumé wall. One name when the fit is real.',
  openGraph: {
    title: 'eevolvv/talent — Skilled work, placed right',
    description:
      'We match talent to scope. No feed. No résumé wall. One name when the fit is real.',
    url: 'https://talent.eevolvv.com',
    siteName: 'eevolvv/talent',
  },
}

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="talent-root">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}

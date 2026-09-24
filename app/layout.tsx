import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eevolvv.com'),
  title: 'eevolvv — your show is the place to stand',
  description: 'Daily Shorts, TikToks, Reels, and LinkedIn clips cut from the episodes you already record. Posted on your accounts, after you approve. Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo.',
  openGraph: {
    title: 'eevolvv — your show is the place to stand',
    description: 'Daily Shorts, TikToks, Reels, and LinkedIn clips cut from the episodes you already record. Posted on your accounts, after you approve.',
    type: 'website',
    url: 'https://eevolvv.com',
    siteName: 'eevolvv',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'eevolvv clipping and distribution' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eevolvv — your show is the place to stand',
    description: 'Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

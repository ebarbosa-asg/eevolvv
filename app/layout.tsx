import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eevolvv.com'),
  title: 'eevolvv — clipping for creators who record but never post enough',
  description: 'Done-for-you Shorts, TikToks, and Reels. Your content is the place to stand; our automation is the lever. Clip & Ship $1,497/mo · Clip & Dominate $3,497/mo.',
  openGraph: {
    title: 'eevolvv — clipping for creators who record but never post enough',
    description: 'Your content is the place to stand. Our automation is the lever.',
    type: 'website',
    url: 'https://eevolvv.com',
    siteName: 'eevolvv',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'eevolvv clipping and distribution' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eevolvv — clipping for creators who record but never post enough',
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

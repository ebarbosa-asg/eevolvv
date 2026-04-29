import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://eevolvv.com'),
  title: 'eevolvv — AI Business Transformation',
  description: 'We map your workflows, deploy AI automation, and permanently rebuild how your business operates—with a structured day-60 review.',
  keywords: 'AI business transformation, business automation, AI operations, workflow automation, AI integration',
  openGraph: {
    title: 'eevolvv — AI Business Transformation',
    description: 'We map your workflows, deploy AI automation, and permanently rebuild how your business operates.',
    type: 'website',
    url: 'https://eevolvv.com',
    siteName: 'eevolvv',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'eevolvv — AI Business Transformation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eevolvv — AI Business Transformation',
    description: 'We map your workflows, deploy AI automation, and permanently rebuild how your business operates.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}

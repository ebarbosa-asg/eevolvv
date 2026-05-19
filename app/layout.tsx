import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://eevolvv.com'),
  title: 'eevolvv — AI Operations Team for Growing Businesses',
  description: 'We find the ghost work inside your business, build AI agents to run it, and give every client a private agent page, Ghost Locker, reports, and monthly recalibration.',
  keywords: 'AI operations team, ghost work audit, AI business diagnostic, client agent page, workflow automation, AI agents for business',
  openGraph: {
    title: 'eevolvv — AI Operations Team for Growing Businesses',
    description: 'We find ghost work, build AI agents, and turn every client engagement into a visible operating layer.',
    type: 'website',
    url: 'https://eevolvv.com',
    siteName: 'eevolvv',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'eevolvv — AI operations team for growing businesses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eevolvv — AI Operations Team for Growing Businesses',
    description: 'Find the ghost work. Build the agents. Compound forever.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'eevolvv',
              alternateName: 'eevolvv, Inc.',
              url: 'https://eevolvv.com',
              description: 'AI operations team for growing businesses. We find ghost work, build AI agents, and turn every client engagement into a visible operating layer.',
              foundingDate: '2025',
              founder: { '@type': 'Person', name: 'Eduardo Barbosa' },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dallas',
                addressRegion: 'TX',
                addressCountry: 'US',
              },
              telephone: '+18444338658',
              priceRange: '$499 - $1,999/mo',
              sameAs: [
                'https://linkedin.com/company/eevolvv',
                'https://x.com/eevolvv',
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

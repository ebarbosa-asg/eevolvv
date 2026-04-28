import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Evolution — Your Business, Evolved.',
  description: 'We map, automate, and rebuild how your business operates using AI. From corner shops to enterprises — every business can evolve.',
  keywords: 'AI business transformation, business automation, AI operations, business optimization, AI integration',
  openGraph: {
    title: 'The Evolution — Your Business, Evolved.',
    description: 'We map, automate, and rebuild how your business operates using AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

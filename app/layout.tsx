import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'eevolvv — AI Business Transformation',
  description: 'We map your workflows, deploy AI automation, and permanently rebuild how your business operates. 60-day ROI guarantee.',
  keywords: 'AI business transformation, business automation, AI operations, workflow automation, AI integration',
  openGraph: {
    title: 'eevolvv — AI Business Transformation',
    description: 'We map your workflows, deploy AI automation, and permanently rebuild how your business operates.',
    type: 'website',
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

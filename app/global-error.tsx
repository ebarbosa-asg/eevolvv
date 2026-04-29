'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body style={{ background: '#080808', color: '#f5f5f5', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
          <div style={{ color: '#00ff94', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '16px' }}>
            EEVOLVV
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            style={{ background: '#00ff94', color: '#080808', border: 'none', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            Try again →
          </button>
        </div>
      </body>
    </html>
  )
}

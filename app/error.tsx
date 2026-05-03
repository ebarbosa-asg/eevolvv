'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Route-level error boundary (App Router). Catches errors in segments below the root layout.
 * global-error.tsx handles root layout failures only; without this file, dev can fall back to
 * Next’s “missing required error components, refreshing...” screen when error UI can’t load.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div
      style={{
        background: '#080808',
        color: '#f5f5f5',
        fontFamily: 'ui-monospace, monospace',
        minHeight: '100vh',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ color: '#00ff94', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>EEVOLVV</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Something went wrong</h2>
        {process.env.NODE_ENV === 'development' && (
          <pre
            style={{
              textAlign: 'left',
              fontSize: 12,
              color: '#c4c4c4',
              background: '#121212',
              padding: 12,
              borderRadius: 8,
              overflow: 'auto',
              maxHeight: 160,
              marginBottom: 16,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </pre>
        )}
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: '#00ff94',
            color: '#080808',
            border: 'none',
            padding: '12px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Try again →
        </button>
      </div>
    </div>
  )
}

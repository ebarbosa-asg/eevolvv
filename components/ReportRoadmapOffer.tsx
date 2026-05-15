'use client'

import { useState } from 'react'
import { REPORT_ROADMAP_PRODUCT } from '@/lib/cash-products'

export function ReportRoadmapOffer({
  email,
  submissionId,
  compact = false,
}: {
  email?: string
  submissionId?: string
  compact?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: REPORT_ROADMAP_PRODUCT.key,
          email,
          submissionId,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Checkout is not ready yet.')
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        border: '1px solid var(--ink)',
        background: compact ? 'rgba(140,43,26,0.07)' : 'var(--ink)',
        color: compact ? 'var(--ink)' : 'var(--paper)',
        padding: compact ? 20 : 28,
        marginBottom: compact ? 22 : 28,
      }}
    >
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 10, fontWeight: 700 }}>
        FAST PATH · NO CALL REQUIRED
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 20, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: compact ? 22 : 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
            {REPORT_ROADMAP_PRODUCT.name} — {REPORT_ROADMAP_PRODUCT.price}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, opacity: compact ? 0.66 : 0.58, margin: 0, maxWidth: 720 }}>
            Get the full implementation roadmap for your specific tools, highest-ROI fixes, and what to build first. No sales call required.
          </p>
        </div>
        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mono"
          style={{
            border: 'none',
            background: compact ? 'var(--ink)' : 'var(--accent)',
            color: 'var(--paper)',
            padding: '16px 22px',
            fontSize: 11,
            letterSpacing: '0.16em',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.66 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'OPENING...' : 'GET ROADMAP →'}
        </button>
      </div>
      <div className="mono" style={{ fontSize: 10, lineHeight: 1.7, marginTop: 16, opacity: compact ? 0.52 : 0.46 }}>
        → proof: permanent report URL · prioritized fixes · tool-specific next steps · agent page upgrade path
      </div>
      {error && (
        <div style={{ marginTop: 12, color: 'var(--accent)', fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  )
}

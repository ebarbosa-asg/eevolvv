'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TestimonialPage() {
  const { token } = useParams<{ token: string }>()
  const [quote, setQuote] = useState('')
  const [metric, setMetric] = useState('')
  const [name, setName] = useState('')
  const [vertical, setVertical] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quote.trim()) { setErrorMsg('Please share your experience.'); return }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/testimonial/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quote, metric, name, vertical }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16, fontWeight: 700 }}>EEVOLVV</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Thank you.</h1>
          <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6 }}>
            Your feedback means a lot — it helps the next business owner make a real decision.
            I read every single one.
          </p>
          <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6, marginTop: 8 }}>— E</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>

        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 20, fontWeight: 700 }}>
          § · EEVOLVV FIRST FIX FEEDBACK
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.1 }}>
          How did the First Fix land?
        </h1>
        <p style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.6, marginBottom: 36 }}>
          Two questions. Totally honest — good, bad, or in between.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', marginBottom: 8, color: 'var(--accent)', fontWeight: 700 }}>
              WHAT WAS YOUR EXPERIENCE? *
            </label>
            <textarea
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder="The automation we built saved us about 4 hours a week and we stopped missing follow-ups..."
              required
              rows={5}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink)', background: 'transparent', fontSize: 14, fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', marginBottom: 8, color: 'var(--accent)', fontWeight: 700 }}>
              ANY SPECIFIC RESULT OR NUMBER? <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
            </label>
            <input
              type="text"
              value={metric}
              onChange={e => setMetric(e.target.value)}
              placeholder="e.g. Save 4 hours/week, 30% fewer missed leads"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink)', background: 'transparent', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', marginBottom: 8, color: 'var(--accent)', fontWeight: 700 }}>
                YOUR NAME <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane D."
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink)', background: 'transparent', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', marginBottom: 8, color: 'var(--accent)', fontWeight: 700 }}>
                INDUSTRY <span style={{ opacity: 0.5 }}>(OPTIONAL)</span>
              </label>
              <input
                type="text"
                value={vertical}
                onChange={e => setVertical(e.target.value)}
                placeholder="Law firm, gym, dental..."
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--ink)', background: 'transparent', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 16 }}>{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mono"
            style={{ width: '100%', padding: '18px 0', background: 'var(--ink)', color: 'var(--paper)', border: 'none', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
          >
            {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT FEEDBACK →'}
          </button>
        </form>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'

const SAMPLE_ROWS = [
  ['Lead response', 'slow', 'first fix'],
  ['Intake handoff', 'manual', 'automate'],
  ['Weekly reporting', 'fragmented', 'roadmap'],
]

export default function DiagnosticClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportUrl, setReportUrl] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setReportUrl(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      businessName: String(form.get('businessName') || ''),
      businessType: String(form.get('businessType') || ''),
      topPains: String(form.get('topPains') || ''),
      tools: String(form.get('tools') || ''),
      revenue: String(form.get('revenue') || ''),
      teamSize: String(form.get('teamSize') || ''),
    }

    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || !data.reportUrl) {
        setError(data.error ?? 'Could not create the report yet.')
        setLoading(false)
        return
      }

      setReportUrl(data.reportUrl)
      window.location.href = data.reportUrl
    } catch {
      setError('Network error. Try again in a moment.')
      setLoading(false)
    }
  }

  return (
    <main className="diagnostic-page">
      <section className="diagnostic-hero">
        <div className="site-rail diagnostic-grid">
          <div className="diagnostic-copy">
            <a href="/" className="diagnostic-back mono">← eevolvv</a>
            <div className="diagnostic-kicker mono">
              <span className="tiny-spray-v" aria-hidden="true">v</span>
              Free diagnostic report
            </div>
            <h1>Show us the messy part. We’ll send back the report.</h1>
            <p>
              This is the clean entry point: a free diagnostic report first, then a discounted
              $97 roadmap only if you want the full build plan.
            </p>
          </div>

          <div className="diagnostic-preview" aria-label="Sample diagnostic report preview">
            <div className="diagnostic-preview-head">
              <span className="mono">Report preview</span>
              <b>FREE</b>
            </div>
            <div className="diagnostic-signal">
              <span className="mono">Signal</span>
              <strong>82%</strong>
            </div>
            <div className="diagnostic-preview-rows">
              {SAMPLE_ROWS.map(([a, b, c]) => (
                <div key={a}>
                  <span>{a}</span>
                  <em>{b}</em>
                  <b>{c}</b>
                </div>
              ))}
            </div>
            <div className="diagnostic-roadmap-note">
              <span className="mono">Roadmap upgrade</span>
              <p><s>$249</s> <b>$97</b> after the free report.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="diagnostic-form-section">
        <div className="site-rail diagnostic-form-grid">
          <form className="diagnostic-form" onSubmit={submit}>
            <div className="diagnostic-form-head">
              <span className="mono">Build my report</span>
              <span>3 minutes</span>
            </div>

            <label>
              Your name
              <input name="name" autoComplete="name" placeholder="Jane Operator" />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
            </label>
            <label>
              Business
              <input name="businessName" autoComplete="organization" placeholder="Company name" />
            </label>
            <label>
              Business type
              <input name="businessType" placeholder="Dental office, contractor, agency..." required />
            </label>
            <label>
              What feels most manual right now?
              <textarea name="topPains" placeholder="Leads, scheduling, intake, reporting, follow-up..." required />
            </label>
            <label>
              Tools you already use
              <input name="tools" placeholder="Google Workspace, HubSpot, Stripe, Square..." />
            </label>
            <div className="diagnostic-form-two">
              <label>
                Monthly revenue
                <input name="revenue" placeholder="$50K" />
              </label>
              <label>
                Team size
                <input name="teamSize" placeholder="8" />
              </label>
            </div>

            {error && <div className="diagnostic-error">{error}</div>}
            {reportUrl && <div className="diagnostic-success">Report created. Opening now...</div>}

            <button type="submit" className="btn-primary report-primary" disabled={loading}>
              {loading ? 'Building report...' : 'Get free report →'}
            </button>
          </form>

          <aside className="diagnostic-volvve">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/volvv-e.png" alt="" />
            <div>
              <span className="mono">Volvv-E note</span>
              <p>
                The free report should feel useful on its own. The roadmap is only for people
                who want the exact build order.
              </p>
              <a href="/api/stripe/checkout?product=report-roadmap&source=diagnostic-page">
                Skip to $97 roadmap →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

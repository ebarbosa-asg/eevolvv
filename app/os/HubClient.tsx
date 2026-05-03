'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import type { Submission, GitHubCommit } from './page'

const RESPONSIVE_CSS = `
  .os-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .os-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
  .os-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .os-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .os-grid-links { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .os-grid-docs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .os-table-wrap { overflow-x: auto; }
  .os-topbar-clock { display: block; }
  .os-content-pad { padding: 48px 32px; }
  @media (max-width: 900px) {
    .os-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .os-grid-5 { grid-template-columns: repeat(2, 1fr); }
    .os-grid-3 { grid-template-columns: repeat(2, 1fr); }
    .os-grid-2 { grid-template-columns: 1fr; }
    .os-grid-links { grid-template-columns: repeat(2, 1fr); }
    .os-grid-docs { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .os-topbar-clock { display: none; }
    .os-content-pad { padding: 32px 16px; }
    .os-grid-3 { grid-template-columns: 1fr; }
  }
`

type Metrics = {
  events: Record<string, { '7d': number; '30d': number }>
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="os-section-marker" style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: 'var(--accent)',
      marginBottom: '24px',
    }}>
      § {n} · {label}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="os-card" style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      padding: '24px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        opacity: 0.5,
        marginBottom: '8px',
      }}>{label}</div>
      <div className="os-stat" style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--accent)',
        fontSize: '2rem',
        lineHeight: 1,
      }}>{value}</div>
    </div>
  )
}

function EditableField({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)

  useEffect(() => setLocal(value), [value])

  const save = () => { setEditing(false); onChange(local) }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        opacity: 0.5,
        marginBottom: '4px',
      }}>{label}</div>
      {editing ? (
        <input
          className="os-input"
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={save}
          onKeyDown={e => e.key === 'Enter' && save()}
          autoFocus
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--accent)',
            color: 'var(--paper)',
            fontFamily: 'JetBrains Mono, monospace',
            outline: 'none',
            fontSize: '1.5rem',
            width: '100%',
            paddingBottom: '2px',
          }}
        />
      ) : (
        <div
          className="os-stat"
          onClick={() => setEditing(true)}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--accent)',
            fontSize: '2rem',
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >{value || '—'}</div>
      )}
    </div>
  )
}

const FUNNEL_EVENTS = [
  'diagnostic_chat_started',
  'diagnostic_intake_completed',
  'diagnostic_report_generated',
  'diagnostic_cta_clicked',
] as const

const CONVERSION_PAIRS = [
  { from: 'diagnostic_chat_started', to: 'diagnostic_intake_completed' },
  { from: 'diagnostic_intake_completed', to: 'diagnostic_report_generated' },
  { from: 'diagnostic_report_generated', to: 'diagnostic_cta_clicked' },
]

const QUICK_LINKS = [
  { name: 'eevolvv.com', tag: 'Live site', url: 'https://eevolvv.com' },
  { name: 'eevolvv/talent', tag: 'Talent platform', url: 'https://talent.eevolvv.com' },
  { name: 'HubSpot', tag: 'CRM + pipeline', url: 'https://app.hubspot.com' },
  { name: 'Linear', tag: 'Engineering', url: 'https://linear.app' },
  { name: 'Notion', tag: 'Knowledge base', url: 'https://notion.so' },
  { name: 'Wave', tag: 'Accounting', url: 'https://www.waveapps.com/accounting' },
  { name: 'PostHog', tag: 'Analytics', url: 'https://app.posthog.com' },
  { name: 'PandaDoc', tag: 'Proposals', url: 'https://app.pandadoc.com' },
  { name: 'Mercury', tag: 'Banking', url: 'https://mercury.com' },
  { name: 'Stripe', tag: 'Payments', url: 'https://dashboard.stripe.com' },
  { name: 'Vercel', tag: 'Hosting', url: 'https://vercel.com/dashboard' },
  { name: 'Supabase', tag: 'Database', url: 'https://supabase.com/dashboard/project/qmdygiumftesoqzqmsqe' },
  { name: 'Resend', tag: 'Email', url: 'https://resend.com' },
  { name: 'Anthropic', tag: 'AI / API keys', url: 'https://console.anthropic.com' },
  { name: 'Grasshopper', tag: 'Phone', url: 'https://grasshopper.com' },
  { name: 'Calendly', tag: 'Scheduling', url: 'https://calendly.com/hello-eevolvv' },
  { name: 'Bitwarden', tag: 'Passwords', url: 'https://vault.bitwarden.com' },
  { name: 'GitHub', tag: 'Codebase', url: 'https://github.com/ebarbosa-asg/eevolvv' },
]

const CARD_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  padding: '24px',
} as const

const MONO_LABEL_STYLE = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  opacity: 0.4,
  marginBottom: '8px',
}

export default function HubClient({ submissions, commits }: {
  submissions: Submission[]
  commits: GitHubCommit[]
}) {
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const [expanded, setExpanded] = useState<string | null>(null)

  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [metricsError, setMetricsError] = useState(false)

  useEffect(() => {
    fetch('/api/os/metrics')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: Metrics) => setMetrics(d))
      .catch(() => setMetricsError(true))
      .finally(() => setMetricsLoading(false))
  }, [])

  const [pipeline, setPipeline] = useState({
    active_leads: '0', in_diagnostic: '0', proposal_sent: '0',
    closed_won: '0', pipeline_value: '$0', notes: '',
  })
  const [finance, setFinance] = useState({
    mrr: '$0', arr: '$0', bank_balance: '$0', outstanding_invoices: '$0',
  })
  const [investor, setInvestor] = useState({
    target_raise: '$1,000,000', commitments: '$0', key_meetings: '',
  })

  useEffect(() => {
    const p = localStorage.getItem('os_pipeline')
    if (p) setPipeline(prev => ({ ...prev, ...(JSON.parse(p) as typeof prev) }))
    const f = localStorage.getItem('os_finance')
    if (f) setFinance(prev => ({ ...prev, ...(JSON.parse(f) as typeof prev) }))
    const i = localStorage.getItem('os_investor')
    if (i) setInvestor(prev => ({ ...prev, ...(JSON.parse(i) as typeof prev) }))
  }, [])

  const updatePipeline = useCallback((key: string, value: string) => {
    setPipeline(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('os_pipeline', JSON.stringify(next))
      return next
    })
  }, [])

  const updateFinance = useCallback((key: string, value: string) => {
    setFinance(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('os_finance', JSON.stringify(next))
      return next
    })
  }, [])

  const updateInvestor = useCallback((key: string, value: string) => {
    setInvestor(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('os_investor', JSON.stringify(next))
      return next
    })
  }, [])

  const total = submissions.length
  const completed = submissions.filter(s => s.status === 'completed').length
  const emailsSent = submissions.filter(s => s.email_sent).length
  const errors = submissions.filter(s => s.status === 'error').length
  const errorRate = total > 0 ? `${Math.round((errors / total) * 100)}%` : '0%'

  return (
    <div style={{ background: 'var(--ink)', color: 'var(--paper)', minHeight: '100vh', fontFamily: 'Space Grotesk, sans-serif' }}>
      <style>{RESPONSIVE_CSS}</style>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '52px',
      }}>
        <span className="brand-wordmark" style={{ fontSize: '18px', color: 'var(--paper)' }}>eevolvv</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="os-topbar-clock" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', opacity: 0.6 }}>{clock}</span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
            textTransform: 'uppercase', letterSpacing: '0.15em',
            color: 'var(--accent)', border: '1px solid var(--accent)', padding: '3px 8px',
          }}>INTERNAL</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'rgba(250,247,240,0.45)', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >sign out</button>
        </div>
      </div>

      <div className="os-content-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* § 01 · DIAGNOSTIC FEED */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="01" label="DIAGNOSTIC FEED" />
          <div className="os-grid-4" style={{ marginBottom: '32px' }}>
            <Stat label="Total" value={total} />
            <Stat label="Completed" value={completed} />
            <Stat label="Emails sent" value={emailsSent} />
            <Stat label="Error rate" value={errorRate} />
          </div>
          <div className="os-card os-table-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name', 'Business', 'Tier', 'Status', 'When', '✉'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <Fragment key={s.id}>
                    <tr
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.business_name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', textTransform: 'uppercase' }}>{s.tier ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: s.status === 'completed' ? '#4ade80' : s.status === 'error' ? 'var(--accent)' : '#f59e0b' }} />
                          {s.status ?? '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.6 }}>{relativeTime(s.created_at)}</td>
                      <td style={{ padding: '12px 16px', fontSize: '16px' }}>{s.email_sent ? '✓' : '—'}</td>
                    </tr>
                    {expanded === s.id && s.report && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0 16px 16px' }}>
                          <div style={{
                            background: 'rgba(20,20,19,0.55)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderLeft: '3px solid var(--accent)',
                            padding: '16px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '13px', lineHeight: 1.9,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          }}>{s.report}</div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', opacity: 0.4, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>No submissions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* § 02 · FUNNEL METRICS */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="02" label="FUNNEL METRICS" />
          {metricsLoading ? (
            <div className="os-grid-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ ...CARD_STYLE, height: '100px', opacity: 0.4 }} />
              ))}
            </div>
          ) : metricsError || !metrics ? (
            <div className="os-card" style={{ ...CARD_STYLE, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', opacity: 0.6 }}>
              Metrics unavailable —{' '}
              <a href="https://us.posthog.com/project/407291/dashboard/1537727" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                view PostHog dashboard →
              </a>
            </div>
          ) : (
            <>
              <div className="os-grid-4" style={{ marginBottom: '16px' }}>
                {FUNNEL_EVENTS.map(evt => {
                  const d = metrics.events?.[evt]
                  return (
                    <div key={evt} className="os-card" style={CARD_STYLE}>
                      <div style={{ ...MONO_LABEL_STYLE, fontSize: '10px' }}>{evt.replace('diagnostic_', '')}</div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                        <div>
                          <div className="os-stat" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '2rem', lineHeight: 1 }}>{d?.['7d'] ?? '—'}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>7d</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.25rem', color: 'rgba(250,247,240,0.5)', lineHeight: 1 }}>{d?.['30d'] ?? '—'}</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>30d</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="os-card" style={{ ...CARD_STYLE, padding: '16px 24px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                {CONVERSION_PAIRS.map(({ from, to }) => {
                  const fromCount = metrics.events?.[from]?.['7d']
                  const toCount = metrics.events?.[to]?.['7d']
                  const pct = fromCount && toCount && fromCount > 0 ? Math.round((toCount / fromCount) * 100) : null
                  return (
                    <span key={`${from}-${to}`}>
                      <span style={{ opacity: 0.4 }}>{from.replace('diagnostic_', '')} → {to.replace('diagnostic_', '')}</span>
                      <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>{pct !== null ? `${pct}%` : '—'}</span>
                    </span>
                  )
                })}
                <a href="https://us.posthog.com/project/407291/dashboard/1537727" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', marginLeft: 'auto' }}>PostHog →</a>
              </div>
            </>
          )}
        </section>

        {/* § 03 · PIPELINE */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="03" label="PIPELINE" />
          <div className="os-grid-5" style={{ marginBottom: '16px' }}>
            {([
              { key: 'active_leads', label: 'Active leads' },
              { key: 'in_diagnostic', label: 'In diagnostic' },
              { key: 'proposal_sent', label: 'Proposal sent' },
              { key: 'closed_won', label: 'Closed-won' },
              { key: 'pipeline_value', label: 'Pipeline value' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="os-card" style={CARD_STYLE}>
                <EditableField label={label} value={pipeline[key]} onChange={v => updatePipeline(key, v)} />
              </div>
            ))}
          </div>
          <div className="os-card" style={CARD_STYLE}>
            <div style={MONO_LABEL_STYLE}>Notes</div>
            <textarea
              value={pipeline.notes}
              onChange={e => updatePipeline('notes', e.target.value)}
              placeholder="Free notes..."
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px', outline: 'none', resize: 'vertical', minHeight: '80px', paddingBottom: '4px',
              }}
            />
            <div style={{ marginTop: '16px' }}>
              <a href="https://app.hubspot.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ HubSpot</a>
            </div>
          </div>
        </section>

        {/* § 04 · FINANCE */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="04" label="FINANCE" />
          <div className="os-grid-4" style={{ marginBottom: '16px' }}>
            {([
              { key: 'mrr', label: 'MRR' },
              { key: 'arr', label: 'ARR' },
              { key: 'bank_balance', label: 'Bank balance' },
              { key: 'outstanding_invoices', label: 'Outstanding invoices' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="os-card" style={CARD_STYLE}>
                <EditableField label={label} value={finance[key]} onChange={v => updateFinance(key, v)} />
              </div>
            ))}
          </div>
          <div className="os-card" style={{ ...CARD_STYLE, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.5 }}>$1M pre-seed raise · Q2 2026</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Mercury', url: 'https://mercury.com' },
                { label: 'Stripe', url: 'https://dashboard.stripe.com' },
                { label: 'Wave', url: 'https://www.waveapps.com/accounting' },
              ].map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ {label}</a>
              ))}
            </div>
          </div>
        </section>

        {/* § 05 · ENGINEERING */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="05" label="ENGINEERING" />
          <div className="os-grid-2">
            <div className="os-card" style={CARD_STYLE}>
              <div style={MONO_LABEL_STYLE}>Recent commits</div>
              {commits.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {commits.map(c => (
                    <div key={c.sha} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{c.sha.slice(0, 7)}</span>
                      <span style={{ flex: 1, opacity: 0.8 }}>{c.commit.message.split('\n')[0]}</span>
                      <span style={{ opacity: 0.4, flexShrink: 0 }}>{relativeTime(c.commit.author.date)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.4 }}>Unable to fetch commits</div>
              )}
            </div>
            <div className="os-card" style={CARD_STYLE}>
              <div style={MONO_LABEL_STYLE}>Deep links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'GitHub', url: 'https://github.com/ebarbosa-asg/eevolvv' },
                  { label: 'Linear', url: 'https://linear.app' },
                  { label: 'Vercel', url: 'https://vercel.com/dashboard' },
                ].map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--accent)' }}>→ {label}</a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* § 06 · INVESTOR */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="06" label="INVESTOR" />
          <div className="os-grid-3" style={{ marginBottom: '16px' }}>
            {([
              { key: 'target_raise', label: 'Target raise' },
              { key: 'commitments', label: 'Commitments' },
              { key: 'key_meetings', label: 'Key meetings' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="os-card" style={CARD_STYLE}>
                <EditableField label={label} value={investor[key]} onChange={v => updateInvestor(key, v)} />
              </div>
            ))}
          </div>
          <div className="os-card" style={{ ...CARD_STYLE, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.5 }}>Option A strategy · SMB brand + enterprise revenue</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Pitch Deck', url: '/investor/pitch.html' },
                { label: 'Investor Strategy', url: '/investor/investor-strategy.md' },
                { label: 'Calendly', url: 'https://calendly.com/hello-eevolvv' },
              ].map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ {label}</a>
              ))}
            </div>
          </div>
        </section>

        {/* § 07 · QUICK LINKS */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="07" label="QUICK LINKS" />
          <div className="os-grid-links">
            {QUICK_LINKS.map(({ name, tag, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="os-card"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--paper)', opacity: 0.5 }}>{tag}</div>
              </a>
            ))}
          </div>
        </section>

        {/* § 08 · INTERNAL DOCS */}
        <section style={{ marginBottom: '72px' }}>
          <SectionMarker n="08" label="INTERNAL DOCS" />
          <div className="os-grid-docs">
            <a
              href="/service-agreement.docx"
              download
              className="os-card"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none' }}
            >
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>Service Agreement</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', opacity: 0.8 }}>↓ download</div>
            </a>
            {[
              { label: 'Pitch Deck', url: '/investor/pitch.html' },
              { label: 'Privacy Policy', url: '/privacy' },
              { label: 'Terms', url: '/terms' },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="os-card"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none' }}
              >
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', opacity: 0.8 }}>→ open</div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

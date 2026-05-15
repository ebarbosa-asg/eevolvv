'use client'

import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  .os-section { margin-bottom: 72px; border-left: 3px solid var(--accent); padding-left: 20px; }
  .os-card { transition: background 0.15s ease; }
  .os-skeleton { animation: os-pulse 1.5s ease-in-out infinite; background: rgba(255,255,255,0.06); border-radius: 2px; }
  @keyframes os-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
  .os-slide-form { overflow: hidden; transition: max-height 0.35s ease, opacity 0.25s ease; }
  .os-slide-form.open { max-height: 700px; opacity: 1; }
  .os-slide-form.closed { max-height: 0; opacity: 0; }
  .editable-hover:hover { border-bottom: 1px solid rgba(250,247,240,0.2); cursor: text; }
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

export type Client = {
  id: string
  name: string
  company: string
  email: string | null
  phone: string | null
  business_type: string | null
  contract_value: number | null
  stage: 'diagnose' | 'onboard' | 'build' | 'maintain'
  health: 'green' | 'yellow' | 'red'
  notes: string | null
  submission_id: string | null
  created_at: string
  updated_at: string
  agent_count: number
  latest_task: { id: string; status: string; updated_at: string } | null
}

export type AgentRow = {
  id: string
  name: string
  type: string | null
  status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null
  repo_url: string | null
  deploy_url: string | null
  last_run_at: string | null
  health: 'green' | 'yellow' | 'red'
  client_company: string | null
  client_id: string | null
}

type Metrics = { events: Record<string, { '7d': number; '30d': number }> }

const STAGES = ['diagnose', 'onboard', 'build', 'maintain'] as const

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function GhostLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M14 1C7.37 1 2 6.37 2 13V27Q3.5 24.5 5 27Q6.5 29.5 8 27Q9.5 24.5 11 27Q12.5 29.5 14 27Q15.5 24.5 17 27Q18.5 29.5 20 27Q21.5 24.5 23 27Q24.5 29.5 26 27V13C26 6.37 20.63 1 14 1Z"
        fill="rgba(250,247,240,0.92)"
        stroke="rgba(250,247,240,0.15)"
        strokeWidth="0.5"
      />
      <ellipse cx="10" cy="13" rx="3" ry="3.5" fill="white" />
      <ellipse cx="18" cy="13" rx="3" ry="3.5" fill="white" />
      <circle cx="11.2" cy="13.8" r="1.6" fill="#141413" />
      <circle cx="19.2" cy="13.8" r="1.6" fill="#141413" />
      <circle cx="11.8" cy="13.2" r="0.55" fill="rgba(250,247,240,0.9)" />
      <circle cx="19.8" cy="13.2" r="0.55" fill="rgba(250,247,240,0.9)" />
    </svg>
  )
}

function SectionMarker({ n, label, noMargin }: { n: string; label: string; noMargin?: boolean }) {
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: noMargin ? 0 : '24px' }}>
      § {n} · {label}
    </div>
  )
}

export function HealthDot({ health }: { health: 'green' | 'yellow' | 'red' }) {
  const color = health === 'green' ? '#4ade80' : health === 'yellow' ? '#f59e0b' : 'var(--accent)'
  return <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
}

export function StagePipeline({ stage }: { stage: string }) {
  const active = STAGES.indexOf(stage as typeof STAGES[number])
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {STAGES.map((s, i) => (
        <Fragment key={s}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: i <= active ? 'var(--accent)' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} title={s} />
          {i < STAGES.length - 1 && <div style={{ width: '10px', height: '1px', background: i < active ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }} />}
        </Fragment>
      ))}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { border: string; color: string }> = {
    dev:     { border: 'rgba(255,255,255,0.2)', color: 'rgba(250,247,240,0.45)' },
    staging: { border: '#f59e0b', color: '#f59e0b' },
    live:    { border: '#4ade80', color: '#4ade80' },
    paused:  { border: 'rgba(255,255,255,0.2)', color: 'rgba(250,247,240,0.35)' },
    error:   { border: 'var(--accent)', color: 'var(--accent)' },
  }
  const c = map[status] ?? map.dev
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${c.border}`, color: c.color, borderRadius: '4px', padding: '2px 6px' }}>
      {status}
    </span>
  )
}

function Skeleton({ height = 80 }: { height?: number }) {
  return <div className="os-skeleton" style={{ height }} />
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="os-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '2rem', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  const save = () => { setEditing(false); onChange(local) }
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '4px' }}>{label}</div>
      {editing ? (
        <input value={local} onChange={e => setLocal(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()} autoFocus
          style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent)', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', outline: 'none', fontSize: '1.5rem', width: '100%', paddingBottom: '2px' }} />
      ) : (
        <div className="editable-hover" onClick={() => setEditing(true)}
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '2rem', lineHeight: 1 }}>
          {value || '—'}
        </div>
      )}
    </div>
  )
}

const FUNNEL_EVENTS = ['diagnostic_chat_started','diagnostic_intake_completed','diagnostic_report_generated','diagnostic_cta_clicked'] as const
const CONVERSION_PAIRS = [
  { from: 'diagnostic_chat_started', to: 'diagnostic_intake_completed' },
  { from: 'diagnostic_intake_completed', to: 'diagnostic_report_generated' },
  { from: 'diagnostic_report_generated', to: 'diagnostic_cta_clicked' },
]
const QUICK_LINKS = [
  { name: 'eevolvv.com', tag: 'Live site', url: 'https://eevolvv.com' },
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

const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' } as const
const MONO_LABEL = { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.1em', opacity: 0.4, marginBottom: '8px' }
const INPUT_STYLE = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' } as const

function saveState(key: string, value: unknown) {
  fetch('/api/os/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) }).catch(() => {})
}

export default function HubClient({ submissions, commits }: { submissions: Submission[]; commits: GitHubCommit[] }) {
  const router = useRouter()
  // Clock
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])

  const [expanded, setExpanded] = useState<string | null>(null)

  // Metrics
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [metricsError, setMetricsError] = useState(false)
  useEffect(() => {
    fetch('/api/os/metrics').then(r => r.ok ? r.json() : Promise.reject()).then((d: Metrics) => setMetrics(d)).catch(() => setMetricsError(true)).finally(() => setMetricsLoading(false))
  }, [])

  // Clients
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientForm, setNewClientForm] = useState({ name: '', company: '', email: '', business_type: '', contract_value: '', stage: 'diagnose' })
  const [clientSubmitting, setClientSubmitting] = useState(false)

  const fetchClients = useCallback(() => {
    setClientsLoading(true)
    fetch('/api/os/clients').then(r => r.json()).then((d: Client[]) => setClients(d)).catch(() => {}).finally(() => setClientsLoading(false))
  }, [])
  useEffect(() => { fetchClients() }, [fetchClients])

  const submitNewClient = async () => {
    if (!newClientForm.name || !newClientForm.company) return
    setClientSubmitting(true)
    await fetch('/api/os/clients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newClientForm, contract_value: newClientForm.contract_value ? parseFloat(newClientForm.contract_value) : null }),
    })
    setClientSubmitting(false)
    setNewClientOpen(false)
    setNewClientForm({ name: '', company: '', email: '', business_type: '', contract_value: '', stage: 'diagnose' })
    fetchClients()
  }

  // All agents
  const [allAgents, setAllAgents] = useState<AgentRow[]>([])
  const [agentsLoading, setAgentsLoading] = useState(true)
  useEffect(() => {
    fetch('/api/os/agents').then(r => r.json()).then((d: AgentRow[]) => setAllAgents(d)).catch(() => {}).finally(() => setAgentsLoading(false))
  }, [])

  // Persistent editable state — debounce saves via timer refs
  const pipelineTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const financeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const investorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [pipeline, setPipeline] = useState({ active_leads: '0', in_diagnostic: '0', proposal_sent: '0', closed_won: '0', pipeline_value: '$0', notes: '' })
  const [finance, setFinance] = useState({ mrr: '$0', arr: '$0', bank_balance: '$0', outstanding_invoices: '$0' })
  const [investor, setInvestor] = useState({ target_raise: '$1,000,000', commitments: '$0', key_meetings: '' })

  useEffect(() => {
    fetch('/api/os/state').then(r => r.json()).then((d: Record<string, unknown>) => {
      if (d.os_pipeline) setPipeline(p => ({ ...p, ...(d.os_pipeline as typeof p) }))
      if (d.os_finance) setFinance(f => ({ ...f, ...(d.os_finance as typeof f) }))
      if (d.os_investor) setInvestor(i => ({ ...i, ...(d.os_investor as typeof i) }))
    }).catch(() => {})
  }, [])

  const updatePipeline = useCallback((key: string, value: string) => {
    setPipeline(prev => {
      const next = { ...prev, [key]: value }
      if (pipelineTimer.current) clearTimeout(pipelineTimer.current)
      pipelineTimer.current = setTimeout(() => saveState('os_pipeline', next), 800)
      return next
    })
  }, [])

  const updateFinance = useCallback((key: string, value: string) => {
    setFinance(prev => {
      const next = { ...prev, [key]: value }
      if (financeTimer.current) clearTimeout(financeTimer.current)
      financeTimer.current = setTimeout(() => saveState('os_finance', next), 800)
      return next
    })
  }, [])

  const updateInvestor = useCallback((key: string, value: string) => {
    setInvestor(prev => {
      const next = { ...prev, [key]: value }
      if (investorTimer.current) clearTimeout(investorTimer.current)
      investorTimer.current = setTimeout(() => saveState('os_investor', next), 800)
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

      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GhostLogo size={24} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.02em', color: 'var(--paper)' }}>Agents Desk</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.35, paddingLeft: '4px' }}>by eevolvv</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="os-topbar-clock" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', opacity: 0.6 }}>{clock}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '3px 8px' }}>INTERNAL</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(250,247,240,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}>sign out</button>
        </div>
      </div>

      <div className="os-content-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* § 01 · DIAGNOSTIC FEED */}
        <section id="diagnostic-feed" className="os-section">
          <SectionMarker n="01" label="DIAGNOSTIC FEED" />
          <div className="os-grid-4" style={{ marginBottom: '32px' }}>
            <Stat label="Total" value={total} />
            <Stat label="Completed" value={completed} />
            <Stat label="Emails sent" value={emailsSent} />
            <Stat label="Error rate" value={errorRate} />
          </div>
          <div className="os-table-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name','Business','Tier','Status','When','✉'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <Fragment key={s.id}>
                    <tr onClick={() => setExpanded(expanded === s.id ? null : s.id)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{s.business_name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', textTransform: 'uppercase' }}>{s.tier ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.status === 'completed' ? '#4ade80' : s.status === 'error' ? 'var(--accent)' : '#f59e0b' }} />
                          {s.status ?? '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.6 }}>{relativeTime(s.created_at)}</td>
                      <td style={{ padding: '12px 16px', fontSize: '16px' }}>{s.email_sent ? '✓' : '—'}</td>
                    </tr>
                    {expanded === s.id && s.report && (
                      <tr><td colSpan={6} style={{ padding: '0 16px 16px' }}>
                        <div style={{ background: 'rgba(20,20,19,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{s.report}</div>
                      </td></tr>
                    )}
                  </Fragment>
                ))}
                {submissions.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', opacity: 0.4, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>No submissions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* § 02 · FUNNEL METRICS */}
        <section id="funnel-metrics" className="os-section">
          <SectionMarker n="02" label="FUNNEL METRICS" />
          {metricsLoading ? (
            <div className="os-grid-4">{[0,1,2,3].map(i => <Skeleton key={i} height={100} />)}</div>
          ) : metricsError || !metrics ? (
            <div style={{ ...CARD, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', opacity: 0.6 }}>
              Metrics unavailable — <a href="https://us.posthog.com/project/407291/dashboard/1537727" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>view PostHog →</a>
            </div>
          ) : (
            <>
              <div className="os-grid-4" style={{ marginBottom: '16px' }}>
                {FUNNEL_EVENTS.map(evt => {
                  const d = metrics.events?.[evt]
                  return (
                    <div key={evt} className="os-card" style={CARD}>
                      <div style={{ ...MONO_LABEL, fontSize: '10px' }}>{evt.replace('diagnostic_', '')}</div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '2rem', lineHeight: 1 }}>{d?.['7d'] ?? '—'}</div>
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
              <div className="os-card" style={{ ...CARD, padding: '16px 24px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                {CONVERSION_PAIRS.map(({ from, to }) => {
                  const fc = metrics.events?.[from]?.['7d'], tc = metrics.events?.[to]?.['7d']
                  const pct = fc && tc && fc > 0 ? Math.round((tc / fc) * 100) : null
                  return <span key={`${from}-${to}`}><span style={{ opacity: 0.4 }}>{from.replace('diagnostic_','')} → {to.replace('diagnostic_','')}</span><span style={{ color: 'var(--accent)', marginLeft: '8px' }}>{pct !== null ? `${pct}%` : '—'}</span></span>
                })}
                <a href="https://us.posthog.com/project/407291/dashboard/1537727" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', marginLeft: 'auto' }}>PostHog →</a>
              </div>
            </>
          )}
        </section>

        {/* § 03 · ACTIVE CLIENTS */}
        <section id="active-clients" className="os-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <SectionMarker n="03" label="ACTIVE CLIENTS" noMargin />
            <button onClick={() => setNewClientOpen(v => !v)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px' }}>+ new client</button>
          </div>

          <div className={`os-slide-form ${newClientOpen ? 'open' : 'closed'}`}>
            <div style={{ ...CARD, marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {([
                { k: 'name', l: 'Contact name', p: 'Jane Smith' },
                { k: 'company', l: 'Company', p: 'Acme Corp' },
                { k: 'email', l: 'Email', p: 'jane@acme.com' },
                { k: 'business_type', l: 'Business type', p: 'SaaS / Retail / ...' },
                { k: 'contract_value', l: 'Contract value ($)', p: '50000' },
              ] as const).map(({ k, l, p }) => (
                <div key={k}>
                  <div style={MONO_LABEL}>{l}</div>
                  <input value={newClientForm[k]} onChange={e => setNewClientForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={INPUT_STYLE} />
                </div>
              ))}
              <div>
                <div style={MONO_LABEL}>Stage</div>
                <select value={newClientForm.stage} onChange={e => setNewClientForm(f => ({ ...f, stage: e.target.value }))} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button onClick={() => setNewClientOpen(false)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                <button onClick={submitNewClient} disabled={clientSubmitting} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '6px 16px', cursor: 'pointer', borderRadius: '2px', opacity: clientSubmitting ? 0.6 : 1 }}>{clientSubmitting ? 'saving…' : 'create client'}</button>
              </div>
            </div>
          </div>

          {clientsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{[0,1,2].map(i => <Skeleton key={i} height={48} />)}</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3, marginBottom: '12px' }}>No active clients — add your first engagement</div>
              <button onClick={() => setNewClientOpen(true)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>+ new client</button>
            </div>
          ) : (
            <div className="os-table-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Company','Contact','Stage','Agents','Health','Contract','Updated',''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onClick={() => router.push(`/os/clients/${c.id}`)}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{c.company}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', opacity: 0.7 }}>{c.name}</td>
                      <td style={{ padding: '12px 16px' }}><StagePipeline stage={c.stage} /></td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--accent)' }}>{c.agent_count}</td>
                      <td style={{ padding: '12px 16px' }}><HealthDot health={c.health} /></td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.7 }}>{c.contract_value ? `$${c.contract_value.toLocaleString()}` : '—'}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: 0.4 }}>{relativeTime(c.updated_at)}</td>
                      <td style={{ padding: '12px 16px' }}><Link href={`/os/clients/${c.id}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>→</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* § 04 · AGENT REGISTRY */}
        <section id="agent-registry" className="os-section">
          <SectionMarker n="04" label="AGENT REGISTRY" />
          {agentsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{[0,1,2].map(i => <Skeleton key={i} height={48} />)}</div>
          ) : allAgents.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3 }}>No agents deployed yet</div>
            </div>
          ) : (
            <div className="os-table-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Agent','Client','Type','Status','Integrations','Health','Last Run','Repo','Deploy'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allAgents.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: a.client_id ? 'pointer' : 'default' }}
                      onClick={() => a.client_id && router.push(`/os/clients/${a.client_id}/agents/${a.id}`)}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{a.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        {a.client_id ? <Link href={`/os/clients/${a.client_id}`} style={{ color: 'rgba(250,247,240,0.7)', textDecoration: 'none' }}>{a.client_company ?? '—'}</Link> : <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: 0.55 }}>{a.type ?? '—'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={a.status} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(a.integrations ?? []).length > 0 ? (a.integrations ?? []).map(i => (
                            <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', padding: '1px 5px', opacity: 0.7 }}>{i}</span>
                          )) : <span style={{ opacity: 0.3, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}><HealthDot health={a.health} /></td>
                      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: 0.4 }}>{a.last_run_at ? relativeTime(a.last_run_at) : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>{a.repo_url ? <a href={a.repo_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>→</a> : <span style={{ opacity: 0.3 }}>—</span>}</td>
                      <td style={{ padding: '12px 16px' }}>{a.deploy_url ? <a href={a.deploy_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>→</a> : <span style={{ opacity: 0.3 }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* § 05 · PIPELINE */}
        <section id="pipeline" className="os-section">
          <SectionMarker n="05" label="PIPELINE" />
          <div className="os-grid-5" style={{ marginBottom: '16px' }}>
            {([
              { key: 'active_leads', label: 'Active leads' },
              { key: 'in_diagnostic', label: 'In diagnostic' },
              { key: 'proposal_sent', label: 'Proposal sent' },
              { key: 'closed_won', label: 'Closed-won' },
              { key: 'pipeline_value', label: 'Pipeline value' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="os-card" style={CARD}><EditableField label={label} value={pipeline[key]} onChange={v => updatePipeline(key, v)} /></div>
            ))}
          </div>
          <div className="os-card" style={CARD}>
            <div style={MONO_LABEL}>Notes</div>
            <textarea value={pipeline.notes} onChange={e => updatePipeline('notes', e.target.value)} placeholder="Free notes…"
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', outline: 'none', resize: 'vertical', minHeight: '80px', paddingBottom: '4px' }} />
            <div style={{ marginTop: '16px' }}><a href="https://app.hubspot.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ HubSpot</a></div>
          </div>
        </section>

        {/* § 06 · FINANCE */}
        <section id="finance" className="os-section">
          <SectionMarker n="06" label="FINANCE" />
          <div className="os-grid-4" style={{ marginBottom: '16px' }}>
            {([
              { key: 'mrr', label: 'MRR' }, { key: 'arr', label: 'ARR' },
              { key: 'bank_balance', label: 'Bank balance' }, { key: 'outstanding_invoices', label: 'Outstanding invoices' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="os-card" style={CARD}><EditableField label={label} value={finance[key]} onChange={v => updateFinance(key, v)} /></div>
            ))}
          </div>
          <div className="os-card" style={{ ...CARD, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.5 }}>$1M pre-seed raise · Q2 2026</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[{ l: 'Mercury', u: 'https://mercury.com' }, { l: 'Stripe', u: 'https://dashboard.stripe.com' }, { l: 'Wave', u: 'https://www.waveapps.com/accounting' }].map(({ l, u }) => (
                <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ {l}</a>
              ))}
            </div>
          </div>
        </section>

        {/* § 07 · ENGINEERING */}
        <section id="engineering" className="os-section">
          <SectionMarker n="07" label="ENGINEERING" />
          <div className="os-grid-2">
            <div className="os-card" style={CARD}>
              <div style={MONO_LABEL}>Recent commits</div>
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
              ) : <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', opacity: 0.4 }}>Unable to fetch commits</div>}
            </div>
            <div className="os-card" style={CARD}>
              <div style={MONO_LABEL}>Deep links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{ l: 'GitHub', u: 'https://github.com/ebarbosa-asg/eevolvv' }, { l: 'Linear', u: 'https://linear.app' }, { l: 'Vercel', u: 'https://vercel.com/dashboard' }].map(({ l, u }) => (
                  <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--accent)' }}>→ {l}</a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* § 08 · INVESTOR */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {[{ l: 'Pitch Deck', u: '/investor/pitch.html' }, { l: 'Strategy', u: '/investor/investor-strategy.md' }, { l: 'Calendly', u: 'https://calendly.com/hello-eevolvv' }].map(({ l, u }) => (
                <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--accent)' }}>→ {l}</a>
              ))}
            </div>
          </div>
        </section>

        {/* § 09 · QUICK LINKS */}
        <section id="quick-links" className="os-section">
          <SectionMarker n="09" label="QUICK LINKS" />
          <div className="os-grid-links">
            {QUICK_LINKS.map(({ name, tag, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="os-card"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--paper)', opacity: 0.5 }}>{tag}</div>
              </a>
            ))}
          </div>
        </section>

        {/* § 10 · INTERNAL DOCS */}
        <section id="internal-docs" className="os-section">
          <SectionMarker n="10" label="INTERNAL DOCS" />
          <div className="os-grid-docs">
            <a href="/service-agreement.docx" download className="os-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>Service Agreement</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', opacity: 0.8 }}>↓ download</div>
            </a>
            {[{ l: 'Pitch Deck', u: '/investor/pitch.html' }, { l: 'Privacy Policy', u: '/privacy' }, { l: 'Terms', u: '/terms' }].map(({ l, u }) => (
              <a key={l} href={u} target="_blank" rel="noopener noreferrer" className="os-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--paper)', marginBottom: '4px' }}>{l}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', opacity: 0.8 }}>→ open</div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

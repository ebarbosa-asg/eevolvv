'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type RunRecord = {
  id: string
  status: 'pending' | 'running' | 'success' | 'error'
  triggered_by: string
  input_tokens: number | null
  output_tokens: number | null
  latency_ms: number | null
  output_summary: string | null
  created_at: string
}

type AgentFull = {
  id: string
  client_id: string
  name: string
  description: string | null
  type: string | null
  status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null
  repo_url: string | null
  deploy_url: string | null
  last_run_at: string | null
  health: 'green' | 'yellow' | 'red'
  notes: string | null
  created_at: string
  updated_at: string
  trigger_type: 'manual' | 'schedule' | 'webhook' | null
  trigger_config: Record<string, unknown> | null
  instructions: string | null
  estimated_output: string | null
  config: Record<string, unknown> | null
  version: number | null
  run_count: number
  error_count: number
}

type ClientBrief = {
  id: string
  name: string
  company: string
}

const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '2px' } as const
const MONO = { fontFamily: 'JetBrains Mono, monospace' } as const
const MONO_LABEL = { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', opacity: 0.4, marginBottom: '6px' }
const INPUT = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' } as const

const AGENT_TYPES = ['qa-automation', 'finance-audit', 'data-sync', 'reporting', 'notification', 'custom']
const INTEGRATIONS = ['HubSpot', 'Slack', 'GitHub', 'Supabase', 'Notion', 'Linear', 'Resend', 'Stripe', 'Airtable', 'Google Sheets', 'Zapier', 'Twilio', 'Salesforce', 'Shopify', 'Custom Webhook']
const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const STEPS = [
  { n: '01', label: 'IDENTITY' },
  { n: '02', label: 'INSTRUCTIONS' },
  { n: '03', label: 'INTEGRATIONS' },
  { n: '04', label: 'TRIGGER' },
  { n: '05', label: 'REVIEW' },
  { n: '06', label: 'DEPLOY' },
]

export default function AgentBuilder({ agent, client }: { agent: AgentFull; client: ClientBrief }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 — IDENTITY
  const [name, setName] = useState(agent.name ?? '')
  const [type, setType] = useState(agent.type ?? 'custom')
  const [description, setDescription] = useState(agent.description ?? '')

  // Step 2 — INSTRUCTIONS
  const [instructions, setInstructions] = useState(agent.instructions ?? '')
  const [showInstructionsHelper, setShowInstructionsHelper] = useState(false)

  // Step 3 — INTEGRATIONS
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(agent.integrations ?? [])

  // Step 4 — TRIGGER
  const [triggerType, setTriggerType] = useState<'manual' | 'schedule' | 'webhook'>(
    (agent.trigger_type as 'manual' | 'schedule' | 'webhook') ?? 'manual'
  )
  const [scheduleFreq, setScheduleFreq] = useState<'15min' | 'hourly' | 'daily' | 'weekly' | 'custom'>('daily')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleTz, setScheduleTz] = useState('UTC')
  const [scheduleDays, setScheduleDays] = useState<string[]>(['Mon'])
  const [customCron, setCustomCron] = useState('')
  const [webhookMethod, setWebhookMethod] = useState<'POST' | 'GET' | 'PUT'>('POST')
  const [webhookAuth, setWebhookAuth] = useState<'none' | 'bearer' | 'hmac'>('none')
  const [webhookToken] = useState<string>(() => crypto.randomUUID())
  const [showToken, setShowToken] = useState(false)
  const [webhookSecret] = useState<string>(() => crypto.randomUUID())
  const [showSecret, setShowSecret] = useState(false)

  // Step 6 — DEPLOY
  const [agentStatus, setAgentStatus] = useState(agent.status)

  // Step 6 — RUN PANEL
  const [runOutput, setRunOutput] = useState<string | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [runLoading, setRunLoading] = useState(false)
  const [runs, setRuns] = useState<RunRecord[] | null>(null)
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null)

  function isStepComplete(s: number): boolean {
    if (s === 1) return name.trim().length > 0
    if (s === 2) return instructions.trim().length > 0
    if (s === 3) return true
    if (s === 4) return true
    if (s === 5) return true
    return false
  }

  const saveStep = async () => {
    setSaving(true)
    let body: Record<string, unknown> = {}
    if (step === 1) body = { name, type, description }
    if (step === 2) body = { instructions }
    if (step === 3) body = { integrations: selectedIntegrations }
    if (step === 4) body = {
      trigger_type: triggerType,
      trigger_config: triggerType === 'schedule'
        ? { freq: scheduleFreq, time: scheduleTime, tz: scheduleTz, days: scheduleDays, cron: customCron }
        : triggerType === 'webhook'
        ? { method: webhookMethod, auth: webhookAuth, token: webhookToken, secret: webhookSecret }
        : {},
    }
    if (step === 5) { setSaving(false); setStep(6); return }

    const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) setStep(s => Math.min(s + 1, 6))
  }

  function computeNextRuns(): string[] {
    const now = new Date()
    const runs: string[] = []
    const base = new Date(now)

    if (scheduleFreq === '15min') {
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base.getTime() + i * 15 * 60 * 1000)
        runs.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'hourly') {
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base.getTime() + i * 60 * 60 * 1000)
        runs.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'daily') {
      const [hh, mm] = scheduleTime.split(':').map(Number)
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base)
        d.setUTCDate(d.getUTCDate() + i)
        d.setUTCHours(hh, mm, 0, 0)
        runs.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'weekly') {
      const [hh, mm] = scheduleTime.split(':').map(Number)
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base)
        d.setUTCDate(d.getUTCDate() + i * 7)
        d.setUTCHours(hh, mm, 0, 0)
        runs.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else {
      runs.push('Custom cron — preview not available', '', '')
    }
    return runs.filter(Boolean).slice(0, 3)
  }

  function triggerSentence(): string {
    if (triggerType === 'manual') return 'run on demand'
    if (triggerType === 'webhook') return `triggered by ${webhookMethod} webhook`
    if (scheduleFreq === 'daily') return `run daily at ${scheduleTime} ${scheduleTz}`
    if (scheduleFreq === 'weekly') return `run weekly on ${scheduleDays.join(', ')} at ${scheduleTime} ${scheduleTz}`
    if (scheduleFreq === 'hourly') return 'run every hour'
    if (scheduleFreq === '15min') return 'run every 15 minutes'
    return `run on custom cron: ${customCron}`
  }

  function renderReviewSection(label: string, targetStep: number, rows: [string, string][]) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', flex: 1 }}>
          <div style={{ ...MONO_LABEL, marginBottom: '12px' }}>{label}</div>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
              <span style={{ ...MONO, fontSize: '11px', opacity: 0.4, width: '120px', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(targetStep)} style={{ ...MONO, fontSize: '10px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, marginLeft: '16px' }}>← edit</button>
      </div>
    )
  }

  async function runAgent() {
    setRunLoading(true)
    setRunError(null)
    setRunOutput(null)
    try {
      const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggeredBy: 'manual' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Run failed')
      setRunOutput(data.output)
      loadRuns()
    } catch (e: unknown) {
      setRunError(e instanceof Error ? e.message : 'Run failed')
    } finally {
      setRunLoading(false)
    }
  }

  async function loadRuns() {
    const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}/runs`)
    if (res.ok) setRuns(await res.json())
  }

  function formatRelativeTime(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step === 6) loadRuns()
  }, [step])

  return (
    <div style={{ background: 'var(--ink)', color: 'var(--paper)', minHeight: '100vh', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', height: '52px', gap: '8px' }}>
        <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>eevolvv</Link>
        <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
        <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>os</Link>
        <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
        <Link href={`/os/clients/${client.id}`} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{client.company}</Link>
        <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
        <span style={{ ...MONO, fontSize: '11px', color: 'var(--paper)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name || agent.name}</span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
        {/* Left rail — step navigator */}
        <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 0', background: 'rgba(255,255,255,0.01)' }}>
          {STEPS.map((s, i) => {
            const n = i + 1
            const isActive = step === n
            const isComplete = isStepComplete(n)
            return (
              <button
                key={n}
                onClick={() => setStep(n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.1s',
                }}
              >
                <span style={{ ...MONO, fontSize: '11px', color: isActive ? 'var(--paper)' : 'rgba(250,247,240,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'left' }}>
                  § {s.n} · {s.label}
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isComplete ? 'var(--accent)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              </button>
            )
          })}
        </div>

        {/* Right content — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 40px' }}>
          {/* Step header */}
          <div style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '24px' }}>
            § 0{step} · {STEPS[step - 1].label}
          </div>

          {/* Step 1 — IDENTITY */}
          {step === 1 && (
            <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={MONO_LABEL}>Name</div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. QA Automation Bot" style={INPUT} />
              </div>
              <div>
                <div style={MONO_LABEL}>Type</div>
                <select value={type} onChange={e => setType(e.target.value)} style={{ ...INPUT, cursor: 'pointer' }}>
                  {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={MONO_LABEL}>Description</div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  rows={3}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
            </div>
          )}

          {/* Step 2 — INSTRUCTIONS */}
          {step === 2 && (
            <div style={{ maxWidth: '720px' }}>
              <div style={MONO_LABEL}>System Prompt</div>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                style={{
                  background: 'rgba(8,8,8,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '3px solid var(--accent)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '13px',
                  lineHeight: 1.9,
                  padding: '16px',
                  minHeight: '240px',
                  width: '100%',
                  color: 'var(--paper)',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                placeholder="You are an AI agent that..."
              />
              <div style={{ ...MONO, fontSize: '11px', opacity: 0.35, marginTop: '6px' }}>
                {instructions.length} chars
              </div>
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => setShowInstructionsHelper(v => !v)}
                  style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {showInstructionsHelper ? '▲ hide tips' : '▼ show writing tips'}
                </button>
                {showInstructionsHelper && (
                  <div style={{ ...CARD, marginTop: '10px', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ ...MONO, fontSize: '12px', lineHeight: 1.8, opacity: 0.7 }}>
                      Be specific about:<br />
                      → Success criteria — what does done look like?<br />
                      → Tone / persona — formal, friendly, terse?<br />
                      → Constraints — what must it never do?<br />
                      → Output format — JSON, markdown, plain text?
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — INTEGRATIONS */}
          {step === 3 && (
            <div style={{ maxWidth: '680px' }}>
              <div style={{ ...MONO, fontSize: '12px', opacity: 0.5, marginBottom: '20px' }}>
                Select all integrations this agent will use. Authentication is configured separately.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INTEGRATIONS.map(integration => {
                  const selected = selectedIntegrations.includes(integration)
                  return (
                    <button
                      key={integration}
                      onClick={() => setSelectedIntegrations(prev =>
                        selected ? prev.filter(i => i !== integration) : [...prev, integration]
                      )}
                      style={{
                        padding: '6px 12px',
                        border: selected ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.15)',
                        background: selected ? 'rgba(140,43,26,0.15)' : 'rgba(255,255,255,0.04)',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: selected ? 'var(--paper)' : 'rgba(250,247,240,0.6)',
                        transition: 'all 0.1s',
                      }}
                    >
                      {integration}
                    </button>
                  )
                })}
              </div>
              {selectedIntegrations.length > 0 && (
                <div style={{ ...MONO, fontSize: '11px', opacity: 0.4, marginTop: '16px' }}>
                  {selectedIntegrations.length} selected: {selectedIntegrations.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Step 4 — TRIGGER */}
          {step === 4 && (
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[
                  { value: 'manual' as const, icon: '▶', label: 'Manual', desc: 'Run on demand' },
                  { value: 'schedule' as const, icon: '⏰', label: 'Schedule', desc: 'Cron-based' },
                  { value: 'webhook' as const, icon: '⚡', label: 'Webhook', desc: 'HTTP endpoint' },
                ].map(card => {
                  const active = triggerType === card.value
                  return (
                    <button
                      key={card.value}
                      onClick={() => setTriggerType(card.value)}
                      style={{
                        flex: 1,
                        height: '80px',
                        background: active ? 'rgba(140,43,26,0.1)' : 'rgba(255,255,255,0.03)',
                        border: active ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.1s',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{card.icon}</span>
                      <span style={{ ...MONO, fontSize: '11px', color: active ? 'var(--paper)' : 'rgba(250,247,240,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</span>
                      <span style={{ ...MONO, fontSize: '10px', opacity: 0.4 }}>{card.desc}</span>
                    </button>
                  )
                })}
              </div>

              {triggerType === 'schedule' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={MONO_LABEL}>Frequency</div>
                    <select value={scheduleFreq} onChange={e => setScheduleFreq(e.target.value as typeof scheduleFreq)} style={{ ...INPUT, cursor: 'pointer' }}>
                      <option value="15min">Every 15 min</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom cron</option>
                    </select>
                  </div>

                  {(scheduleFreq === 'daily' || scheduleFreq === 'weekly') && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={MONO_LABEL}>Time (HH:MM)</div>
                        <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={INPUT} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={MONO_LABEL}>Timezone</div>
                        <select value={scheduleTz} onChange={e => setScheduleTz(e.target.value)} style={{ ...INPUT, cursor: 'pointer' }}>
                          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {scheduleFreq === 'weekly' && (
                    <div>
                      <div style={MONO_LABEL}>Days</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {WEEKDAYS.map(day => {
                          const checked = scheduleDays.includes(day)
                          return (
                            <button
                              key={day}
                              onClick={() => setScheduleDays(prev => checked ? prev.filter(d => d !== day) : [...prev, day])}
                              style={{
                                padding: '4px 10px',
                                border: checked ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.15)',
                                background: checked ? 'rgba(140,43,26,0.15)' : 'transparent',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                ...MONO,
                                fontSize: '11px',
                                color: checked ? 'var(--paper)' : 'rgba(250,247,240,0.5)',
                              }}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {scheduleFreq === 'custom' && (
                    <div>
                      <div style={MONO_LABEL}>Cron expression</div>
                      <input value={customCron} onChange={e => setCustomCron(e.target.value)} placeholder="0 9 * * 1" style={INPUT} />
                    </div>
                  )}

                  {scheduleFreq !== 'custom' && (
                    <div style={{ background: 'rgba(8,8,8,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '12px 16px' }}>
                      <div style={{ ...MONO_LABEL, marginBottom: '8px' }}>Next 3 runs</div>
                      {computeNextRuns().map((run, i) => (
                        <div key={i} style={{ ...MONO, fontSize: '12px', opacity: 0.7, lineHeight: 1.8 }}>→ {run}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {triggerType === 'webhook' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={MONO_LABEL}>Webhook URL</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        readOnly
                        value={`https://os.eevolvv.ai/hooks/${agent.id}`}
                        style={{ ...INPUT, opacity: 0.7, cursor: 'default' }}
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://os.eevolvv.ai/hooks/${agent.id}`)}
                        style={{ ...MONO, fontSize: '11px', color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px', whiteSpace: 'nowrap' }}
                      >
                        copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Method</div>
                    <select value={webhookMethod} onChange={e => setWebhookMethod(e.target.value as 'POST' | 'GET' | 'PUT')} style={{ ...INPUT, cursor: 'pointer' }}>
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Auth type</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {(['none', 'bearer', 'hmac'] as const).map(authType => (
                        <label key={authType} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...MONO, fontSize: '12px' }}>
                          <input type="radio" name="webhookAuth" value={authType} checked={webhookAuth === authType} onChange={() => setWebhookAuth(authType)} />
                          {authType === 'none' ? 'None' : authType === 'bearer' ? 'Bearer token' : 'HMAC signature'}
                        </label>
                      ))}
                    </div>
                  </div>
                  {webhookAuth === 'bearer' && (
                    <div>
                      <div style={MONO_LABEL}>Bearer token</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          readOnly
                          value={showToken ? webhookToken : '••••••••••••••••••••••••'}
                          style={{ ...INPUT, opacity: 0.8, cursor: 'default', letterSpacing: showToken ? 'normal' : '0.15em' }}
                        />
                        <button
                          onClick={() => setShowToken(v => !v)}
                          style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.5)', background: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px', whiteSpace: 'nowrap' }}
                        >
                          {showToken ? 'hide' : 'reveal'}
                        </button>
                      </div>
                    </div>
                  )}
                  {webhookAuth === 'hmac' && (
                    <div>
                      <div style={MONO_LABEL}>Signing secret</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          readOnly
                          value={showSecret ? webhookSecret : '••••••••••••••••••••••••'}
                          style={{ ...INPUT, opacity: 0.8, cursor: 'default', letterSpacing: showSecret ? 'normal' : '0.15em' }}
                        />
                        <button
                          onClick={() => setShowSecret(v => !v)}
                          style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.5)', background: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px', whiteSpace: 'nowrap' }}
                        >
                          {showSecret ? 'hide' : 'reveal'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — REVIEW */}
          {step === 5 && (
            <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(8,8,8,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '14px 16px', ...MONO, fontSize: '13px', lineHeight: 1.8, color: 'var(--paper)' }}>
                → This agent will {triggerSentence()} using {selectedIntegrations.length > 0 ? selectedIntegrations.join(', ') : 'no external integrations'} to {description || 'complete tasks'}.
              </div>

              {renderReviewSection('IDENTITY', 1, [
                ['Name', name],
                ['Type', type],
                ['Description', description || '—'],
              ])}

              {renderReviewSection('INSTRUCTIONS', 2, [
                ['System prompt', (instructions.slice(0, 120) + (instructions.length > 120 ? '…' : '')) || '—'],
              ])}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', flex: 1 }}>
                  <div style={{ ...MONO_LABEL, marginBottom: '12px' }}>INTEGRATIONS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedIntegrations.length === 0
                      ? <span style={{ ...MONO, fontSize: '12px', opacity: 0.4 }}>None selected</span>
                      : selectedIntegrations.map(i => (
                        <span key={i} style={{ padding: '4px 10px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.7)' }}>{i}</span>
                      ))
                    }
                  </div>
                </div>
                <button onClick={() => setStep(3)} style={{ ...MONO, fontSize: '10px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, marginLeft: '16px' }}>← edit</button>
              </div>

              {renderReviewSection('TRIGGER', 4, [
                ['Type', triggerType],
                ['Config', triggerSentence()],
              ])}
            </div>
          )}

          {/* Step 6 — DEPLOY */}
          {step === 6 && (
            <div style={{ maxWidth: '760px' }}>
              {/* Run Now */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ ...MONO_LABEL, marginBottom: 12 }}>§ RUN AGENT</div>
                <button
                  onClick={runAgent}
                  disabled={runLoading}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    padding: '10px 20px',
                    background: runLoading ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: runLoading ? 'not-allowed' : 'pointer',
                    opacity: runLoading ? 0.7 : 1,
                    marginBottom: 16,
                  }}
                >
                  {runLoading ? 'Running...' : '▷ Run agent now'}
                </button>
                {runError && (
                  <div style={{ color: '#ef4444', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginBottom: 12 }}>
                    ✗ {runError}
                  </div>
                )}
                {runOutput && (
                  <pre style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: '3px solid var(--accent)',
                    borderRadius: 6,
                    padding: 16,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12,
                    lineHeight: 1.7,
                    overflowX: 'auto',
                    maxHeight: 400,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {runOutput}
                  </pre>
                )}
              </div>

              {/* Run History */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ ...MONO_LABEL, marginBottom: 12 }}>§ RUN HISTORY</div>
                {runs === null ? (
                  <div style={{ ...MONO, fontSize: 11, opacity: 0.5 }}>Loading...</div>
                ) : runs.length === 0 ? (
                  <div style={{ ...MONO, fontSize: 11, opacity: 0.5 }}>No runs yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {runs.map(run => (
                      <div key={run.id} style={{ ...CARD, padding: '12px 16px', cursor: 'pointer' }}
                        onClick={() => setExpandedRunId(expandedRunId === run.id ? null : run.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            color: run.status === 'success' ? '#4ade80' : run.status === 'error' ? '#ef4444' : '#f59e0b',
                          }}>
                            ● {run.status}
                          </span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.5 }}>
                            {run.triggered_by}
                          </span>
                          {run.latency_ms != null && (
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.6 }}>
                              {(run.latency_ms / 1000).toFixed(1)}s
                            </span>
                          )}
                          {run.input_tokens != null && (
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.6 }}>
                              {run.input_tokens} / {run.output_tokens} tok
                            </span>
                          )}
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.4, marginLeft: 'auto' }}>
                            {formatRelativeTime(run.created_at)}
                          </span>
                        </div>
                        {run.output_summary && (
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                            {expandedRunId === run.id ? run.output_summary : run.output_summary.slice(0, 80) + (run.output_summary.length > 80 ? '...' : '')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { key: 'dev', label: 'DEV', borderColor: '#6366f1', nextStatus: 'staging' as const, promoteLabel: '→ Stage', showTest: true },
                  { key: 'staging', label: 'STAGING', borderColor: '#f59e0b', nextStatus: 'live' as const, promoteLabel: '→ Live', showTest: false },
                  { key: 'live', label: 'LIVE', borderColor: '#4ade80', nextStatus: null, promoteLabel: null, showTest: false },
                ].map(stage => {
                  const isActive = agentStatus === stage.key
                  return (
                    <div
                      key={stage.key}
                      style={{
                        flex: 1,
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? stage.borderColor : 'rgba(255,255,255,0.07)'}`,
                        borderLeft: `3px solid ${stage.borderColor}`,
                        borderRadius: '2px',
                        padding: '20px',
                        opacity: isActive ? 1 : 0.5,
                      }}
                    >
                      <div style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: stage.borderColor, marginBottom: '8px' }}>
                        {stage.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? stage.borderColor : 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                        <span style={{ ...MONO, fontSize: '11px', opacity: 0.5 }}>{isActive ? 'active' : 'not deployed'}</span>
                      </div>
                      {agent.version && (
                        <div style={{ ...MONO, fontSize: '11px', opacity: 0.4, marginBottom: '12px' }}>v{agent.version}</div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {stage.showTest && isActive && (
                          <button
                            onClick={() => alert('Test run triggered (API not yet wired)')}
                            style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.5)', background: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px' }}
                          >
                            Test run
                          </button>
                        )}
                        {stage.promoteLabel && isActive && (
                          <button
                            onClick={async () => {
                              const nextStatus = stage.nextStatus!
                              if (nextStatus === 'live' && !window.confirm(`Promote to LIVE? This replaces the current live version.`)) return
                              const res = await fetch(`/api/os/clients/${client.id}/agents/${agent.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: nextStatus }),
                              })
                              if (res.ok) setAgentStatus(nextStatus)
                            }}
                            style={{ ...MONO, fontSize: '11px', color: stage.borderColor, background: 'none', border: `1px solid ${stage.borderColor}`, padding: '4px 10px', cursor: 'pointer', borderRadius: '2px' }}
                          >
                            {stage.promoteLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                onClick={saveStep}
                disabled={saving}
                style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '2px', opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'saving…' : 'Save & Continue →'}
              </button>
            ) : (
              <Link
                href={`/os/clients/${client.id}`}
                style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', padding: '8px 20px', borderRadius: '2px', textDecoration: 'none' }}
              >
                Done — back to workspace
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button, Input, Textarea, Label, SectionMarker, StatusPill, TerminalBlock } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSBreadcrumb } from '@/app/os/components/OSBreadcrumb'

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

// Dark-context overrides (content area is on --ink background)
const DARK_INPUT = 'bg-white/6 text-paper border-white/10 placeholder:text-paper/30 focus:border-accent'
const DARK_TEXTAREA = 'bg-white/[0.03] text-paper border-white/10 placeholder:text-paper/30 focus:border-accent resize-y'
const DARK_SELECT = 'w-full border border-white/10 rounded px-3 py-2 text-sm bg-white/6 text-paper cursor-pointer focus:outline-none focus:border-accent'

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

function runStatusColor(status: string): string {
  if (status === 'success') return '#4ade80'
  if (status === 'error') return '#ef4444'
  return '#f59e0b'
}

function runStatusToVariant(status: string): BadgeVariant {
  if (status === 'success') return 'success'
  if (status === 'error') return 'danger'
  if (status === 'running') return 'warning'
  return 'neutral'
}

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
    const result: string[] = []
    const base = new Date(now)

    if (scheduleFreq === '15min') {
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base.getTime() + i * 15 * 60 * 1000)
        result.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'hourly') {
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base.getTime() + i * 60 * 60 * 1000)
        result.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'daily') {
      const [hh, mm] = scheduleTime.split(':').map(Number)
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base)
        d.setUTCDate(d.getUTCDate() + i)
        d.setUTCHours(hh, mm, 0, 0)
        result.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else if (scheduleFreq === 'weekly') {
      const [hh, mm] = scheduleTime.split(':').map(Number)
      for (let i = 1; i <= 3; i++) {
        const d = new Date(base)
        d.setUTCDate(d.getUTCDate() + i * 7)
        d.setUTCHours(hh, mm, 0, 0)
        result.push(d.toUTCString().replace(' GMT', ' UTC'))
      }
    } else {
      result.push('Custom cron — preview not available', '', '')
    }
    return result.filter(Boolean).slice(0, 3)
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
      <div className="flex items-start justify-between">
        <div className="border-l-[3px] border-accent pl-3 flex-1">
          <p className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 mb-3">{label}</p>
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-4 mb-1.5">
              <span className="mono text-[11px] text-paper/40 w-[120px] flex-shrink-0">{k}</span>
              <span className="text-[13px] text-paper/85">{v}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep(targetStep)}
          className="mono text-[10px] text-accent bg-transparent border-none cursor-pointer opacity-60 hover:opacity-100 ml-4"
        >
          ← edit
        </button>
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

      {/* Topbar breadcrumb */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <OSBreadcrumb
          crumbs={[
            { label: 'os', href: '/os' },
            { label: 'clients', href: '/os/clients' },
            { label: client.company, href: `/os/clients/${client.id}` },
            { label: name || agent.name },
          ]}
        />
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 48px)', overflow: 'hidden' }}>

        {/* Left rail — light wizard navigator */}
        <div className="flex-shrink-0 w-[200px] bg-paper border-r border-rule py-8">
          {STEPS.map((s, i) => {
            const n = i + 1
            const isActive = step === n
            const isComplete = isStepComplete(n)
            return (
              <button
                key={n}
                type="button"
                onClick={() => setStep(n)}
                className="flex items-center gap-2.5 w-full px-5 py-2.5 bg-transparent border-none cursor-pointer transition-all"
                style={{
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                }}
              >
                <span
                  className="mono text-[11px] uppercase tracking-[0.1em] flex-1 text-left"
                  style={{ color: isActive ? 'var(--ink)' : 'rgba(20,20,19,0.45)' }}
                >
                  § {s.n} · {s.label}
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: isComplete ? 'var(--accent)' : 'rgba(20,20,19,0.15)' }}
                />
              </button>
            )
          })}
        </div>

        {/* Right content — scrollable, dark background */}
        <div className="flex-1 overflow-y-auto p-10">

          {/* Step header */}
          <div className="mb-6">
            <SectionMarker num={`0${step}`} label={STEPS[step - 1].label} />
          </div>

          {/* Step 1 — IDENTITY */}
          {step === 1 && (
            <div className="max-w-[560px] flex flex-col gap-4">
              <div>
                <Label className="text-paper/40">Name</Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. QA Automation Bot"
                  className={DARK_INPUT}
                />
              </div>
              <div>
                <Label className="text-paper/40">Type</Label>
                <select value={type} onChange={e => setType(e.target.value)} className={DARK_SELECT}>
                  {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-paper/40">Description</Label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  className={`${DARK_TEXTAREA} min-h-[80px]`}
                />
              </div>
            </div>
          )}

          {/* Step 2 — INSTRUCTIONS */}
          {step === 2 && (
            <div className="max-w-[720px]">
              <Label className="text-paper/40">System Prompt</Label>
              <Textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="You are an AI agent that..."
                className="w-full bg-[rgba(8,8,8,0.8)] border border-white/10 border-l-[3px] border-l-accent mono text-[13px] leading-[1.9] p-4 min-h-[240px] text-paper placeholder:text-paper/30 outline-none resize-y focus:outline-none"
              />
              <p className="mono text-[11px] text-paper/35 mt-1.5">{instructions.length} chars</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowInstructionsHelper(v => !v)}
                  className="mono text-[11px] text-paper/40 bg-transparent border-none cursor-pointer underline"
                >
                  {showInstructionsHelper ? '▲ hide tips' : '▼ show writing tips'}
                </button>
                {showInstructionsHelper && (
                  <div className="mt-2.5 p-5 bg-white/[0.04] border border-white/[0.07] border-l-[3px] border-l-accent rounded-sm">
                    <p className="mono text-[12px] leading-[1.8] text-paper/70">
                      Be specific about:<br />
                      → Success criteria — what does done look like?<br />
                      → Tone / persona — formal, friendly, terse?<br />
                      → Constraints — what must it never do?<br />
                      → Output format — JSON, markdown, plain text?
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — INTEGRATIONS */}
          {step === 3 && (
            <div className="max-w-[680px]">
              <p className="mono text-[12px] text-paper/50 mb-5">
                Select all integrations this agent will use. Authentication is configured separately.
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEGRATIONS.map(integration => {
                  const selected = selectedIntegrations.includes(integration)
                  return (
                    <button
                      key={integration}
                      type="button"
                      onClick={() => setSelectedIntegrations(prev =>
                        selected ? prev.filter(i => i !== integration) : [...prev, integration]
                      )}
                      className="px-3 py-1.5 rounded-full mono text-[11px] cursor-pointer transition-all"
                      style={{
                        border: selected ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.15)',
                        background: selected ? 'rgba(140,43,26,0.15)' : 'rgba(255,255,255,0.04)',
                        color: selected ? 'var(--paper)' : 'rgba(250,247,240,0.6)',
                      }}
                    >
                      {integration}
                    </button>
                  )
                })}
              </div>
              {selectedIntegrations.length > 0 && (
                <p className="mono text-[11px] text-paper/40 mt-4">
                  {selectedIntegrations.length} selected: {selectedIntegrations.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Step 4 — TRIGGER */}
          {step === 4 && (
            <div className="max-w-[680px]">
              <div className="flex gap-3 mb-6">
                {[
                  { value: 'manual' as const, icon: '▶', label: 'Manual', desc: 'Run on demand' },
                  { value: 'schedule' as const, icon: '⏰', label: 'Schedule', desc: 'Cron-based' },
                  { value: 'webhook' as const, icon: '⚡', label: 'Webhook', desc: 'HTTP endpoint' },
                ].map(card => {
                  const active = triggerType === card.value
                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => setTriggerType(card.value)}
                      className="flex-1 h-20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all rounded-sm"
                      style={{
                        background: active ? 'rgba(140,43,26,0.1)' : 'rgba(255,255,255,0.03)',
                        border: active ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <span className="text-[18px]">{card.icon}</span>
                      <span
                        className="mono text-[11px] uppercase tracking-[0.1em]"
                        style={{ color: active ? 'var(--paper)' : 'rgba(250,247,240,0.6)' }}
                      >
                        {card.label}
                      </span>
                      <span className="mono text-[10px] text-paper/40">{card.desc}</span>
                    </button>
                  )
                })}
              </div>

              {triggerType === 'schedule' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label className="text-paper/40">Frequency</Label>
                    <select value={scheduleFreq} onChange={e => setScheduleFreq(e.target.value as typeof scheduleFreq)} className={DARK_SELECT}>
                      <option value="15min">Every 15 min</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom cron</option>
                    </select>
                  </div>

                  {(scheduleFreq === 'daily' || scheduleFreq === 'weekly') && (
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label className="text-paper/40">Time (HH:MM)</Label>
                        <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className={DARK_INPUT} />
                      </div>
                      <div className="flex-1">
                        <Label className="text-paper/40">Timezone</Label>
                        <select value={scheduleTz} onChange={e => setScheduleTz(e.target.value)} className={DARK_SELECT}>
                          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {scheduleFreq === 'weekly' && (
                    <div>
                      <Label className="text-paper/40">Days</Label>
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        {WEEKDAYS.map(day => {
                          const checked = scheduleDays.includes(day)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setScheduleDays(prev => checked ? prev.filter(d => d !== day) : [...prev, day])}
                              className="mono text-[11px] px-2.5 py-1 rounded-sm cursor-pointer transition-all"
                              style={{
                                border: checked ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.15)',
                                background: checked ? 'rgba(140,43,26,0.15)' : 'transparent',
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
                      <Label className="text-paper/40">Cron expression</Label>
                      <Input value={customCron} onChange={e => setCustomCron(e.target.value)} placeholder="0 9 * * 1" className={DARK_INPUT} />
                    </div>
                  )}

                  {scheduleFreq !== 'custom' && (
                    <TerminalBlock
                      lines={[
                        { type: 'primary', value: 'Next 3 runs' },
                        ...computeNextRuns().map(run => ({ type: 'sub' as const, value: run })),
                      ]}
                    />
                  )}
                </div>
              )}

              {triggerType === 'webhook' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <Label className="text-paper/40">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`https://os.eevolvv.com/hooks/${agent.id}`}
                        className={`${DARK_INPUT} opacity-70 cursor-default`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(`https://os.eevolvv.com/hooks/${agent.id}`)}
                      >
                        copy
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-paper/40">Method</Label>
                    <select value={webhookMethod} onChange={e => setWebhookMethod(e.target.value as 'POST' | 'GET' | 'PUT')} className={DARK_SELECT}>
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-paper/40">Auth type</Label>
                    <div className="flex gap-4 mt-1">
                      {(['none', 'bearer', 'hmac'] as const).map(authType => (
                        <label key={authType} className="flex items-center gap-1.5 cursor-pointer mono text-[12px] text-paper/70">
                          <input type="radio" name="webhookAuth" value={authType} checked={webhookAuth === authType} onChange={() => setWebhookAuth(authType)} />
                          {authType === 'none' ? 'None' : authType === 'bearer' ? 'Bearer token' : 'HMAC signature'}
                        </label>
                      ))}
                    </div>
                  </div>
                  {webhookAuth === 'bearer' && (
                    <div>
                      <Label className="text-paper/40">Bearer token</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          readOnly
                          value={showToken ? webhookToken : '••••••••••••••••••••••••'}
                          className={`${DARK_INPUT} opacity-80 cursor-default ${showToken ? '' : 'tracking-[0.15em]'}`}
                        />
                        <Button variant="ghost" size="sm" onClick={() => setShowToken(v => !v)}>
                          {showToken ? 'hide' : 'reveal'}
                        </Button>
                      </div>
                    </div>
                  )}
                  {webhookAuth === 'hmac' && (
                    <div>
                      <Label className="text-paper/40">Signing secret</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          readOnly
                          value={showSecret ? webhookSecret : '••••••••••••••••••••••••'}
                          className={`${DARK_INPUT} opacity-80 cursor-default ${showSecret ? '' : 'tracking-[0.15em]'}`}
                        />
                        <Button variant="ghost" size="sm" onClick={() => setShowSecret(v => !v)}>
                          {showSecret ? 'hide' : 'reveal'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — REVIEW */}
          {step === 5 && (
            <div className="max-w-[680px] flex flex-col gap-5">
              <TerminalBlock
                lines={[
                  {
                    type: 'primary',
                    value: `→ This agent will ${triggerSentence()} using ${selectedIntegrations.length > 0 ? selectedIntegrations.join(', ') : 'no external integrations'} to ${description || 'complete tasks'}.`,
                  },
                ]}
              />

              {renderReviewSection('IDENTITY', 1, [
                ['Name', name],
                ['Type', type],
                ['Description', description || '—'],
              ])}

              {renderReviewSection('INSTRUCTIONS', 2, [
                ['System prompt', (instructions.slice(0, 120) + (instructions.length > 120 ? '…' : '')) || '—'],
              ])}

              <div className="flex items-start justify-between mb-2">
                <div className="border-l-[3px] border-accent pl-3 flex-1">
                  <p className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 mb-3">INTEGRATIONS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIntegrations.length === 0
                      ? <span className="mono text-[12px] text-paper/40">None selected</span>
                      : selectedIntegrations.map(i => (
                        <span key={i} className="mono text-[11px] text-paper/70 border border-white/15 rounded-full px-2.5 py-1">{i}</span>
                      ))
                    }
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="mono text-[10px] text-accent bg-transparent border-none cursor-pointer opacity-60 hover:opacity-100 ml-4"
                >
                  ← edit
                </button>
              </div>

              {renderReviewSection('TRIGGER', 4, [
                ['Type', triggerType],
                ['Config', triggerSentence()],
              ])}
            </div>
          )}

          {/* Step 6 — DEPLOY */}
          {step === 6 && (
            <div className="max-w-[760px]">

              {/* Run Now */}
              <div className="mb-8">
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 mb-3">§ RUN AGENT</p>
                <Button
                  variant="primary"
                  onClick={runAgent}
                  disabled={runLoading}
                  className="mb-4"
                >
                  {runLoading ? 'Running...' : '▷ Run agent now'}
                </Button>
                {runError && (
                  <p className="mono text-[12px] text-red-400 mb-3">✗ {runError}</p>
                )}
                {runOutput && (
                  <TerminalBlock
                    lines={runOutput
                      .split('\n')
                      .filter(Boolean)
                      .map(line => ({ type: 'primary' as const, value: line }))}
                  />
                )}
              </div>

              {/* Run History */}
              <div className="mb-8">
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 mb-3">§ RUN HISTORY</p>
                {runs === null ? (
                  <p className="mono text-[11px] text-paper/50">Loading...</p>
                ) : runs.length === 0 ? (
                  <p className="mono text-[11px] text-paper/50">No runs yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {runs.map(run => (
                      <div
                        key={run.id}
                        className="p-3 bg-white/[0.04] border border-white/[0.07] rounded-sm cursor-pointer hover:bg-white/[0.06] transition-colors"
                        onClick={() => setExpandedRunId(expandedRunId === run.id ? null : run.id)}
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <StatusPill variant={runStatusToVariant(run.status)}>{run.status}</StatusPill>
                          <span className="mono text-[10px] text-paper/50">{run.triggered_by}</span>
                          {run.latency_ms != null && (
                            <span className="mono text-[10px] text-paper/60">{(run.latency_ms / 1000).toFixed(1)}s</span>
                          )}
                          {run.input_tokens != null && (
                            <span className="mono text-[10px] text-paper/60">{run.input_tokens} / {run.output_tokens} tok</span>
                          )}
                          <span className="mono text-[10px] text-paper/40 ml-auto">{formatRelativeTime(run.created_at)}</span>
                        </div>
                        {run.output_summary && (
                          <p
                            className="mono text-[11px] text-paper/60 mt-1.5"
                            style={{ color: runStatusColor(run.status) }}
                          >
                            {expandedRunId === run.id ? run.output_summary : run.output_summary.slice(0, 80) + (run.output_summary.length > 80 ? '...' : '')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deploy environments */}
              <div className="flex gap-4">
                {[
                  { key: 'dev', label: 'DEV', borderColor: '#6366f1', nextStatus: 'staging' as const, promoteLabel: '→ Stage', showTest: true },
                  { key: 'staging', label: 'STAGING', borderColor: '#f59e0b', nextStatus: 'live' as const, promoteLabel: '→ Live', showTest: false },
                  { key: 'live', label: 'LIVE', borderColor: '#4ade80', nextStatus: null, promoteLabel: null, showTest: false },
                ].map(stage => {
                  const isActive = agentStatus === stage.key
                  return (
                    <div
                      key={stage.key}
                      className="flex-1 p-5 rounded-sm transition-all"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? stage.borderColor : 'rgba(255,255,255,0.07)'}`,
                        borderLeft: `3px solid ${stage.borderColor}`, // one acceptable inline style
                        opacity: isActive ? 1 : 0.5,
                      }}
                    >
                      <div
                        className="mono text-[11px] uppercase tracking-[0.15em] mb-2"
                        style={{ color: stage.borderColor }}
                      >
                        {stage.label}
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ background: isActive ? stage.borderColor : 'rgba(255,255,255,0.15)' }}
                        />
                        <span className="mono text-[11px] text-paper/50">{isActive ? 'active' : 'not deployed'}</span>
                      </div>
                      {agent.version && (
                        <p className="mono text-[11px] text-paper/40 mb-3">v{agent.version}</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {stage.showTest && isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert('Test run triggered (API not yet wired)')}
                          >
                            Test run
                          </Button>
                        )}
                        {stage.promoteLabel && isActive && (
                          <button
                            type="button"
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
                            className="mono text-[11px] px-2.5 py-1 cursor-pointer rounded-sm bg-transparent transition-colors"
                            style={{ color: stage.borderColor, border: `1px solid ${stage.borderColor}` }}
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

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/[0.07]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="mono text-[11px] text-paper/50 bg-transparent border-none cursor-pointer hover:text-paper/80 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button variant="primary" onClick={saveStep} disabled={saving}>
                {saving ? 'saving…' : 'Save & Continue →'}
              </Button>
            ) : (
              <Link
                href={`/os/clients/${client.id}`}
                className="mono text-[11px] uppercase text-paper bg-accent px-5 py-2 rounded-sm no-underline hover:opacity-90 transition-opacity"
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

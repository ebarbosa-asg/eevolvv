'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Badge, Button, Input, Textarea, Label, SectionMarker, StatusPill } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSBreadcrumb } from '@/app/os/components/OSBreadcrumb'
import { HealthDot } from '@/app/os/components/shared'

const STAGES = ['diagnose', 'onboard', 'build', 'maintain'] as const
const AGENT_TYPES = ['qa-automation', 'finance-audit', 'data-sync', 'reporting', 'notification', 'custom']
const TASK_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const
const TASK_CATEGORIES = ['research', 'build', 'qa', 'review', 'deploy', 'comms', 'general'] as const

// Dark-context overrides for ds/ Input/Textarea
const DARK_INPUT = 'bg-white/6 text-paper border-white/10 placeholder:text-paper/30 focus:border-accent'
const DARK_TEXTAREA = 'bg-transparent text-paper border-paper/10 placeholder:text-paper/30 focus:border-accent resize-y min-h-[80px]'
const DARK_SELECT = 'w-full border border-white/10 rounded px-3 py-2 text-sm bg-white/6 text-paper cursor-pointer focus:outline-none focus:border-accent'

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

type Agent = {
  id: string; client_id: string; name: string; description: string | null
  type: string | null; status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null; repo_url: string | null; deploy_url: string | null
  last_run_at: string | null; health: 'green' | 'yellow' | 'red'; notes: string | null
  created_at: string; updated_at: string
  trigger_type: 'manual' | 'schedule' | 'webhook' | null
  trigger_config: Record<string, unknown> | null
  instructions: string | null
  estimated_output: string | null
  config: Record<string, unknown> | null
  version: number
  run_count: number
  error_count: number
}

type Task = {
  id: string; client_id: string; title: string; description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  due_date: string | null; priority: 'high' | 'normal' | 'low'
  created_at: string; updated_at: string
  agent_id: string | null
  category: 'research' | 'build' | 'qa' | 'review' | 'deploy' | 'comms' | 'general' | null
  assignee: string | null
  estimated_hrs: number | null
  blocked_reason: string | null
}

type ActivityEntry = {
  id: string; client_id: string; actor: string; action: string; meta: unknown; created_at: string
}

type ClientFull = {
  id: string; name: string; company: string; email: string | null; phone: string | null
  business_type: string | null; contract_value: number | null
  stage: 'diagnose' | 'onboard' | 'build' | 'maintain'
  health: 'green' | 'yellow' | 'red'; notes: string | null; submission_id: string | null
  created_at: string; updated_at: string
  agents: Agent[]; service_tasks: Task[]; activity_log: ActivityEntry[]
}

type SubmissionBrief = {
  id: string; name: string | null; email: string; business_name: string | null
  business_type: string; tier: string | null; created_at: string
}

function agentStatusToVariant(status: string): BadgeVariant {
  if (status === 'live') return 'success'
  if (status === 'staging') return 'warning'
  if (status === 'error') return 'danger'
  return 'neutral'
}

function PriorityDot({ priority }: { priority: string }) {
  const color = priority === 'high' ? 'var(--accent)' : priority === 'low' ? 'rgba(250,247,240,0.2)' : 'rgba(250,247,240,0.45)'
  return (
    <span
      style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }}
      title={priority}
    />
  )
}

// ── Types for Gear Panel
type GearDeliverable = {
  id: string
  title: string
  status: string
  promise: string
  delivery_window: string
  type: string
}

const GEAR_STATUS_ORDER = ['intake', 'queued', 'building', 'review', 'live'] as const
type GearStatus = typeof GEAR_STATUS_ORDER[number]

const GEAR_STATUS_COLORS: Record<GearStatus, string> = {
  intake:   'rgba(161,161,170,0.8)',
  queued:   'rgba(161,161,170,0.8)',
  building: '#f59e0b',
  review:   '#3b82f6',
  live:     '#4ade80',
}

function GearPanel({ slug }: { slug: string }) {
  const [gears, setGears] = useState<GearDeliverable[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [lastPushed, setLastPushed] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/os/client-agent/${slug}/deliverables`)
      .then(r => r.json())
      .then(d => {
        const items = (d.deliverables ?? []).filter((g: GearDeliverable) => g.status !== 'recommended')
        setGears(items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  async function setStatus(gear: GearDeliverable, newStatus: GearStatus) {
    setUpdating(gear.id)
    try {
      const res = await fetch(`/api/os/client-agent/${slug}/deliverables/${gear.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setGears(prev => prev.map(g => g.id === gear.id ? { ...g, status: newStatus } : g))
        if (newStatus === 'building' || newStatus === 'live') {
          setLastPushed(gear.title)
          setTimeout(() => setLastPushed(null), 3000)
        }
      }
    } finally {
      setUpdating(null)
    }
  }

  async function manualPush(gear: GearDeliverable) {
    setUpdating(gear.id)
    try {
      await fetch('/api/os/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: `Update: ${gear.title}`,
          body: `Status: ${gear.status}. Check your portal for details.`,
          url: `/os/${slug}?tab=activity`,
        }),
      })
      setLastPushed(gear.title)
      setTimeout(() => setLastPushed(null), 3000)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="mono text-[11px] text-paper/30 py-4">Loading gears…</div>
    )
  }

  if (gears.length === 0) {
    return (
      <div className="mono text-[11px] text-paper/30 py-4">
        No deliverables yet — they appear here once created.
      </div>
    )
  }

  const idx = (status: string) => GEAR_STATUS_ORDER.indexOf(status as GearStatus)

  return (
    <div className="flex flex-col gap-2">
      {lastPushed && (
        <div className="mono text-[10px] text-[#4ade80] mb-1">
          ✓ pushed: {lastPushed}
        </div>
      )}
      {gears.map(gear => {
        const cur = gear.status as GearStatus
        const curIdx = idx(gear.status)
        const prev = curIdx > 0 ? GEAR_STATUS_ORDER[curIdx - 1] : null
        const next = curIdx < GEAR_STATUS_ORDER.length - 1 ? GEAR_STATUS_ORDER[curIdx + 1] : null
        const isUpdating = updating === gear.id

        return (
          <div
            key={gear.id}
            className="p-3.5 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: GEAR_STATUS_COLORS[cur] ?? '#a1a1aa' }}
              />
              <span className="font-semibold text-[13px] flex-1">{gear.title}</span>
              <span
                className="mono text-[10px] px-1.5 py-0.5 rounded-sm"
                style={{
                  background: `${GEAR_STATUS_COLORS[cur] ?? '#a1a1aa'}22`,
                  color: GEAR_STATUS_COLORS[cur] ?? '#a1a1aa',
                }}
              >
                {gear.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {prev && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setStatus(gear, prev)}
                  className="mono text-[9px] border border-white/10 text-paper/35 px-2 py-1 hover:bg-white/[0.06] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  ← {prev}
                </button>
              )}
              {next && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setStatus(gear, next)}
                  className="mono text-[9px] px-2 py-1 transition-colors disabled:opacity-40 cursor-pointer"
                  style={{
                    border: `1px solid ${GEAR_STATUS_COLORS[next] ?? '#a1a1aa'}`,
                    color: GEAR_STATUS_COLORS[next] ?? '#a1a1aa',
                    background: `${GEAR_STATUS_COLORS[next] ?? '#a1a1aa'}11`,
                  }}
                >
                  {next} →
                </button>
              )}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => manualPush(gear)}
                className="mono text-[9px] border border-white/[0.12] text-paper/35 px-2 py-1 ml-auto hover:bg-white/[0.06] transition-colors disabled:opacity-40 cursor-pointer"
                title="Send push notification to client"
              >
                push 🔔
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ClientWorkspace({ client: initialClient, allSubmissions, agentPageSlug }: { client: ClientFull; allSubmissions: SubmissionBrief[]; agentPageSlug?: string }) {
  const [client, setClient] = useState(initialClient)
  const [agents, setAgents] = useState<Agent[]>(initialClient.agents ?? [])
  const [tasks, setTasks] = useState<Task[]>(initialClient.service_tasks ?? [])
  const [activity, setActivity] = useState<ActivityEntry[]>(initialClient.activity_log ?? [])
  const [triggering, setTriggering] = useState(false)

  const triggerAutonomousBuild = async () => {
    setTriggering(true)
    try {
      const res = await fetch('/api/os/trigger-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id, clientName: client.name })
      })
      if (res.ok) {
        alert('Autonomous build sequence initiated.')
        window.location.reload()
      }
    } catch (e) {
      console.error('Trigger failed', e)
    } finally {
      setTriggering(false)
    }
  }

  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- Client field updates ---
  const patchClient = useCallback(async (patch: Partial<ClientFull>, logAction?: string) => {
    const res = await fetch(`/api/os/clients/${client.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    })
    if (res.ok) {
      const updated = await res.json() as ClientFull
      setClient(prev => ({ ...prev, ...updated }))
      if (logAction) logActivity(logAction)
    }
  }, [client.id])

  const logActivity = useCallback(async (action: string, actor = 'owner') => {
    const res = await fetch(`/api/os/clients/${client.id}/activity`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actor, action }),
    })
    if (res.ok) {
      const entry = await res.json() as ActivityEntry
      setActivity(prev => [entry, ...prev])
    }
  }, [client.id])

  const handleNotesChange = (val: string) => {
    setClient(prev => ({ ...prev, notes: val }))
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => patchClient({ notes: val }), 800)
  }

  // --- Agents ---
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [agentForm, setAgentForm] = useState({ name: '', description: '', type: 'custom', status: 'dev', integrations: '', repo_url: '', deploy_url: '' })
  const [agentSubmitting, setAgentSubmitting] = useState(false)
  const [editingAgent, setEditingAgent] = useState<string | null>(null)
  const [editAgentForm, setEditAgentForm] = useState<Partial<Agent>>({})

  const submitAgent = async () => {
    if (!agentForm.name) return
    setAgentSubmitting(true)
    const res = await fetch(`/api/os/clients/${client.id}/agents`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...agentForm, integrations: agentForm.integrations.split(',').map(s => s.trim()).filter(Boolean) }),
    })
    if (res.ok) {
      const newAgent = await res.json() as Agent
      setAgents(prev => [newAgent, ...prev])
      setShowAddAgent(false)
      setAgentForm({ name: '', description: '', type: 'custom', status: 'dev', integrations: '', repo_url: '', deploy_url: '' })
      logActivity(`Agent added: ${newAgent.name}`)
    }
    setAgentSubmitting(false)
  }

  const saveAgentEdit = async (agentId: string) => {
    const res = await fetch(`/api/os/clients/${client.id}/agents/${agentId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editAgentForm),
    })
    if (res.ok) {
      const updated = await res.json() as Agent
      setAgents(prev => prev.map(a => a.id === agentId ? updated : a))
      setEditingAgent(null)
      logActivity(`Agent updated: ${updated.name}`)
    }
  }

  const deleteAgent = async (agentId: string, name: string) => {
    await fetch(`/api/os/clients/${client.id}/agents/${agentId}`, { method: 'DELETE' })
    setAgents(prev => prev.filter(a => a.id !== agentId))
    logActivity(`Agent removed: ${name}`)
  }

  // --- Tasks ---
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'normal', due_date: '', category: 'general', agent_id: '', estimated_hrs: '' })
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [editTaskForm, setEditTaskForm] = useState<Partial<Task>>({})

  const submitTask = async () => {
    if (!taskForm.title) return
    const res = await fetch(`/api/os/clients/${client.id}/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: taskForm.title,
        priority: taskForm.priority,
        due_date: taskForm.due_date || null,
        category: taskForm.category || 'general',
        agent_id: taskForm.agent_id || null,
        estimated_hrs: taskForm.estimated_hrs ? parseFloat(taskForm.estimated_hrs) : null,
      }),
    })
    if (res.ok) {
      const newTask = await res.json() as Task
      setTasks(prev => [newTask, ...prev])
      setShowAddTask(false)
      setTaskForm({ title: '', priority: 'normal', due_date: '', category: 'general', agent_id: '', estimated_hrs: '' })
    }
  }

  const cycleTaskStatus = async (task: Task) => {
    const order: Task['status'][] = ['todo', 'in_progress', 'done', 'todo']
    const next = order[order.indexOf(task.status) + 1] ?? 'todo'
    const res = await fetch(`/api/os/clients/${client.id}/tasks/${task.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }),
    })
    if (res.ok) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t))
      logActivity(`Task "${task.title}": ${task.status} → ${next}`)
    }
  }

  const saveTaskEdit = async (taskId: string) => {
    const res = await fetch(`/api/os/clients/${client.id}/tasks/${taskId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editTaskForm),
    })
    if (res.ok) {
      const updated = await res.json() as Task
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
      setExpandedTask(null)
    }
  }

  // --- Activity manual entry ---
  const [manualLog, setManualLog] = useState('')
  const submitManualLog = async () => {
    if (!manualLog.trim()) return
    await logActivity(manualLog.trim())
    setManualLog('')
  }

  // --- Linked diagnostic ---
  const [linkingSubmission, setLinkingSubmission] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState('')

  const linkSubmission = async () => {
    if (!selectedSubmission) return
    await patchClient({ submission_id: selectedSubmission }, `Linked diagnostic submission`)
    setLinkingSubmission(false)
  }

  const linkedSub = allSubmissions.find(s => s.id === client.submission_id)

  // Task grouping
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const todo = tasks.filter(t => t.status === 'todo')
  const done = tasks.filter(t => t.status === 'done')
  const blocked = tasks.filter(t => t.status === 'blocked')
  const [showDone, setShowDone] = useState(false)

  const taskBadgeVariant = (status: string) => {
    if (status === 'done') return 'success' as const
    if (status === 'in_progress') return 'warning' as const
    if (status === 'blocked') return 'danger' as const
    return 'neutral' as const
  }

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
            { label: client.company },
          ]}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-8 py-10">

        {/* Client header */}
        <div className="mb-10 pb-8 border-b border-white/[0.07]">
          <Link href="/os/clients" className="mono text-[11px] text-paper/40 no-underline uppercase tracking-[0.1em] inline-block mb-4">
            ← clients
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-bold text-[2rem] leading-none m-0 mb-1.5">{client.company}</h1>
              <div className="text-paper/60 text-sm">{client.name}{client.email ? ` · ${client.email}` : ''}</div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={triggerAutonomousBuild} 
                className="mono text-[10px] bg-accent text-paper hover:bg-accent/80 transition-colors uppercase tracking-widest px-4 py-2 h-9 rounded-sm"
                disabled={triggering}
              >
                {triggering ? 'Initiating...' : '⚡ Trigger Build'}
              </Button>
              {client.submission_id && (
                <Link href={`/client/${client.submission_id}`} target="_blank">
                  <Button variant="ghost" size="sm" className="mono border border-white/10 text-white/40">
                    portal
                  </Button>
                </Link>
              )}
              {client.contract_value && (
                <span className="mono text-[13px] border border-accent text-accent px-2.5 py-1 rounded-sm">
                  ${client.contract_value.toLocaleString()}
                </span>
              )}
              {/* Health selector */}
              <div className="flex gap-1.5">
                {(['green', 'yellow', 'red'] as const).map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => patchClient({ health: h }, `Health changed to ${h}`)}
                    title={h}
                    style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: h === 'green' ? '#4ade80' : h === 'yellow' ? '#f59e0b' : 'var(--accent)',
                      border: client.health === h ? '2px solid var(--paper)' : '2px solid transparent',
                      cursor: 'pointer', padding: 0,
                    }}
                  />
                ))}
              </div>
              {/* Stage selector */}
              <div className="flex">
                {STAGES.map((s, i) => {
                  const active = STAGES.indexOf(client.stage)
                  const isCurrent = s === client.stage
                  const isPast = i < active
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => patchClient({ stage: s }, `Stage changed to ${s}`)}
                      className="mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 cursor-pointer"
                      style={{
                        background: isCurrent ? 'var(--accent)' : isPast ? 'rgba(140,43,26,0.3)' : 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRight: i < STAGES.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: isCurrent ? 'var(--paper)' : 'rgba(250,247,240,0.5)',
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">

          {/* LEFT COLUMN */}
          <div>

            {/* AGENTS */}
            <div className="mb-8 pl-4 border-l-[3px] border-accent">
              <div className="flex items-center justify-between mb-4">
                <SectionMarker num="A" label="AGENTS" />
                <Button variant="ghost" size="sm" onClick={() => setShowAddAgent(v => !v)}>
                  + add agent
                </Button>
              </div>

              {showAddAgent && (
                <div className="mb-4 p-5 bg-white/[0.04] border border-white/[0.07] rounded-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                  {([
                    { k: 'name' as const, l: 'Name', p: 'QA Bot' },
                    { k: 'description' as const, l: 'Description', p: 'Automates test runs' },
                    { k: 'repo_url' as const, l: 'Repo URL', p: 'https://github.com/...' },
                    { k: 'deploy_url' as const, l: 'Deploy URL', p: 'https://...' },
                    { k: 'integrations' as const, l: 'Integrations (comma-sep)', p: 'Slack, GitHub' },
                  ]).map(({ k, l, p }) => (
                    <div key={k} className={k === 'integrations' ? 'md:col-span-2' : ''}>
                      <Label className="text-paper/40">{l}</Label>
                      <Input
                        value={agentForm[k]}
                        onChange={e => setAgentForm(f => ({ ...f, [k]: e.target.value }))}
                        placeholder={p}
                        className={DARK_INPUT}
                      />
                    </div>
                  ))}
                  <div>
                    <Label className="text-paper/40">Type</Label>
                    <select
                      value={agentForm.type}
                      onChange={e => setAgentForm(f => ({ ...f, type: e.target.value }))}
                      className={DARK_SELECT}
                    >
                      {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-paper/40">Status</Label>
                    <select
                      value={agentForm.status}
                      onChange={e => setAgentForm(f => ({ ...f, status: e.target.value }))}
                      className={DARK_SELECT}
                    >
                      {['dev', 'staging', 'live', 'paused', 'error'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex gap-2 justify-end pt-1">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddAgent(false)}>cancel</Button>
                    <Button variant="primary" size="sm" onClick={submitAgent} disabled={agentSubmitting}>
                      {agentSubmitting ? 'saving…' : 'add agent'}
                    </Button>
                  </div>
                </div>
              )}

              {agents.length === 0 && !showAddAgent && (
                <p className="mono text-[12px] text-paper/35 py-5">No agents yet</p>
              )}

              {agents.map(a => (
                <div key={a.id} className="bg-white/[0.03] border border-white/[0.07] p-4 mb-2.5 hover:bg-white/[0.06] transition-colors rounded-sm">
                  {editingAgent === a.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(['name', 'type', 'status', 'repo_url', 'deploy_url'] as const).map(k => (
                        <div key={k}>
                          <Label className="text-paper/40">{k.replace('_', ' ')}</Label>
                          {k === 'type' ? (
                            <select
                              value={(editAgentForm[k] ?? a[k]) as string}
                              onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value }))}
                              className={DARK_SELECT}
                            >
                              {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          ) : k === 'status' ? (
                            <select
                              value={(editAgentForm[k] ?? a[k]) as string}
                              onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value as Agent['status'] }))}
                              className={DARK_SELECT}
                            >
                              {['dev', 'staging', 'live', 'paused', 'error'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <Input
                              value={(editAgentForm[k] ?? a[k] ?? '') as string}
                              onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value }))}
                              className={DARK_INPUT}
                            />
                          )}
                        </div>
                      ))}
                      <div className="md:col-span-2 flex gap-2 justify-end pt-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingAgent(null)}>cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => saveAgentEdit(a.id)}>save</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-sm">{a.name}</span>
                          {a.type && <span className="mono text-[10px] text-paper/50">{a.type}</span>}
                          <StatusPill variant={agentStatusToVariant(a.status)}>{a.status}</StatusPill>
                          <HealthDot health={a.health} />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditingAgent(a.id); setEditAgentForm({}) }}
                            className="mono text-[11px] text-paper/40 bg-none border-none cursor-pointer hover:text-paper/70 transition-colors"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAgent(a.id, a.name)}
                            className="mono text-[11px] text-paper/30 bg-none border-none cursor-pointer hover:text-paper/60 transition-colors"
                          >
                            ✕
                          </button>
                          <Link
                            href={`/os/clients/${client.id}/agents/${a.id}`}
                            className="mono text-[11px] text-accent no-underline opacity-80 hover:opacity-100"
                          >
                            → build
                          </Link>
                        </div>
                      </div>
                      {a.description && <p className="text-[13px] text-paper/60 mb-2">{a.description}</p>}
                      <div className="flex gap-1.5 items-center flex-wrap">
                        {(a.integrations ?? []).map(i => (
                          <span key={i} className="mono text-[10px] bg-white/[0.06] border border-white/10 rounded-sm px-1 py-0.5 opacity-70">
                            {i}
                          </span>
                        ))}
                        {a.repo_url && (
                          <a href={a.repo_url} target="_blank" rel="noopener noreferrer" className="mono text-[11px] text-accent ml-1">repo →</a>
                        )}
                        {a.deploy_url && (
                          <a href={a.deploy_url} target="_blank" rel="noopener noreferrer" className="mono text-[11px] text-accent">deploy →</a>
                        )}
                        {a.last_run_at && (
                          <span className="mono text-[10px] text-paper/35 ml-auto">last run {relativeTime(a.last_run_at)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* SERVICE TASKS */}
            <div className="mb-8 pl-4 border-l-[3px] border-accent">
              <div className="flex items-center justify-between mb-4">
                <SectionMarker num="B" label="SERVICE TASKS" />
                <Button variant="ghost" size="sm" onClick={() => setShowAddTask(v => !v)}>
                  + add task
                </Button>
              </div>

              {showAddTask && (
                <div className="mb-4 p-5 bg-white/[0.04] border border-white/[0.07] rounded-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-paper/40">Title</Label>
                    <Input
                      value={taskForm.title}
                      onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Task title…"
                      className={DARK_INPUT}
                      onKeyDown={e => e.key === 'Enter' && submitTask()}
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label className="text-paper/40">Priority</Label>
                    <select
                      value={taskForm.priority}
                      onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                      className={DARK_SELECT}
                    >
                      {['high', 'normal', 'low'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-paper/40">Due date</Label>
                    <Input
                      type="date"
                      value={taskForm.due_date}
                      onChange={e => setTaskForm(f => ({ ...f, due_date: e.target.value }))}
                      className={DARK_INPUT}
                    />
                  </div>
                  <div>
                    <Label className="text-paper/40">Category</Label>
                    <select
                      value={taskForm.category}
                      onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))}
                      className={DARK_SELECT}
                    >
                      {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-paper/40">Agent</Label>
                    <select
                      value={taskForm.agent_id}
                      onChange={e => setTaskForm(f => ({ ...f, agent_id: e.target.value }))}
                      className={DARK_SELECT}
                    >
                      <option value="">— no agent —</option>
                      {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-paper/40">Est hrs</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={taskForm.estimated_hrs}
                      onChange={e => setTaskForm(f => ({ ...f, estimated_hrs: e.target.value }))}
                      placeholder="0"
                      className={DARK_INPUT}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>cancel</Button>
                    <Button variant="primary" size="sm" onClick={submitTask}>add</Button>
                  </div>
                </div>
              )}

              {[
                { label: 'IN PROGRESS', items: inProgress },
                { label: 'BLOCKED', items: blocked },
                { label: 'TODO', items: todo },
              ].map(({ label, items }) => items.length > 0 && (
                <div key={label} className="mb-5">
                  <p className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 mb-2">{label}</p>
                  {items.map(t => (
                    <div key={t.id}>
                      <div
                        className="flex items-center gap-2.5 py-2.5 border-b border-white/[0.05] last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => {
                          setExpandedTask(expandedTask === t.id ? null : t.id)
                          setEditTaskForm({ title: t.title, description: t.description, due_date: t.due_date, priority: t.priority, status: t.status, agent_id: t.agent_id, category: t.category, estimated_hrs: t.estimated_hrs, blocked_reason: t.blocked_reason })
                        }}
                      >
                        <PriorityDot priority={t.priority} />
                        <span className="flex-1 text-sm">{t.title}</span>
                        {t.category && t.category !== 'general' && (
                          <span className="mono text-[10px] bg-white/[0.06] border border-white/10 rounded-sm px-1 py-0.5 opacity-70">
                            {t.category}
                          </span>
                        )}
                        {t.agent_id && (() => {
                          const agent = agents.find(a => a.id === t.agent_id)
                          if (!agent) return null
                          return (
                            <Link
                              href={`/os/clients/${client.id}/agents/${t.agent_id}`}
                              onClick={e => e.stopPropagation()}
                              className="mono text-[10px] text-accent border border-accent rounded-full px-2 py-0.5 no-underline opacity-80"
                            >
                              {agent.name}
                            </Link>
                          )
                        })()}
                        {t.due_date && <span className="mono text-[10px] text-paper/40">{t.due_date}</span>}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); cycleTaskStatus(t) }}
                          className="cursor-pointer"
                        >
                          <Badge variant={taskBadgeVariant(t.status)}>
                            {t.status.replace('_', ' ')}
                          </Badge>
                        </button>
                        <button
                          type="button"
                          onClick={async e => {
                            e.stopPropagation()
                            if (!window.confirm(`Delete "${t.title}"?`)) return
                            const res = await fetch(`/api/os/clients/${client.id}/tasks/${t.id}`, { method: 'DELETE' })
                            if (res.ok) setTasks(prev => prev.filter(task => task.id !== t.id))
                          }}
                          className="mono text-sm text-paper/30 hover:text-paper/60 transition-colors px-1"
                          title="Delete task"
                        >
                          ×
                        </button>
                      </div>
                      {expandedTask === t.id && (
                        <div className="p-5 mb-2 bg-white/[0.04] border border-white/[0.07] rounded-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <Label className="text-paper/40">Title</Label>
                            <Input value={editTaskForm.title ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, title: e.target.value }))} className={DARK_INPUT} />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-paper/40">Description</Label>
                            <Textarea value={editTaskForm.description ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, description: e.target.value }))} className={DARK_TEXTAREA} />
                          </div>
                          <div>
                            <Label className="text-paper/40">Due date</Label>
                            <Input type="date" value={editTaskForm.due_date ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, due_date: e.target.value }))} className={DARK_INPUT} />
                          </div>
                          <div>
                            <Label className="text-paper/40">Priority</Label>
                            <select value={editTaskForm.priority ?? 'normal'} onChange={e => setEditTaskForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))} className={DARK_SELECT}>
                              {['high', 'normal', 'low'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-paper/40">Status</Label>
                            <select value={editTaskForm.status ?? 'todo'} onChange={e => setEditTaskForm(f => ({ ...f, status: e.target.value as Task['status'] }))} className={DARK_SELECT}>
                              {TASK_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-paper/40">Category</Label>
                            <select value={editTaskForm.category ?? 'general'} onChange={e => setEditTaskForm(f => ({ ...f, category: e.target.value as Task['category'] }))} className={DARK_SELECT}>
                              {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label className="text-paper/40">Agent</Label>
                            <select value={editTaskForm.agent_id ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, agent_id: e.target.value || null }))} className={DARK_SELECT}>
                              <option value="">— no agent —</option>
                              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                          </div>
                          {editTaskForm.status === 'blocked' && (
                            <div className="md:col-span-2">
                              <Label className="text-paper/40">Blocked reason</Label>
                              <Textarea
                                value={editTaskForm.blocked_reason ?? ''}
                                onChange={e => setEditTaskForm(f => ({ ...f, blocked_reason: e.target.value }))}
                                placeholder="Why is this blocked?"
                                className={DARK_TEXTAREA}
                              />
                            </div>
                          )}
                          <div className="md:col-span-2 flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setExpandedTask(null)}>cancel</Button>
                            <Button variant="primary" size="sm" onClick={() => saveTaskEdit(t.id)}>save</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {done.length > 0 && (
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={() => setShowDone(v => !v)}
                    className="mono text-[11px] uppercase tracking-[0.12em] text-paper/40 bg-transparent border-none cursor-pointer"
                  >
                    DONE ({done.length}) {showDone ? '▲' : '▼'}
                  </button>
                  {showDone && done.map(t => (
                    <div key={t.id} className="flex items-center gap-2.5 py-2.5 border-b border-white/[0.05] last:border-0 opacity-50">
                      <PriorityDot priority={t.priority} />
                      <span className="flex-1 text-sm line-through">{t.title}</span>
                      <Badge variant="success">done</Badge>
                    </div>
                  ))}
                </div>
              )}

              {tasks.length === 0 && !showAddTask && (
                <p className="mono text-[12px] text-paper/35 py-4">No tasks yet</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>

            {/* LINKED DIAGNOSTIC */}
            <div className="mb-8 pl-4 border-l-[3px] border-accent">
              <SectionMarker num="C" label="LINKED DIAGNOSTIC" className="mb-4" />
              {linkedSub ? (
                <div className="p-5 bg-white/[0.04] border border-white/[0.07] rounded-sm">
                  <div className="mono text-[13px] font-semibold mb-1.5">{linkedSub.business_name ?? linkedSub.name ?? 'Submission'}</div>
                  <div className="mono text-[11px] text-paper/50 mb-1">{linkedSub.business_type} · {linkedSub.tier ?? '—'}</div>
                  <div className="mono text-[11px] text-paper/40">{relativeTime(linkedSub.created_at)}</div>
                  <button
                    type="button"
                    onClick={() => patchClient({ submission_id: null })}
                    className="mono text-[10px] text-paper/30 bg-transparent border-none cursor-pointer mt-2.5 hover:text-paper/60 transition-colors"
                  >
                    unlink
                  </button>
                </div>
              ) : linkingSubmission ? (
                <div className="p-5 bg-white/[0.04] border border-white/[0.07] rounded-sm">
                  <Label className="text-paper/40">Select submission</Label>
                  <select
                    value={selectedSubmission}
                    onChange={e => setSelectedSubmission(e.target.value)}
                    className={`${DARK_SELECT} mb-2.5`}
                  >
                    <option value="">— choose —</option>
                    {allSubmissions.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.business_name ?? s.name ?? s.email} · {relativeTime(s.created_at)}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setLinkingSubmission(false)}>cancel</Button>
                    <Button variant="primary" size="sm" onClick={linkSubmission}>link</Button>
                  </div>
                </div>
              ) : (
                <p className="mono text-[12px] text-paper/35 py-3">
                  No linked diagnostic —{' '}
                  <button
                    type="button"
                    onClick={() => setLinkingSubmission(true)}
                    className="mono text-[12px] text-accent bg-transparent border-none cursor-pointer underline"
                  >
                    link submission
                  </button>
                </p>
              )}
            </div>

            {/* NOTES */}
            <div className="mb-8 pl-4 border-l-[3px] border-accent">
              <SectionMarker num="D" label="NOTES" className="mb-4" />
              <div className="bg-ink/55 border border-white/[0.07] border-l-[3px] border-l-accent p-3.5">
                <Textarea
                  value={client.notes ?? ''}
                  onChange={e => handleNotesChange(e.target.value)}
                  placeholder="Client notes…"
                  className="w-full bg-transparent border-none text-paper mono text-[13px] leading-[1.9] outline-none resize-y min-h-[120px] placeholder:text-paper/30 focus:outline-none"
                />
              </div>
            </div>

            {/* GEAR PANEL — client portal deliverables */}
            {agentPageSlug && (
              <div className="mb-8 pl-4 border-l-[3px] border-accent">
                <div className="flex items-center justify-between mb-4">
                  <SectionMarker num="E" label="GEAR PANEL" />
                  <a
                    href={`/os/${agentPageSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-[10px] text-accent no-underline opacity-70 hover:opacity-100"
                  >
                    client portal →
                  </a>
                </div>
                <GearPanel slug={agentPageSlug} />
              </div>
            )}

            {/* ACTIVITY LOG */}
            <div className="mb-8 pl-4 border-l-[3px] border-accent">
              <SectionMarker num={agentPageSlug ? 'F' : 'E'} label="ACTIVITY LOG" className="mb-4" />
              <div className="flex flex-col gap-2 mb-3.5 max-h-[280px] overflow-y-auto">
                {activity.length === 0 && (
                  <p className="mono text-[11px] text-paper/30">No activity yet</p>
                )}
                {activity.map(e => (
                  <div key={e.id} className="flex gap-2.5 items-start">
                    <span className="mono text-[10px] text-paper/35 flex-shrink-0 pt-0.5">{relativeTime(e.created_at)}</span>
                    <span className="text-[13px] text-paper/80">{e.action}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={manualLog}
                  onChange={e => setManualLog(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitManualLog()}
                  placeholder="+ log entry…"
                  className={`flex-1 ${DARK_INPUT}`}
                />
                <Button variant="ghost" size="sm" onClick={submitManualLog}>log</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

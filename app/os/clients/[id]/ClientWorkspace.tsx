'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { HealthDot, StagePipeline, StatusBadge } from '../../HubClient'

const STAGES = ['diagnose', 'onboard', 'build', 'maintain'] as const
const AGENT_TYPES = ['qa-automation', 'finance-audit', 'data-sync', 'reporting', 'notification', 'custom']
const TASK_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const
const TASK_CATEGORIES = ['research', 'build', 'qa', 'review', 'deploy', 'comms', 'general'] as const

const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '2px' } as const
const MONO = { fontFamily: 'JetBrains Mono, monospace' } as const
const MONO_LABEL = { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', opacity: 0.4, marginBottom: '6px' }
const INPUT = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' } as const

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
  // Builder fields (added by T01 migration)
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

const WORKSPACE_CSS = `
  .ws-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
  .ws-section { margin-bottom: 32px; border-left: 3px solid var(--accent); padding-left: 16px; }
  .ws-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); padding: 20px; transition: background 0.15s; }
  .ws-card:hover { background: rgba(255,255,255,0.06); }
  .ws-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; color: var(--paper); font-family: JetBrains Mono, monospace; font-size: 12px; padding: 7px 10px; outline: none; width: 100%; }
  .ws-btn { font-family: JetBrains Mono, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; border-radius: 2px; }
  .task-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .task-row:last-child { border-bottom: none; }
  .task-row:hover { background: rgba(255,255,255,0.02); }
  .agent-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); padding: 16px; margin-bottom: 10px; transition: background 0.15s; }
  .agent-card:hover { background: rgba(255,255,255,0.06); }
  .chip { font-family: JetBrains Mono, monospace; font-size: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; padding: 1px 5px; opacity: 0.7; }
  @media (max-width: 900px) { .ws-grid { grid-template-columns: 1fr; } }
`

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '16px' }}>
      § {n} · {label}
    </div>
  )
}

function PriorityDot({ priority }: { priority: string }) {
  const color = priority === 'high' ? 'var(--accent)' : priority === 'low' ? 'rgba(250,247,240,0.2)' : 'rgba(250,247,240,0.45)'
  return <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} title={priority} />
}

export default function ClientWorkspace({ client: initialClient, allSubmissions }: { client: ClientFull; allSubmissions: SubmissionBrief[] }) {
  const [client, setClient] = useState(initialClient)
  const [agents, setAgents] = useState<Agent[]>(initialClient.agents ?? [])
  const [tasks, setTasks] = useState<Task[]>(initialClient.service_tasks ?? [])
  const [activity, setActivity] = useState<ActivityEntry[]>(initialClient.activity_log ?? [])

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

  const taskBadgeColor = (status: string) => {
    const map: Record<string, string> = { todo: 'rgba(250,247,240,0.35)', in_progress: '#f59e0b', done: '#4ade80', blocked: 'var(--accent)' }
    return map[status] ?? 'rgba(250,247,240,0.35)'
  }

  return (
    <div style={{ background: 'var(--ink)', color: 'var(--paper)', minHeight: '100vh', fontFamily: 'Space Grotesk, sans-serif' }}>
      <style>{WORKSPACE_CSS}</style>

      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', height: '52px', gap: '8px' }}>
        <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>eevolvv</Link>
        <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
        <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>os</Link>
        <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
        <span style={{ ...MONO, fontSize: '11px', color: 'var(--paper)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{client.company}</span>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Client header */}
        <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '16px' }}>← os</Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '2rem', lineHeight: 1.1, margin: '0 0 6px' }}>{client.company}</h1>
              <div style={{ opacity: 0.6, fontSize: '14px' }}>{client.name}{client.email ? ` · ${client.email}` : ''}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {client.contract_value && (
                <span style={{ ...MONO, fontSize: '13px', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '2px' }}>
                  ${client.contract_value.toLocaleString()}
                </span>
              )}
              {/* Health selector */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['green','yellow','red'] as const).map(h => (
                  <button key={h} onClick={() => patchClient({ health: h }, `Health changed to ${h}`)} style={{ width: '16px', height: '16px', borderRadius: '50%', background: h === 'green' ? '#4ade80' : h === 'yellow' ? '#f59e0b' : 'var(--accent)', border: client.health === h ? '2px solid var(--paper)' : '2px solid transparent', cursor: 'pointer', padding: 0 }} title={h} />
                ))}
              </div>
              {/* Stage selector */}
              <div style={{ display: 'flex', gap: '0' }}>
                {STAGES.map((s, i) => {
                  const active = STAGES.indexOf(client.stage)
                  const isCurrent = s === client.stage
                  const isPast = i < active
                  return (
                    <button key={s} onClick={() => patchClient({ stage: s }, `Stage changed to ${s}`)} style={{ ...MONO, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', background: isCurrent ? 'var(--accent)' : isPast ? 'rgba(var(--accent-rgb, 140,43,26),0.3)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRight: i < STAGES.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)', color: isCurrent ? 'var(--paper)' : 'rgba(250,247,240,0.5)', cursor: 'pointer' }}>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="ws-grid">
          {/* LEFT COLUMN */}
          <div>
            {/* AGENTS */}
            <div className="ws-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <SectionLabel n="A" label="AGENTS" />
                <button className="ws-btn" onClick={() => setShowAddAgent(v => !v)} style={{ color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '3px 8px' }}>+ add agent</button>
              </div>

              {showAddAgent && (
                <div style={{ ...CARD, marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {([
                    { k: 'name', l: 'Name', p: 'QA Bot' },
                    { k: 'description', l: 'Description', p: 'Automates test runs' },
                    { k: 'repo_url', l: 'Repo URL', p: 'https://github.com/...' },
                    { k: 'deploy_url', l: 'Deploy URL', p: 'https://...' },
                    { k: 'integrations', l: 'Integrations (comma-sep)', p: 'Slack, GitHub' },
                  ] as const).map(({ k, l, p }) => (
                    <div key={k} style={{ gridColumn: k === 'integrations' ? '1 / -1' : undefined }}>
                      <div style={MONO_LABEL}>{l}</div>
                      <input value={agentForm[k as keyof typeof agentForm]} onChange={e => setAgentForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={INPUT} />
                    </div>
                  ))}
                  <div>
                    <div style={MONO_LABEL}>Type</div>
                    <select value={agentForm.type} onChange={e => setAgentForm(f => ({ ...f, type: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                      {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Status</div>
                    <select value={agentForm.status} onChange={e => setAgentForm(f => ({ ...f, status: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                      {['dev','staging','live','paused','error'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    <button onClick={() => setShowAddAgent(false)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                    <button onClick={submitAgent} disabled={agentSubmitting} style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '5px 14px', cursor: 'pointer', borderRadius: '2px' }}>{agentSubmitting ? 'saving…' : 'add agent'}</button>
                  </div>
                </div>
              )}

              {agents.length === 0 && !showAddAgent && (
                <div style={{ ...MONO, fontSize: '12px', opacity: 0.35, padding: '20px 0' }}>No agents yet</div>
              )}

              {agents.map(a => (
                <div key={a.id} className="agent-card">
                  {editingAgent === a.id ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {(['name','type','status','repo_url','deploy_url'] as const).map(k => (
                        <div key={k}>
                          <div style={MONO_LABEL}>{k.replace('_',' ')}</div>
                          {k === 'type' ? (
                            <select value={(editAgentForm[k] ?? a[k]) as string} onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              {AGENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          ) : k === 'status' ? (
                            <select value={(editAgentForm[k] ?? a[k]) as string} onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value as Agent['status'] }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              {['dev','staging','live','paused','error'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <input value={(editAgentForm[k] ?? a[k] ?? '') as string} onChange={e => setEditAgentForm(f => ({ ...f, [k]: e.target.value }))} style={INPUT} />
                          )}
                        </div>
                      ))}
                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                        <button onClick={() => setEditingAgent(null)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                        <button onClick={() => saveAgentEdit(a.id)} style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '4px 12px', cursor: 'pointer', borderRadius: '2px' }}>save</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{a.name}</span>
                          {a.type && <span style={{ ...MONO, fontSize: '10px', opacity: 0.5 }}>{a.type}</span>}
                          <StatusBadge status={a.status} />
                          <HealthDot health={a.health} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditingAgent(a.id); setEditAgentForm({}) }} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>✎</button>
                          <button onClick={() => deleteAgent(a.id, a.name)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                          <Link href={`/os/clients/${client.id}/agents/${a.id}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', opacity: 0.8 }}>→ build</Link>
                        </div>
                      </div>
                      {a.description && <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>{a.description}</div>}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {(a.integrations ?? []).map(i => <span key={i} className="chip">{i}</span>)}
                        {a.repo_url && <a href={a.repo_url} target="_blank" rel="noopener noreferrer" style={{ ...MONO, fontSize: '11px', color: 'var(--accent)', marginLeft: '4px' }}>repo →</a>}
                        {a.deploy_url && <a href={a.deploy_url} target="_blank" rel="noopener noreferrer" style={{ ...MONO, fontSize: '11px', color: 'var(--accent)' }}>deploy →</a>}
                        {a.last_run_at && <span style={{ ...MONO, fontSize: '10px', opacity: 0.35, marginLeft: 'auto' }}>last run {relativeTime(a.last_run_at)}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* SERVICE TASKS */}
            <div className="ws-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <SectionLabel n="B" label="SERVICE TASKS" />
                <button className="ws-btn" onClick={() => setShowAddTask(v => !v)} style={{ color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '3px 8px' }}>+ add task</button>
              </div>

              {showAddTask && (
                <div style={{ ...CARD, marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={MONO_LABEL}>Title</div>
                    <input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title…" style={INPUT} onKeyDown={e => e.key === 'Enter' && submitTask()} autoFocus />
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Priority</div>
                    <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                      {['high','normal','low'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Due date</div>
                    <input type="date" value={taskForm.due_date} onChange={e => setTaskForm(f => ({ ...f, due_date: e.target.value }))} style={INPUT} />
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Category</div>
                    <select value={taskForm.category} onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                      {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Agent</div>
                    <select value={taskForm.agent_id} onChange={e => setTaskForm(f => ({ ...f, agent_id: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
                      <option value="">— no agent —</option>
                      {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={MONO_LABEL}>Est hrs</div>
                    <input type="number" min="0" step="0.5" value={taskForm.estimated_hrs} onChange={e => setTaskForm(f => ({ ...f, estimated_hrs: e.target.value }))} placeholder="0" style={INPUT} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAddTask(false)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                    <button onClick={submitTask} style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '4px 12px', cursor: 'pointer', borderRadius: '2px' }}>add</button>
                  </div>
                </div>
              )}

              {[
                { label: 'IN PROGRESS', items: inProgress },
                { label: 'BLOCKED', items: blocked },
                { label: 'TODO', items: todo },
              ].map(({ label, items }) => items.length > 0 && (
                <div key={label} style={{ marginBottom: '20px' }}>
                  <div style={{ ...MONO_LABEL, marginBottom: '8px' }}>{label}</div>
                  {items.map(t => (
                    <div key={t.id}>
                      <div className="task-row" onClick={() => { setExpandedTask(expandedTask === t.id ? null : t.id); setEditTaskForm({ title: t.title, description: t.description, due_date: t.due_date, priority: t.priority, status: t.status, agent_id: t.agent_id, category: t.category, estimated_hrs: t.estimated_hrs, blocked_reason: t.blocked_reason }) }}>
                        <PriorityDot priority={t.priority} />
                        <span style={{ flex: 1, fontSize: '14px' }}>{t.title}</span>
                        {t.category && t.category !== 'general' && (
                          <span style={{ ...MONO, fontSize: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', padding: '1px 5px', opacity: 0.7 }}>
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
                              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '1px 8px', textDecoration: 'none', opacity: 0.8 }}
                            >
                              {agent.name}
                            </Link>
                          )
                        })()}
                        {t.due_date && <span style={{ ...MONO, fontSize: '10px', opacity: 0.4 }}>{t.due_date}</span>}
                        <button onClick={e => { e.stopPropagation(); cycleTaskStatus(t) }} style={{ ...MONO, fontSize: '10px', border: `1px solid ${taskBadgeColor(t.status)}`, color: taskBadgeColor(t.status), background: 'none', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer' }}>{t.status.replace('_',' ')}</button>
                        <button
                          onClick={async e => {
                            e.stopPropagation()
                            if (!window.confirm(`Delete "${t.title}"?`)) return
                            const res = await fetch(`/api/os/clients/${client.id}/tasks/${t.id}`, { method: 'DELETE' })
                            if (res.ok) setTasks(prev => prev.filter(task => task.id !== t.id))
                          }}
                          style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                          title="Delete task"
                        >✕</button>
                      </div>
                      {expandedTask === t.id && (
                        <div style={{ ...CARD, marginBottom: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <div style={MONO_LABEL}>Title</div>
                            <input value={editTaskForm.title ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, title: e.target.value }))} style={INPUT} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <div style={MONO_LABEL}>Description</div>
                            <textarea value={editTaskForm.description ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, description: e.target.value }))} style={{ ...INPUT, resize: 'vertical', minHeight: '60px' }} />
                          </div>
                          <div>
                            <div style={MONO_LABEL}>Due date</div>
                            <input type="date" value={editTaskForm.due_date ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, due_date: e.target.value }))} style={INPUT} />
                          </div>
                          <div>
                            <div style={MONO_LABEL}>Priority</div>
                            <select value={editTaskForm.priority ?? 'normal'} onChange={e => setEditTaskForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              {['high','normal','low'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                          <div>
                            <div style={MONO_LABEL}>Status</div>
                            <select value={editTaskForm.status ?? 'todo'} onChange={e => setEditTaskForm(f => ({ ...f, status: e.target.value as Task['status'] }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              {TASK_STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                            </select>
                          </div>
                          <div>
                            <div style={MONO_LABEL}>Category</div>
                            <select value={editTaskForm.category ?? 'general'} onChange={e => setEditTaskForm(f => ({ ...f, category: e.target.value as Task['category'] }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <div style={MONO_LABEL}>Agent</div>
                            <select value={editTaskForm.agent_id ?? ''} onChange={e => setEditTaskForm(f => ({ ...f, agent_id: e.target.value || null }))} style={{ ...INPUT, cursor: 'pointer' }}>
                              <option value="">— no agent —</option>
                              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                          </div>
                          {editTaskForm.status === 'blocked' && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={MONO_LABEL}>Blocked reason</div>
                              <textarea
                                value={editTaskForm.blocked_reason ?? ''}
                                onChange={e => setEditTaskForm(f => ({ ...f, blocked_reason: e.target.value }))}
                                placeholder="Why is this blocked?"
                                style={{ ...INPUT, resize: 'vertical', minHeight: '60px' }}
                              />
                            </div>
                          )}
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setExpandedTask(null)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                            <button onClick={() => saveTaskEdit(t.id)} style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '4px 12px', cursor: 'pointer', borderRadius: '2px' }}>save</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {done.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button onClick={() => setShowDone(v => !v)} style={{ ...MONO_LABEL, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,247,240,0.4)' }}>DONE ({done.length}) {showDone ? '▲' : '▼'}</button>
                  {showDone && done.map(t => (
                    <div key={t.id} className="task-row" style={{ opacity: 0.5 }}>
                      <PriorityDot priority={t.priority} />
                      <span style={{ flex: 1, fontSize: '14px', textDecoration: 'line-through' }}>{t.title}</span>
                      <span style={{ ...MONO, fontSize: '10px', color: '#4ade80', border: '1px solid #4ade80', borderRadius: '4px', padding: '1px 6px' }}>done</span>
                    </div>
                  ))}
                </div>
              )}

              {tasks.length === 0 && !showAddTask && (
                <div style={{ ...MONO, fontSize: '12px', opacity: 0.35, padding: '16px 0' }}>No tasks yet</div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* LINKED DIAGNOSTIC */}
            <div className="ws-section">
              <SectionLabel n="C" label="LINKED DIAGNOSTIC" />
              {linkedSub ? (
                <div style={{ ...CARD }}>
                  <div style={{ ...MONO, fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{linkedSub.business_name ?? linkedSub.name ?? 'Submission'}</div>
                  <div style={{ ...MONO, fontSize: '11px', opacity: 0.5, marginBottom: '4px' }}>{linkedSub.business_type} · {linkedSub.tier ?? '—'}</div>
                  <div style={{ ...MONO, fontSize: '11px', opacity: 0.4 }}>{relativeTime(linkedSub.created_at)}</div>
                  <button onClick={() => patchClient({ submission_id: null })} style={{ ...MONO, fontSize: '10px', color: 'rgba(250,247,240,0.3)', background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px' }}>unlink</button>
                </div>
              ) : linkingSubmission ? (
                <div style={{ ...CARD }}>
                  <div style={MONO_LABEL}>Select submission</div>
                  <select value={selectedSubmission} onChange={e => setSelectedSubmission(e.target.value)} style={{ ...INPUT, marginBottom: '10px', cursor: 'pointer' }}>
                    <option value="">— choose —</option>
                    {allSubmissions.map(s => <option key={s.id} value={s.id}>{s.business_name ?? s.name ?? s.email} · {relativeTime(s.created_at)}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setLinkingSubmission(false)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>cancel</button>
                    <button onClick={linkSubmission} style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', color: 'var(--paper)', background: 'var(--accent)', border: 'none', padding: '4px 12px', cursor: 'pointer', borderRadius: '2px' }}>link</button>
                  </div>
                </div>
              ) : (
                <div style={{ ...MONO, fontSize: '12px', opacity: 0.35, padding: '12px 0' }}>
                  No linked diagnostic —{' '}
                  <button onClick={() => setLinkingSubmission(true)} style={{ ...MONO, fontSize: '12px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>link submission</button>
                </div>
              )}
            </div>

            {/* NOTES */}
            <div className="ws-section">
              <SectionLabel n="D" label="NOTES" />
              <div style={{ background: 'rgba(20,20,19,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '14px' }}>
                <textarea
                  value={client.notes ?? ''}
                  onChange={e => handleNotesChange(e.target.value)}
                  placeholder="Client notes…"
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.9, outline: 'none', resize: 'vertical', minHeight: '120px' }}
                />
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="ws-section">
              <SectionLabel n="E" label="ACTIVITY LOG" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', maxHeight: '280px', overflowY: 'auto' }}>
                {activity.length === 0 && <div style={{ ...MONO, fontSize: '11px', opacity: 0.3 }}>No activity yet</div>}
                {activity.map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ ...MONO, fontSize: '10px', opacity: 0.35, flexShrink: 0, paddingTop: '2px' }}>{relativeTime(e.created_at)}</span>
                    <span style={{ fontSize: '13px', opacity: 0.8 }}>{e.action}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={manualLog} onChange={e => setManualLog(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitManualLog()} placeholder="+ log entry…" style={{ ...INPUT, flex: 1 }} />
                <button onClick={submitManualLog} style={{ ...MONO, fontSize: '11px', color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '4px 10px', cursor: 'pointer', borderRadius: '2px' }}>log</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

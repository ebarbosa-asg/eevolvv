# Task Brief: T05

**Title:** Agent Builder — page + 6-step wizard
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 9/10
**Model:** opus
**Wave:** 3
**Dependencies:** T03

---

## Objective

Build a new full-page 6-step wizard at `/os/clients/[id]/agents/[agentId]` that lets Eduardo configure and deploy a client agent. Create two new files: a server component `page.tsx` that fetches agent + client data, and a client component `AgentBuilder.tsx` that renders the complete wizard UI.

---

## Context

**Parent Feature:** eevolvv OS — Tasks Area + Agent Builder

The eevolvv internal OS (`/os`) manages clients and their automation agents. Each agent is a record in the `agents` Supabase table. Currently, agents can only be created and edited via a basic inline form inside `ClientWorkspace.tsx`. There is no dedicated agent page.

This task creates the full agent builder experience: a dedicated route with a persistent left-rail step navigator and step-by-step content panels covering identity, AI instructions, integrations, trigger configuration, review, and deployment.

The builder is accessed via the `→ build` link added to agent cards in T06 (and anticipated in T04's agent pill). The URL pattern is `/os/clients/[id]/agents/[agentId]`.

A critical prerequisite: `GET /api/os/clients/[id]/agents/[agentId]` does not exist yet. The `page.tsx` server component needs it — but since `page.tsx` is a Next.js server component that directly uses `supabase` (not the API route), it bypasses this gap. The PATCH route (`/api/os/clients/[id]/agents/[agentId]`) already exists and can be used from the client component.

Design system: matches `ClientWorkspace.tsx` exactly — same design tokens, same component patterns. No Tailwind. All inline styles.

This task is part of **Wave 3**. It depends on T03 (the GET agent route must exist before this page can load agent data). The `page.tsx` server component queries Supabase directly rather than via the API route, but T03's existence confirms the agents table schema is finalized and the relevant route infrastructure is in place.

---

## Research Context

### Patterns to Follow

- **Design tokens** (from `app/globals.css` and used throughout ClientWorkspace.tsx):
  - Background: `var(--ink)` = `#141413`
  - Text: `var(--paper)` = `#faf7f0`
  - Accent: `var(--accent)` = `oklch(0.45 0.13 25)` (brick red, ~`#8C2B1A`)
  - Status green: `#4ade80`
  - Status amber: `#f59e0b`
  - Status indigo: `#6366f1`

- **Shared style constants** (copy directly from ClientWorkspace.tsx lines 11–14 — do NOT import, just redeclare in AgentBuilder.tsx):
  ```ts
  const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '2px' } as const
  const MONO = { fontFamily: 'JetBrains Mono, monospace' } as const
  const MONO_LABEL = { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', opacity: 0.4, marginBottom: '6px' }
  const INPUT = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' } as const
  ```

- **Section labels**: JetBrains Mono 11px uppercase 0.2em tracking, `color: 'var(--accent)'` — same `§ N · LABEL` format
- **Section left-border**: `borderLeft: '3px solid var(--accent)'`
- **Topbar breadcrumb**: matches ClientWorkspace.tsx lines 244–250 exactly — sticky, blurred, 52px tall
- **Supabase import**: `import { supabase } from '@/lib/supabase'` — only in server components
- **notFound import**: `import { notFound } from 'next/navigation'` — only in page.tsx
- **Link import**: `import Link from 'next/link'`

### Known Issues to Address

- `GET /api/os/clients/[id]/agents/[agentId]` does not exist. The `page.tsx` server component must query Supabase directly (not via the API route) — this is the standard Next.js App Router pattern for server components.
- The `agents` table has new columns (`trigger_type`, `trigger_config`, `instructions`, `config`, `version`) that may not be reflected in the current TypeScript types used in ClientWorkspace. Define a local `AgentFull` type in `page.tsx` and `AgentBuilder.tsx` that includes all required fields.
- No external date library available — use native JS Date math for "Next 3 runs" computation.

### Recommended Approach

- 6-step wizard: manage current step as `useState<number>(1)` (1–6)
- Step completion: a step is "complete" when its primary required field is filled in. Use a helper `isStepComplete(step: number): boolean` that checks wizard state.
- Save on each "Save & Continue": PATCH `/api/os/clients/{clientId}/agents/{agentId}` with step-specific fields, then advance step
- Each step is a separate render branch inside the right-content area
- No external wizard library — plain conditional rendering
- Cron "Next 3 runs": only needed for Schedule trigger. Compute with `new Date()` + simple arithmetic — no cron parser library. Approximations are fine.
- UUID for webhook token: `crypto.randomUUID()` (available in all modern browsers)

---

## Requirements

### File 1: `app/os/clients/[id]/agents/[agentId]/page.tsx`

This is a Next.js App Router **server component** (no `'use client'`).

```typescript
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AgentBuilder from './AgentBuilder'

export default async function AgentBuilderPage({
  params,
}: {
  params: { id: string; agentId: string }
}) {
  if (!supabase) notFound()
  const [agentRes, clientRes] = await Promise.all([
    supabase
      .from('agents')
      .select('*')
      .eq('id', params.agentId)
      .eq('client_id', params.id)
      .single(),
    supabase
      .from('clients')
      .select('id, name, company')
      .eq('id', params.id)
      .single(),
  ])
  if (agentRes.error || clientRes.error) notFound()
  return <AgentBuilder agent={agentRes.data} client={clientRes.data} />
}
```

### File 2: `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx`

Full spec below.

#### `'use client'` directive

Must be at the top of the file.

#### Types

Define locally (do not import from ClientWorkspace):

```typescript
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
  // New fields (from DB migration)
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
```

#### Props

```typescript
export default function AgentBuilder({ agent, client }: { agent: AgentFull; client: ClientBrief })
```

#### Top-level wizard state

```typescript
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
// Schedule config
const [scheduleFreq, setScheduleFreq] = useState<'15min' | 'hourly' | 'daily' | 'weekly' | 'custom'>('daily')
const [scheduleTime, setScheduleTime] = useState('09:00')
const [scheduleTz, setScheduleTz] = useState('UTC')
const [scheduleDays, setScheduleDays] = useState<string[]>(['Mon'])
const [customCron, setCustomCron] = useState('')
// Webhook config
const [webhookMethod, setWebhookMethod] = useState<'POST' | 'GET' | 'PUT'>('POST')
const [webhookAuth, setWebhookAuth] = useState<'none' | 'bearer' | 'hmac'>('none')
const [webhookToken] = useState<string>(() => crypto.randomUUID())
const [showToken, setShowToken] = useState(false)
const [webhookSecret] = useState<string>(() => crypto.randomUUID())
const [showSecret, setShowSecret] = useState(false)

// Step 5 — no state (read-only review)
// Step 6 — DEPLOY
const [agentStatus, setAgentStatus] = useState(agent.status)
```

#### Constants

```typescript
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
```

#### isStepComplete helper

```typescript
function isStepComplete(s: number): boolean {
  if (s === 1) return name.trim().length > 0
  if (s === 2) return instructions.trim().length > 0
  if (s === 3) return true // integrations are optional
  if (s === 4) return true // trigger always has a value
  if (s === 5) return true
  return false
}
```

#### saveStep helper

Saves current step data and advances. Returns `false` if save fails (show no error modal — just don't advance).

```typescript
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
      ? { method: webhookMethod, auth: webhookAuth }
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
```

#### computeNextRuns helper

For the Schedule trigger's "Next 3 runs" preview. Use only JS Date math.

```typescript
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
```

#### triggerSentence helper

For the REVIEW step:
```typescript
function triggerSentence(): string {
  if (triggerType === 'manual') return 'run on demand'
  if (triggerType === 'webhook') return `triggered by ${webhookMethod} webhook`
  if (scheduleFreq === 'daily') return `run daily at ${scheduleTime} ${scheduleTz}`
  if (scheduleFreq === 'weekly') return `run weekly on ${scheduleDays.join(', ')} at ${scheduleTime} ${scheduleTz}`
  if (scheduleFreq === 'hourly') return 'run every hour'
  if (scheduleFreq === '15min') return 'run every 15 minutes'
  return `run on custom cron: ${customCron}`
}
```

#### Root layout

```tsx
return (
  <div style={{ background: 'var(--ink)', color: 'var(--paper)', minHeight: '100vh', fontFamily: 'Space Grotesk, sans-serif' }}>
    {/* Topbar */}
    {/* ... breadcrumb ... */}

    <div style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
      {/* Left rail — step navigator */}
      {/* ... */}

      {/* Right content — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 40px' }}>
        {/* Step content */}
      </div>
    </div>
  </div>
)
```

#### Topbar

Match ClientWorkspace.tsx topbar (lines 244–250) exactly, but with breadcrumb:
`eevolvv / os / {client.company} / {agent.name}`

```tsx
<div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(20,20,19,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', height: '52px', gap: '8px' }}>
  <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>eevolvv</Link>
  <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
  <Link href="/os" style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>os</Link>
  <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
  <Link href={`/os/clients/${client.id}`} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{client.company}</Link>
  <span style={{ opacity: 0.25, ...MONO, fontSize: '11px' }}>/</span>
  <span style={{ ...MONO, fontSize: '11px', color: 'var(--paper)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name || agent.name}</span>
</div>
```

#### Left rail — step navigator (200px)

```tsx
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
```

#### Step content header

Each step content area should start with:
```tsx
<div style={{ ...MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '24px' }}>
  § 0{step} · {STEPS[step - 1].label}
</div>
```

#### Step 1 — IDENTITY

```tsx
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
```

#### Step 2 — INSTRUCTIONS

```tsx
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

  {/* Collapsible helper */}
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
```

#### Step 3 — INTEGRATIONS

```tsx
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
```

#### Step 4 — TRIGGER

**3-card picker:**

```tsx
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

  {/* Config panel below the picker */}
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

      {/* Next 3 runs preview */}
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
```

#### Step 5 — REVIEW

```tsx
<div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
  {/* Synthesized sentence */}
  <div style={{ background: 'rgba(8,8,8,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '14px 16px', ...MONO, fontSize: '13px', lineHeight: 1.8, color: 'var(--paper)' }}>
    → This agent will {triggerSentence()} using {selectedIntegrations.length > 0 ? selectedIntegrations.join(', ') : 'no external integrations'} to {description || 'complete tasks'}.
  </div>

  {/* IDENTITY */}
  {renderReviewSection('IDENTITY', 1, [
    ['Name', name],
    ['Type', type],
    ['Description', description || '—'],
  ])}

  {/* INSTRUCTIONS */}
  {renderReviewSection('INSTRUCTIONS', 2, [
    ['System prompt', (instructions.slice(0, 120) + (instructions.length > 120 ? '…' : '')) || '—'],
  ])}

  {/* INTEGRATIONS */}
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

  {/* TRIGGER */}
  {renderReviewSection('TRIGGER', 4, [
    ['Type', triggerType],
    ['Config', triggerSentence()],
  ])}
</div>
```

**renderReviewSection helper** (define inside the component):

```typescript
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
```

#### Step 6 — DEPLOY

Current stage logic: `agentStatus === 'dev'` → DEV is active, `'staging'` → STAGING is active, `'live'` → LIVE is active.

```tsx
<div style={{ maxWidth: '760px' }}>
  <div style={{ display: 'flex', gap: '16px' }}>
    {[
      {
        key: 'dev',
        label: 'DEV',
        borderColor: '#6366f1',
        nextStatus: 'staging' as const,
        promoteLabel: '→ Stage',
        showTest: true,
      },
      {
        key: 'staging',
        label: 'STAGING',
        borderColor: '#f59e0b',
        nextStatus: 'live' as const,
        promoteLabel: '→ Live',
        showTest: false,
      },
      {
        key: 'live',
        label: 'LIVE',
        borderColor: '#4ade80',
        nextStatus: null,
        promoteLabel: null,
        showTest: false,
      },
    ].map(stage => {
      const isActive = agentStatus === stage.key
      const isLive = stage.key === 'live'
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
                style={{ ...MONO, fontSize: '11px', background: stage.borderColor === '#4ade80' ? '#4ade80' : 'none', border: `1px solid ${stage.borderColor}`, padding: '4px 10px', cursor: 'pointer', borderRadius: '2px', color: stage.borderColor }}
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
```

#### Navigation buttons (bottom of right content)

```tsx
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
```

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `app/os/clients/[id]/agents/[agentId]/page.tsx` created — server component, fetches agent + client via Supabase, passes to `AgentBuilder`
- [ ] `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` created — `'use client'` component
- [ ] `AgentFull` type includes all new DB fields: `trigger_type`, `trigger_config`, `instructions`, `estimated_output`, `config`, `version`, `run_count`, `error_count`
- [ ] `AgentFull` type includes `estimated_output`, `run_count`, `error_count`
- [ ] Layout: fixed 200px left rail + scrollable right content at full viewport height
- [ ] Topbar breadcrumb: `eevolvv / os / {company} / {agentName}` with correct Links
- [ ] Left rail shows all 6 steps as `§ 01 · LABEL` in JetBrains Mono
- [ ] Active step has `3px solid var(--accent)` left border
- [ ] Complete steps have filled dot (accent color); incomplete steps have dim dot
- [ ] Clicking any step in the navigator navigates to that step
- [ ] Step 1 — IDENTITY: name (pre-filled), type select, description textarea
- [ ] Step 2 — INSTRUCTIONS: system prompt textarea with code-editor styling, character counter, collapsible helper panel
- [ ] Step 3 — INTEGRATIONS: all 15 integration chips rendered, toggle selection on click, selected = accent border + background
- [ ] Step 4 — TRIGGER: 3-card picker for manual/schedule/webhook
- [ ] Step 4 Schedule: frequency select, time+timezone for daily/weekly, day checkboxes for weekly, custom cron input, "Next 3 runs" preview (hidden for custom)
- [ ] Step 4 Webhook: read-only URL `https://os.eevolvv.ai/hooks/{agent.id}` + copy button, method select, auth radio (none/bearer/hmac), bearer token reveal toggle, HMAC secret reveal toggle
- [ ] Step 5 — REVIEW: synthesized sentence in terminal block, read-only sections for all 4 prior steps, "← edit" links per section
- [ ] Step 6 — DEPLOY: 3 horizontal cards DEV/STAGING/LIVE with correct border colors (#6366f1/#f59e0b/#4ade80), active stage derived from `agent.status`
- [ ] Step 6 promote buttons: "→ Stage" from DEV, "→ Live" from STAGING (with `window.confirm`), PATCHes agent status, updates local state
- [ ] "Save & Continue →" button PATCHes agent at `/api/os/clients/{clientId}/agents/{agentId}` with step-specific fields
- [ ] Step 5 (REVIEW) does not PATCH — just advances to step 6
- [ ] Step 6 "Done" button is a Link to `/os/clients/{id}`
- [ ] "← Back" button appears on steps 2–6, not on step 1
- [ ] No Tailwind classes anywhere
- [ ] All inline styles only
- [ ] `npx tsc --noEmit` passes with zero errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/os/clients/[id]/agents/[agentId]/page.tsx` | create | Server component — fetches agent + client, renders AgentBuilder |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | create | Client component — full 6-step wizard |

### File Ownership Notes

These are all-new files in a new directory. No conflicts with T04 or T06. T06 adds links pointing to this route — T05 must be merged before T06's links become functional, but the Link hrefs are valid regardless.

---

## Implementation Guidance

### Patterns to Follow

- Supabase import in `page.tsx`: `import { supabase } from '@/lib/supabase'`. This is consistent with how other server components in the OS work.
- The `page.tsx` pattern mirrors how `app/os/clients/[id]/page.tsx` works (it fetches a client and passes to a client component). Follow the same pattern.
- Style constants: copy from ClientWorkspace.tsx, do NOT import. The components are in different modules.
- `crypto.randomUUID()` is available in all modern browsers without any import. Use it for webhook token + secret on mount via `useState(() => crypto.randomUUID())`.
- `navigator.clipboard.writeText()` for the copy button — no try/catch needed for this internal tool.

### Code Style

- All styles inline — never add a CSS class except for the pre-existing `ws-section`, `ws-card`, etc. that exist in ClientWorkspace CSS injection. Since this is a new page, define any needed CSS as a template literal or just use inline styles throughout.
- Use `as const` on the constant arrays.
- Type the step navigate state as `number` — `useState<number>(1)`.
- `AgentFull` type uses `Record<string, unknown>` for JSONB fields, not `any`.

### Edge Cases

- Agent may have `null` for new fields (trigger_type, instructions, etc.) — all state initializers use `?? ''` or `?? 'manual'` or `?? []` to handle nulls safely.
- `version` may be null — guard the version display: `{agent.version && <div>v{agent.version}</div>}`.
- The save on step 6 (promote) is handled separately by the promote button's own handler, not by `saveStep`. The `saveStep` function skips saving on step 5 (review) and the navigation buttons on step 6 show a `Link` instead of a save button.
- TypeScript may warn about `stage.nextStatus!` being possibly null in the promote handler — the conditional `isActive && stage.promoteLabel` already guards this, but use non-null assertion `!` on `stage.nextStatus` since the button is only rendered when `promoteLabel` is set (and therefore `nextStatus` is not null).

### Testing Requirements

No automated tests. Manual verification:
1. `npx tsc --noEmit` — zero errors
2. Navigate to `/os/clients/{id}/agents/{agentId}` — page loads with correct agent name in breadcrumb
3. Click through all 6 steps — each renders its content
4. Fill step 1, click "Save & Continue" — PATCH fires in network tab with `{name, type, description}`, step advances to 2
5. Step 3 — click a chip — it toggles selected/unselected state
6. Step 4 — select "Schedule" card — frequency/time options appear; "Next 3 runs" shows dates
7. Step 4 — select "Webhook" card — URL shows agent.id in path, copy button works, auth options toggle
8. Step 5 — synthesized sentence reads correctly, "← edit" links navigate to correct step
9. Step 6 — correct stage card is highlighted based on agent.status

---

## Boundaries

### Files You MUST NOT Touch

- `app/globals.css`
- `app/os/HubClient.tsx`
- `app/os/clients/[id]/ClientWorkspace.tsx`
- Any existing API route files

### Files Requiring Review

None — all-new files only.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T03 | Adds `GET /api/os/clients/[id]/agents/[agentId]` route; confirms agents table schema with new columns is finalized | Confirm `app/api/os/clients/[id]/agents/[agentId]/route.ts` exists and returns agent data |

**Before starting:** Verify T03 is merged. The `page.tsx` server component queries Supabase directly (not via the API route), but T03's completion confirms the underlying schema and infrastructure are stable.

### Downstream Impact

Tasks that depend on this one:
- **T06** — adds `→ build` links pointing to the route created by this task. T06 can be written in parallel; the links become functional once T05 is deployed.

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T05`
**Target:** Feature branch or main, determined by PM Agent

---

## Commit Guidelines

```
feat(os): add agent builder page with 6-step wizard

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] Both new files created in correct directory
- [ ] No Tailwind classes
- [ ] No modifications to existing files
- [ ] Dev server renders `/os/clients/[id]/agents/[agentId]` without runtime errors
- [ ] Branch rebased on target branch

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T05 | Wave: 3*

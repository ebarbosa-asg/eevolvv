# Brief: T05 — Feature: Shareable Client Run Page /run/[shareToken]

**Task ID:** T05  
**Wave:** 3  
**Complexity:** 4  
**Model:** sonnet  
**Dependencies:** T03  

---

## Context

This is a Next.js 14 App Router project. The public share page lives outside the `/os/` workspace — it's a client-facing page at `/run/[shareToken]`. No auth required. The `share_token` UUID on the `agents` table is the auth mechanism (unguessable UUID = sufficient for V1).

The Supabase client is at `lib/supabase.ts`. The execution engine is at `POST /api/os/clients/[id]/agents/[agentId]/run`. A new public execution endpoint is needed that resolves agent via `share_token` instead of requiring `client_id` in the URL.

Design: clean, not OS-branded. Dark background (`#0a0a0a`), white text. Space Grotesk body font. The output has two views: **Brief** (formatted, rendered markdown-like) and **Raw** (monospace pre).

---

## Files to Create

### File 1: `app/run/[shareToken]/page.tsx` (server component)

```typescript
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import RunPage from './RunPage'

export default async function SharePage({
  params,
}: {
  params: { shareToken: string }
}) {
  if (!supabase) notFound()

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, name, description, share_token, client_id')
    .eq('share_token', params.shareToken)
    .single()

  if (agentErr || !agent) notFound()

  const { data: latestRun } = await supabase
    .from('agent_runs')
    .select('id, status, output, output_summary, created_at, latency_ms')
    .eq('agent_id', agent.id)
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <RunPage
      agentId={agent.id}
      agentName={agent.name}
      agentDescription={agent.description}
      shareToken={params.shareToken}
      initialOutput={latestRun?.output ?? null}
      initialCreatedAt={latestRun?.created_at ?? null}
    />
  )
}
```

### File 2: `app/run/[shareToken]/RunPage.tsx` (client component)

```typescript
'use client'

import { useState } from 'react'

type Props = {
  agentId: string
  agentName: string
  agentDescription: string | null
  shareToken: string
  initialOutput: string | null
  initialCreatedAt: string | null
}

export default function RunPage({
  agentName,
  agentDescription,
  shareToken,
  initialOutput,
  initialCreatedAt,
}: Props) {
  const [output, setOutput] = useState<string | null>(initialOutput)
  const [createdAt, setCreatedAt] = useState<string | null>(initialCreatedAt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'brief' | 'raw'>('brief')

  async function runAgent() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/run/${shareToken}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Run failed')
      setOutput(data.output)
      setCreatedAt(new Date().toISOString())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function formatRelativeTime(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }

  function renderBrief(text: string) {
    // Simple markdown-like renderer — no external lib
    const paragraphs = text.split(/\n\n+/)
    return paragraphs.map((para, i) => {
      if (para.startsWith('# ')) {
        return <h1 key={i} style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, marginTop: i > 0 ? 32 : 0 }}>{para.slice(2)}</h1>
      }
      if (para.startsWith('## ')) {
        return <h2 key={i} style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, marginTop: i > 0 ? 24 : 0 }}>{para.slice(3)}</h2>
      }
      if (para.startsWith('### ')) {
        return <h3 key={i} style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, marginTop: i > 0 ? 20 : 0 }}>{para.slice(4)}</h3>
      }
      // Bullet list
      if (para.includes('\n- ') || para.startsWith('- ')) {
        const items = para.split('\n').filter(l => l.startsWith('- '))
        return (
          <ul key={i} style={{ paddingLeft: 20, marginBottom: 16 }}>
            {items.map((item, j) => (
              <li key={j} style={{ marginBottom: 6, lineHeight: 1.7, opacity: 0.85 }}>{item.slice(2)}</li>
            ))}
          </ul>
        )
      }
      return <p key={i} style={{ marginBottom: 16, lineHeight: 1.8, opacity: 0.85 }}>{para}</p>
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: 'Space Grotesk, sans-serif',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.3, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            powered by eevolvv
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, marginBottom: 8 }}>{agentName}</h1>
          {agentDescription && (
            <p style={{ fontSize: 15, opacity: 0.55, margin: 0 }}>{agentDescription}</p>
          )}
        </div>

        {/* Run button */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={runAgent}
            disabled={loading}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              padding: '12px 24px',
              background: loading ? 'rgba(255,255,255,0.1)' : '#fff',
              color: loading ? 'rgba(255,255,255,0.5)' : '#0a0a0a',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? '◌ Running...' : '▷ Run now'}
          </button>
          {error && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
              ✗ {error}
            </div>
          )}
        </div>

        {/* Output */}
        {output && (
          <div>
            {/* View toggle + timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['brief', 'raw'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      padding: '6px 14px',
                      background: view === v ? '#fff' : 'transparent',
                      color: view === v ? '#0a0a0a' : 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {createdAt && (
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.35 }}>
                  Updated {formatRelativeTime(createdAt)}
                </div>
              )}
            </div>

            {view === 'brief' ? (
              <div style={{ fontSize: 15, lineHeight: 1.8 }}>
                {renderBrief(output)}
              </div>
            ) : (
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 20,
                overflowX: 'auto',
              }}>
                {output}
              </pre>
            )}
          </div>
        )}

        {!output && !loading && (
          <div style={{ textAlign: 'center', opacity: 0.3, fontSize: 14, paddingTop: 40 }}>
            No runs yet. Click "Run now" to generate your first brief.
          </div>
        )}
      </div>
    </div>
  )
}
```

### File 3: `app/api/run/[shareToken]/route.ts` (public POST endpoint)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(
  _req: NextRequest,
  { params }: { params: { shareToken: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // Resolve agent by share_token
  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('*')
    .eq('share_token', params.shareToken)
    .single()
  if (agentErr || !agent) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Create run record
  const { data: run } = await supabase
    .from('agent_runs')
    .insert({ agent_id: agent.id, client_id: agent.client_id, status: 'pending', triggered_by: 'share_page' })
    .select()
    .single()
  if (!run) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 })

  try {
    await supabase.from('agent_runs').update({ status: 'running' }).eq('id', run.id)

    const { data: client } = await supabase
      .from('clients')
      .select('name, company, business_type, notes')
      .eq('id', agent.client_id)
      .single()

    const { data: tasks } = await supabase
      .from('tasks')
      .select('title, description, status, category')
      .eq('client_id', agent.client_id)
      .order('created_at', { ascending: true })

    const inputContext = {
      client: { name: client?.name ?? '', company: client?.company ?? '', business_type: client?.business_type ?? '', notes: client?.notes ?? '' },
      tasks: (tasks ?? []).map(t => ({ title: t.title, description: t.description, status: t.status, category: t.category })),
    }

    const systemPrompt = agent.instructions ?? 'You are a business intelligence agent. Analyze the provided business context and deliver actionable insights.'
    const lines = [
      `## Client: ${inputContext.client.name}`,
      inputContext.client.company ? `Company: ${inputContext.client.company}` : '',
      inputContext.client.industry ? `Industry: ${inputContext.client.industry}` : '',
      ``,
      `## Active Tasks (${inputContext.tasks.length})`,
      ...inputContext.tasks.map(t => `- [${t.status ?? 'open'}] ${t.title}${t.description ? `: ${t.description}` : ''}`),
    ].filter(Boolean).join('\n')

    const startMs = Date.now()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: lines }],
    })
    const latencyMs = Date.now() - startMs
    const output = message.content[0]?.type === 'text' ? message.content[0].text : ''

    await supabase.from('agent_runs').update({
      status: 'success',
      output,
      output_summary: output.slice(0, 500),
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      latency_ms: latencyMs,
      input_context: inputContext,
    }).eq('id', run.id)

    await supabase.from('agents').update({
      last_run_at: new Date().toISOString(),
      run_count: (agent.run_count ?? 0) + 1,
    }).eq('id', agent.id)

    return NextResponse.json({ output, outputSummary: output.slice(0, 500), latencyMs })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('agent_runs').update({ status: 'error', output: msg }).eq('id', run.id)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
```

---

## Acceptance Criteria

- `/run/[shareToken]` renders for valid share tokens, returns 404 for invalid
- Shows agent name, description, latest successful run output (if any)
- "Run now" button triggers execution and replaces output
- Brief/Raw toggle works — brief renders markdown-like, raw shows monospace
- Relative timestamp displayed
- No auth required — public route
- TypeScript compiles cleanly

---

## Notes

- The public run endpoint at `/api/run/[shareToken]` is intentionally separate from the OS endpoint — it resolves agent by share_token only, no client_id in URL
- The execution logic in T05's public endpoint duplicates T03 — this is intentional to keep them independent. A shared utility function can be extracted in a future refactor.
- Do NOT use any external markdown library — the inline `renderBrief` function is sufficient

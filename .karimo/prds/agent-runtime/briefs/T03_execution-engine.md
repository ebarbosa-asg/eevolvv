# Brief: T03 — API: Agent Execution Engine

**Task ID:** T03  
**Wave:** 2  
**Complexity:** 5  
**Model:** sonnet  
**Dependencies:** T01  

---

## Context

This is a Next.js 14 App Router API route. The project uses Anthropic SDK v0.91.1 (`@anthropic-ai/sdk`). Supabase client is at `lib/supabase.ts` (service role key, RLS bypass). Existing non-streaming Claude call pattern is in `app/api/diagnostic/route.ts`.

**Key patterns from codebase:**
- `const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` at module scope
- `anthropic.messages.create({ model: 'claude-sonnet-4-6', max_tokens: 4000, system: [...], messages: [...] })`
- System prompt with prompt caching: `[{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }]`
- Duration: `const startMs = Date.now()` before call, `Date.now() - startMs` after
- Token counts: `message.usage.input_tokens` / `message.usage.output_tokens`
- Supabase null guard: `if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })`
- Insert: `.insert(data).select().single()`
- Update: `.update(data).eq('id', id)`

---

## Files to Create

### File 1: `app/api/os/clients/[id]/agents/[agentId]/run/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; agentId: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const body = await req.json().catch(() => ({}))
  const triggeredBy: string = body.triggeredBy ?? 'manual'

  // 1. Fetch agent (verify it belongs to this client)
  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .single()
  if (agentErr || !agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // 2. Create run record
  const { data: run, error: runErr } = await supabase
    .from('agent_runs')
    .insert({ agent_id: params.agentId, client_id: params.id, status: 'pending', triggered_by: triggeredBy })
    .select()
    .single()
  if (runErr || !run) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 })

  const runId = run.id

  try {
    // 3. Mark as running
    await supabase.from('agent_runs').update({ status: 'running' }).eq('id', runId)

    // 4. Fetch client profile
    const { data: client } = await supabase
      .from('clients')
      .select('id, name, company, business_type, notes')
      .eq('id', params.id)
      .single()

    // 5. Fetch client tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('title, description, status, category')
      .eq('client_id', params.id)
      .order('created_at', { ascending: true })

    // 6. Build input context
    const inputContext = {
      client: {
        name: client?.name ?? '',
        company: client?.company ?? '',
        business_type: client?.business_type ?? '',
        notes: client?.notes ?? '',
      },
      tasks: (tasks ?? []).map(t => ({
        title: t.title,
        description: t.description,
        status: t.status,
        category: t.category,
      })),
    }

    // 7. Build prompts
    const systemPrompt = agent.instructions ?? 'You are a business intelligence agent. Analyze the provided business context and deliver actionable insights.'
    const userMessage = buildContextMessage(inputContext)

    // 8. Call Claude
    const startMs = Date.now()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    })
    const latencyMs = Date.now() - startMs

    // 9. Extract output
    const output = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const outputSummary = output.slice(0, 500)
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens

    // 10. Update run record
    await supabase.from('agent_runs').update({
      status: 'success',
      output,
      output_summary: outputSummary,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
      input_context: inputContext,
    }).eq('id', runId)

    // 11. Update agent stats
    await supabase.from('agents').update({
      last_run_at: new Date().toISOString(),
      run_count: (agent.run_count ?? 0) + 1,
    }).eq('id', params.agentId)

    return NextResponse.json({ runId, output, outputSummary, inputTokens, outputTokens, latencyMs })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('agent_runs').update({ status: 'error', output: message }).eq('id', runId)
    await supabase.from('agents').update({ error_count: (agent.error_count ?? 0) + 1 }).eq('id', params.agentId)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function buildContextMessage(ctx: { client: Record<string, string>; tasks: Record<string, string>[] }): string {
  const lines = [
    `## Client: ${ctx.client.name}`,
    ctx.client.company ? `Company: ${ctx.client.company}` : '',
    ctx.client.business_type ? `Business type: ${ctx.client.business_type}` : '',
    ctx.client.notes ? `Notes: ${ctx.client.notes}` : '',
    '',
    `## Active Tasks (${ctx.tasks.length})`,
    ...ctx.tasks.map(t => `- [${t.status ?? 'open'}] ${t.title}${t.category ? ` (${t.category})` : ''}${t.description ? `: ${t.description}` : ''}`),
  ]
  return lines.filter(l => l !== '').join('\n')
}
```

### File 2: `app/api/os/clients/[id]/agents/[agentId]/runs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; agentId: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { data, error } = await supabase
    .from('agent_runs')
    .select('id, status, triggered_by, input_tokens, output_tokens, latency_ms, output_summary, created_at')
    .eq('agent_id', params.agentId)
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

---

## Acceptance Criteria

- POST `/api/os/clients/[id]/agents/[agentId]/run` creates a run record, calls Claude, stores output
- Returns `{ runId, output, outputSummary, inputTokens, outputTokens, latencyMs }`
- On error: run status is updated to 'error', agent.error_count incremented
- GET `/api/os/clients/[id]/agents/[agentId]/runs` returns last 20 runs (no full output — summary only)
- TypeScript compiles cleanly
- Agent must belong to the specified client (security check)

---

## Notes

- Do NOT use streaming — non-streaming is simpler and correct for background execution
- `buildContextMessage` function format can be adjusted but must produce a clear, structured prompt
- The `cache_control: { type: 'ephemeral' }` on system prompt enables prompt caching (cost saving on repeated runs)
- Import `Anthropic` as default import, not named

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { sendRunEmail } from '@/lib/email'
import { traceAgentRun } from '@/lib/langfuse'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; agentId: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const body = await req.json().catch(() => ({}))
  const triggeredBy: string = body.triggeredBy ?? 'manual'

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .single()
  if (agentErr || !agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  const { data: run, error: runErr } = await supabase
    .from('agent_runs')
    .insert({ agent_id: params.agentId, client_id: params.id, status: 'pending', triggered_by: triggeredBy })
    .select()
    .single()
  if (runErr || !run) return NextResponse.json({ error: 'Failed to create run' }, { status: 500 })

  const runId = run.id

  try {
    await supabase.from('agent_runs').update({ status: 'running' }).eq('id', runId)

    const { data: client } = await supabase
      .from('clients')
      .select('id, name, company, business_type, notes')
      .eq('id', params.id)
      .single()

    const { data: tasks } = await supabase
      .from('tasks')
      .select('title, description, status, category')
      .eq('client_id', params.id)
      .order('created_at', { ascending: true })

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

    const systemPrompt = agent.instructions ?? 'You are a business intelligence agent. Analyze the provided business context and deliver actionable insights.'
    const userMessage = buildContextMessage(inputContext)

    const startMs = Date.now()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    })
    const latencyMs = Date.now() - startMs

    const output = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const outputSummary = output.slice(0, 500)
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens

    await supabase.from('agent_runs').update({
      status: 'success',
      output,
      output_summary: outputSummary,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
      input_context: inputContext,
    }).eq('id', runId)

    await supabase.from('agents').update({
      last_run_at: new Date().toISOString(),
      run_count: (agent.run_count ?? 0) + 1,
    }).eq('id', params.agentId)

    // Fire-and-forget Langfuse trace
    traceAgentRun({
      runId,
      agentId: params.agentId,
      agentName: agent.name ?? 'agent',
      clientId: params.id,
      triggeredBy,
      model: 'claude-sonnet-4-6',
      systemPrompt,
      userMessage,
      output,
      inputTokens,
      outputTokens,
      latencyMs,
    }).catch(() => {})

    // Fire-and-forget email for scheduled and share_page runs
    if (triggeredBy === 'schedule' || triggeredBy === 'share_page') {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name, email')
        .eq('id', params.id)
        .single()

      if (clientData?.email && agent.share_token) {
        sendRunEmail({
          clientEmail: clientData.email,
          clientName: clientData.name ?? '',
          agentName: agent.name ?? 'Your Agent',
          outputSummary,
          shareToken: agent.share_token,
        }).catch(err => console.error('[email] sendRunEmail failed:', err))
      }
    }

    return NextResponse.json({ runId, output, outputSummary, inputTokens, outputTokens, latencyMs })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('agent_runs').update({ status: 'error', output: msg }).eq('id', runId)
    await supabase.from('agents').update({ error_count: (agent.error_count ?? 0) + 1 }).eq('id', params.agentId)
    return NextResponse.json({ error: msg }, { status: 500 })
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

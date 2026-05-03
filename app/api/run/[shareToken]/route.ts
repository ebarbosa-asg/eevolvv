import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(
  _req: NextRequest,
  { params }: { params: { shareToken: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('*')
    .eq('share_token', params.shareToken)
    .single()
  if (agentErr || !agent) return NextResponse.json({ error: 'Not found' }, { status: 404 })

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
    const lines = [
      `## Client: ${inputContext.client.name}`,
      inputContext.client.company ? `Company: ${inputContext.client.company}` : '',
      inputContext.client.business_type ? `Business type: ${inputContext.client.business_type}` : '',
      inputContext.client.notes ? `Notes: ${inputContext.client.notes}` : '',
      '',
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

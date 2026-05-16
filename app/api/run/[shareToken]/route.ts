import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai-provider'
import { supabase } from '@/lib/supabase'
import { sendRunEmail } from '@/lib/email'

export async function POST(
  _req: NextRequest,
  { params }: { params: { shareToken: string } },
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
      tasks: (tasks ?? []).map((t: { title: string; description: string | null; status: string | null; category: string | null }) => ({
        title: t.title,
        description: t.description ?? '',
        status: t.status ?? '',
        category: t.category ?? '',
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
    const output = await complete(lines, { systemPrompt, maxTokens: 4000 })
    const latencyMs = Date.now() - startMs

    await supabase.from('agent_runs').update({
      status: 'success',
      output,
      output_summary: output.slice(0, 500),
      latency_ms: latencyMs,
      input_context: inputContext,
    }).eq('id', run.id)

    await supabase.from('agents').update({
      last_run_at: new Date().toISOString(),
      run_count: (agent.run_count ?? 0) + 1,
    }).eq('id', agent.id)

    // Fire-and-forget email
    {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name, email')
        .eq('id', agent.client_id)
        .single()

      if (clientData?.email && agent.share_token) {
        sendRunEmail({
          clientEmail: clientData.email,
          clientName: clientData.name ?? '',
          agentName: agent.name ?? 'Your Agent',
          outputSummary: output.slice(0, 500),
          shareToken: agent.share_token,
        }).catch(err => console.error('[email] sendRunEmail failed:', err))
      }
    }

    return NextResponse.json({ output, outputSummary: output.slice(0, 500), latencyMs })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('agent_runs').update({ status: 'error', output: msg }).eq('id', run.id)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

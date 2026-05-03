/**
 * Langfuse LLM observability wrapper.
 * Set LANGFUSE_SECRET_KEY + LANGFUSE_PUBLIC_KEY to enable.
 * Falls back silently when not configured — never blocks agent runs.
 *
 * Setup:
 *   npm install langfuse
 *   Then add keys from cloud.langfuse.com (free tier) to .env.local
 */

let _client: import('langfuse').Langfuse | null = null

async function getClient() {
  if (!process.env.LANGFUSE_SECRET_KEY) return null
  if (_client) return _client
  try {
    const { Langfuse } = await import('langfuse')
    _client = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY ?? '',
      baseUrl: process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com',
      flushAt: 1,
    })
    return _client
  } catch {
    return null
  }
}

export interface AgentTraceParams {
  runId: string
  agentId: string
  agentName: string
  clientId: string
  triggeredBy: string
  model: string
  systemPrompt: string
  userMessage: string
  output: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
  error?: string
}

export async function traceAgentRun(params: AgentTraceParams): Promise<void> {
  const lf = await getClient()
  if (!lf) return

  try {
    const trace = lf.trace({
      id: params.runId,
      name: 'agent-run',
      userId: params.clientId,
      metadata: {
        agentId: params.agentId,
        triggeredBy: params.triggeredBy,
      },
      tags: [params.triggeredBy, params.agentName],
    })

    trace.generation({
      name: params.agentName,
      model: params.model,
      input: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user',   content: params.userMessage },
      ],
      output: params.output,
      usage: {
        input:  params.inputTokens,
        output: params.outputTokens,
        unit:   'TOKENS',
      },
      metadata: { latencyMs: params.latencyMs },
      level: params.error ? 'ERROR' : 'DEFAULT',
      statusMessage: params.error,
    })

    await lf.flushAsync()
  } catch {
    // never throw — observability must not break production
  }
}

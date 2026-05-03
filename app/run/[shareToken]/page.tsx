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

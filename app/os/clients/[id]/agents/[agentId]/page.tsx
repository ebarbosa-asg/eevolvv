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

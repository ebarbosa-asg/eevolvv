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

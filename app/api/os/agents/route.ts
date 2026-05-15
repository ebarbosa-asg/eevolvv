import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GLOBAL AGENT MONITOR API
 * Aggregates all agents across all clients for the high-level HUD.
 */
export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { data: agents, error } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        type,
        status,
        last_run_at,
        health,
        client_id,
        clients:client_id (
          company
        )
      `)
      .order('last_run_at', { ascending: false })

    if (error) throw error

    // Map into the format expected by the AgentMonitorPage
    const mapped = (agents || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      type: a.type || 'standard',
      status: a.status || 'live',
      last_run: a.last_run_at ? new Date(a.last_run_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' }) : 'never',
      health: a.health || 'green',
      client_id: a.client_id,
      client_name: a.clients?.company || 'Unknown Entity'
    }))

    return NextResponse.json(mapped)
  } catch (err: any) {
    console.error('[api/os/agents] GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * TRIGGER-BUILD API
 * This simulates the "Agent Workforce" starting on a client.
 * It populates the build_logs and deliverables for a high-trust day-1 experience.
 */
export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const { clientId, clientName } = await req.json()

    if (!clientId) {
      return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
    }

    console.log(`[trigger-build] Initializing autonomous build for client: ${clientId}`)

    // 1. Create the initial "System Build Log" entries
    const initialLogs = [
      { client_id: clientId, label: 'Initial Business Diagnostics & Intake', status: 'completed' },
      { client_id: clientId, label: 'AI Agent Architecture Blueprinting', status: 'completed' },
      { client_id: clientId, label: 'Primary Automation Integration Phase', status: 'in_progress' },
      { client_id: clientId, label: 'Security & Ghost Locker Configuration', status: 'pending' },
    ]

    const { error: logError } = await supabase.from('build_logs').insert(initialLogs)
    if (logError) throw logError

    // 2. Create the initial deliverables
    const initialDeliverables = [
      { 
        client_id: clientId, 
        title: 'Strategic Automation Roadmap', 
        type: 'report', 
        status: 'unlocked', 
        url: 'https://eevolvv.com/api/diagnostic/download/' + clientId 
      },
      { 
        client_id: clientId, 
        title: 'Agent Integration Map', 
        type: 'map', 
        status: 'unlocked', 
        url: '#' 
      },
      { 
        client_id: clientId, 
        title: 'Private Resource Documentation', 
        type: 'doc', 
        status: 'locked' 
      },
      { 
        client_id: clientId, 
        title: 'Custom Automation Repo', 
        type: 'code', 
        status: 'locked' 
      },
    ]

    const { error: delivError } = await supabase.from('deliverables').insert(initialDeliverables)
    if (delivError) throw delivError

    // 3. Update the latest build status to in_progress
    await supabase
      .from('builds')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json({ success: true, message: 'Autonomous build sequence initiated' })
  } catch (err: any) {
    console.error('[trigger-build] error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

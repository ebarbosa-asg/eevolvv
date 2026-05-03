import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, client_id, trigger_config')
    .eq('trigger_type', 'schedule')
    .eq('status', 'live')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!agents || agents.length === 0) return NextResponse.json({ fired: 0, skipped: 0, total: 0 })

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3)

  let fired = 0
  let skipped = 0

  for (const agent of agents) {
    const config = agent.trigger_config as Record<string, unknown> | null
    const scheduleDays = (config?.schedule as Record<string, unknown>)?.days as string[] | undefined

    if (scheduleDays && scheduleDays.length > 0 && !scheduleDays.includes(today)) {
      skipped++
      continue
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://os.eevolvv.ai'
      const res = await fetch(
        `${baseUrl}/api/os/clients/${agent.client_id}/agents/${agent.id}/run`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ triggeredBy: 'schedule' }),
        }
      )
      if (res.ok) {
        fired++
      } else {
        console.error(`[cron] Agent ${agent.id} run failed: ${res.status}`)
        skipped++
      }
    } catch (err) {
      console.error(`[cron] Agent ${agent.id} run error:`, err)
      skipped++
    }
  }

  return NextResponse.json({ fired, skipped, total: agents.length })
}

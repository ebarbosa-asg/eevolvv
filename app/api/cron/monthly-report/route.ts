import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendMonthlyReport } from '@/lib/email-helpers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

function getMonthLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const month = getMonthLabel()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Get all active subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, client_id, status, billing_interval, current_period_end')
    .eq('status', 'active')

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: 'No active subscriptions' })
  }

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    try {
      // Fetch client
      const { data: client } = await supabase
        .from('clients')
        .select('email, name, tier')
        .eq('id', sub.client_id)
        .single()

      if (!client?.email) continue

      // Fetch latest build
      const { data: latestBuild } = await supabase
        .from('builds')
        .select('status, build_url')
        .eq('client_id', sub.client_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Fetch agent run count for last 30 days
      const { count: agentRunCount } = await supabase
        .from('agent_runs')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', sub.client_id)
        .gte('created_at', thirtyDaysAgo)

      // Get onboarding token for portal URL
      const { data: tokenRow } = await supabase
        .from('onboarding_tokens')
        .select('token')
        .eq('client_id', sub.client_id)
        .maybeSingle()

      const portalUrl = tokenRow?.token
        ? `${BASE_URL}/client/${tokenRow.token}`
        : `${BASE_URL}/pricing`

      const nextBillingDate = sub.current_period_end
        ? new Date(sub.current_period_end).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined

      const result = await sendMonthlyReport({
        email: client.email,
        name: client.name ?? undefined,
        tier: client.tier ?? 'seed',
        month,
        buildStatus: latestBuild?.status ?? 'queued',
        buildUrl: latestBuild?.build_url ?? undefined,
        agentRunCount: agentRunCount ?? 0,
        nextBillingDate,
        portalUrl,
      })

      if (result.success) sent++
      else failed++

      // Delay between sends to avoid Resend rate limits
      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      console.error('[monthly-report] error for subscription', sub.id, err)
      failed++
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: subscriptions.length,
    month,
  })
}

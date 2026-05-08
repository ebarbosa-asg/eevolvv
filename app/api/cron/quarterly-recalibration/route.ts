import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendQuarterlyRecalibration } from '@/lib/email-helpers'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // Find subscriptions hitting the 90-day anniversary (within 24-hour window)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const ninetyOneDaysAgo = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('id, client_id, created_at')
    .eq('status', 'active')
    .lt('created_at', ninetyDaysAgo)
    .gt('created_at', ninetyOneDaysAgo)

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: 'No clients at 90-day mark today' })
  }

  let sent = 0
  let failed = 0

  for (const sub of subscriptions) {
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('email, name, tier')
        .eq('id', sub.client_id)
        .single()

      if (!client?.email) {
        failed++
        continue
      }

      const result = await sendQuarterlyRecalibration({
        email: client.email,
        name: client.name ?? undefined,
        tier: client.tier ?? 'seed',
        clientId: sub.client_id,
      })

      if (result.success) sent++
      else failed++

      // Delay between sends to avoid Resend rate limits
      await new Promise(r => setTimeout(r, 100))
    } catch (err) {
      console.error('[quarterly-recalibration] error for subscription', sub.id, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: subscriptions.length })
}

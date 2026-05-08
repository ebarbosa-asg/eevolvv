import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { sendWinBack } from '@/lib/email-helpers'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  try {
    const { token, confirmed } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Validate token and get client
    const { data: tokenRow, error: tokenErr } = await supabase
      .from('onboarding_tokens')
      .select('client_id')
      .eq('token', token)
      .single()

    if (tokenErr || !tokenRow) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const clientId = tokenRow.client_id

    // Get client and subscription info
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id, name, email, tier, stripe_customer_id')
      .eq('id', clientId)
      .single()

    if (clientErr || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, current_period_end, status')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .single()

    if (subErr || !sub) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Step 1: send win-back email, return period end for UI
    if (!confirmed) {
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined

      // Fire-and-forget win-back email
      ;(async () => {
        try {
          await sendWinBack({
            email: client.email ?? '',
            name: client.name ?? undefined,
            tier: client.tier ?? undefined,
            periodEnd,
          })
        } catch (err) {
          console.error('[cancel-subscription] sendWinBack error:', err)
        }
      })()

      return NextResponse.json({ winBackSent: true, periodEnd })
    }

    // Step 2: confirmed=true — schedule cancellation at period end
    if (!sub.stripe_subscription_id) {
      return NextResponse.json({ error: 'No Stripe subscription ID on record' }, { status: 500 })
    }

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Update DB
    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', sub.id)

    const periodEndDisplay = sub.current_period_end
      ? new Date(sub.current_period_end).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null

    return NextResponse.json({ success: true, cancelledAtPeriodEnd: true, periodEnd: periodEndDisplay })
  } catch (err) {
    console.error('[cancel-subscription] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

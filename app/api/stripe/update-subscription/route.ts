import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { getTierFromPriceId, getIntervalFromPriceId, PRICE_IDS } from '@/lib/stripe-prices'

export async function POST(req: NextRequest) {
  if (!stripe || !supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  let body: { token: string; newPriceId: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, newPriceId } = body

  if (!token || !newPriceId) {
    return NextResponse.json({ error: 'token and newPriceId are required' }, { status: 400 })
  }

  // Validate price ID is one of our known prices
  const allPriceIds = Object.values(PRICE_IDS).flatMap(t => Object.values(t)).filter(Boolean)
  if (!allPriceIds.includes(newPriceId)) {
    return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
  }

  // Validate token → client
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('client_id')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Get active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id, stripe_price_id, status')
    .eq('client_id', tokenRow.client_id)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  if (sub.stripe_price_id === newPriceId) {
    return NextResponse.json({ error: 'Already on this plan' }, { status: 409 })
  }

  // Retrieve subscription item ID from Stripe
  let stripeSub: Awaited<ReturnType<typeof stripe.subscriptions.retrieve>>
  try {
    stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
  } catch (err) {
    console.error('[update-subscription] retrieve error:', err)
    return NextResponse.json({ error: 'Failed to retrieve subscription' }, { status: 500 })
  }

  const subscriptionItemId = stripeSub.items.data[0]?.id
  if (!subscriptionItemId) {
    return NextResponse.json({ error: 'Subscription item not found' }, { status: 500 })
  }

  // Update Stripe subscription with proration
  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: subscriptionItemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    })
  } catch (err) {
    console.error('[update-subscription] Stripe update error:', err)
    return NextResponse.json({ error: 'Failed to update subscription. Please try again.' }, { status: 500 })
  }

  // Optimistic DB update (webhook will also update via handleSubscriptionUpdated)
  const newTier = getTierFromPriceId(newPriceId)
  const newInterval = getIntervalFromPriceId(newPriceId)

  await supabase
    .from('subscriptions')
    .update({
      stripe_price_id: newPriceId,
      billing_interval: newInterval ?? 'monthly',
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  if (newTier) {
    await supabase
      .from('clients')
      .update({ tier: newTier })
      .eq('id', tokenRow.client_id)
  }

  const newPlanLabel = newTier
    ? `${newTier.charAt(0).toUpperCase() + newTier.slice(1)} ${((newInterval ?? 'monthly').charAt(0).toUpperCase() + (newInterval ?? 'monthly').slice(1))}`
    : 'Updated'

  return NextResponse.json({
    success: true,
    newPlan: newPlanLabel,
  })
}

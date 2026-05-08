import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPriceId, type Tier, type Interval } from '@/lib/stripe-prices'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

const VALID_TIERS: Tier[] = ['seed', 'core', 'evolve']
const VALID_INTERVALS: Interval[] = ['monthly', 'annual']

// GET handler — used by email CTA links (?tier=core&source=email)
export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.redirect(`${BASE_URL}/pricing`)
  }

  const { searchParams } = new URL(req.url)
  const rawTier = searchParams.get('tier') ?? 'core'
  const source = searchParams.get('source') ?? 'email'

  const tierMap: Record<string, Tier> = { seed: 'seed', core: 'core', evolve: 'evolve', grow: 'core', scale: 'evolve', enterprise: 'evolve', retainer: 'evolve' }
  const tier = tierMap[rawTier] ?? 'core'
  const interval: Interval = 'monthly'

  const priceId = getPriceId(tier, interval)
  if (!priceId) {
    return NextResponse.redirect(`${BASE_URL}/pricing`)
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/onboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      subscription_data: { metadata: { tier, interval, source } },
      metadata: { tier, interval, source },
      allow_promotion_codes: true,
    })
    if (!session.url) return NextResponse.redirect(`${BASE_URL}/pricing`)
    return NextResponse.redirect(session.url)
  } catch (err) {
    console.error('[stripe/checkout GET] error:', err)
    return NextResponse.redirect(`${BASE_URL}/pricing`)
  }
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
  }

  let body: { tier?: string; interval?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email } = body
  const tier = body.tier as Tier
  const interval = (body.interval ?? 'monthly') as Interval

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }
  if (!VALID_INTERVALS.includes(interval)) {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 })
  }

  const priceId = getPriceId(tier, interval)
  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured. Contact hello@eevolvv.com.' }, { status: 503 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/onboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      ...(email ? { customer_email: email } : {}),
      subscription_data: {
        metadata: {
          tier: tier ?? '',
          interval: interval ?? '',
          source: 'chat_payment_wall',
        },
      },
      metadata: {
        tier: tier ?? '',
        interval: interval ?? '',
      },
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] session creation error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}

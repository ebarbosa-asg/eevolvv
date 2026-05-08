import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRICE_IDS, getTierFromPriceId, getIntervalFromPriceId } from '@/lib/stripe-prices'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
  }

  let body: { priceId?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { priceId, email } = body

  if (!priceId || typeof priceId !== 'string') {
    return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
  }

  // Validate priceId is one of our known prices
  const allPriceIds = Object.values(PRICE_IDS).flatMap(t => Object.values(t))
  if (!allPriceIds.includes(priceId)) {
    return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
  }

  const tier = getTierFromPriceId(priceId)
  const interval = getIntervalFromPriceId(priceId)

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

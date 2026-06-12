import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPriceId, type Tier, type Interval } from '@/lib/stripe-prices'
import {
  REPORT_ROADMAP_PRODUCT,
  FIRST_FIX_PRODUCT,
  INTAKE_PILOT_PRODUCT,
  INTAKE_MONTHLY_PRODUCT,
  TEXTBACK_PILOT_PRODUCT,
  TEXTBACK_MONTHLY_PRODUCT,
  type CashProductKey,
} from '@/lib/cash-products'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

const VALID_TIERS: Tier[] = ['seed', 'core', 'evolve']
const VALID_INTERVALS: Interval[] = ['monthly', 'annual']
const VALID_PRODUCTS: CashProductKey[] = [
  'report-roadmap',
  'first-fix',
  'intake-pilot',
  'intake-monthly',
  'textback-pilot',
  'textback-monthly',
]

function getCashProductPriceId(product: CashProductKey) {
  if (product === 'report-roadmap') return process.env.STRIPE_PRICE_REPORT_ROADMAP ?? ''
  if (product === 'first-fix') return process.env.STRIPE_PRICE_FIRST_FIX ?? ''
  if (product === 'intake-pilot') return process.env.STRIPE_PRICE_INTAKE_PILOT ?? ''
  if (product === 'intake-monthly') return process.env.STRIPE_PRICE_INTAKE_MONTHLY ?? ''
  if (product === 'textback-pilot') return process.env.STRIPE_PRICE_TEXTBACK_PILOT ?? ''
  if (product === 'textback-monthly') return process.env.STRIPE_PRICE_TEXTBACK_MONTHLY ?? ''
  return ''
}

function getCashProductSuccessUrl(product: CashProductKey, submissionId?: string) {
  if (product === 'first-fix') {
    return `${BASE_URL}/onboard/success?product=first-fix&session_id={CHECKOUT_SESSION_ID}`
  }
  if (product === 'intake-pilot' || product === 'intake-monthly') {
    return `${BASE_URL}/onboard/success?product=${product}&session_id={CHECKOUT_SESSION_ID}`
  }
  if (product === 'textback-pilot' || product === 'textback-monthly') {
    return `${BASE_URL}/onboard/success?product=${product}&session_id={CHECKOUT_SESSION_ID}`
  }
  return submissionId
    ? `${BASE_URL}/report/${submissionId}?paid=roadmap&session_id={CHECKOUT_SESSION_ID}`
    : `${BASE_URL}/pricing?paid=roadmap&session_id={CHECKOUT_SESSION_ID}`
}

function getCashProductCancelUrl(product: CashProductKey, submissionId?: string) {
  if (product === 'first-fix') return `${BASE_URL}/pricing`
  if (product === 'intake-pilot' || product === 'intake-monthly') return `${BASE_URL}/intake`
  if (product === 'textback-pilot' || product === 'textback-monthly') return `${BASE_URL}/textback`
  return submissionId ? `${BASE_URL}/report/${submissionId}` : `${BASE_URL}/pricing`
}

// GET handler — used by email CTA links (?tier=core&source=email)
export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.redirect(`${BASE_URL}/pricing`)
  }

  const { searchParams } = new URL(req.url)
  const rawTier = searchParams.get('tier') ?? 'core'
  const rawProduct = searchParams.get('product')
  const source = searchParams.get('source') ?? 'email'
  const submissionId = searchParams.get('sid')

  if (
    rawProduct === REPORT_ROADMAP_PRODUCT.key ||
    rawProduct === FIRST_FIX_PRODUCT.key ||
    rawProduct === INTAKE_PILOT_PRODUCT.key ||
    rawProduct === INTAKE_MONTHLY_PRODUCT.key ||
    rawProduct === TEXTBACK_PILOT_PRODUCT.key ||
    rawProduct === TEXTBACK_MONTHLY_PRODUCT.key
  ) {
    const product = rawProduct as CashProductKey
    const priceId = getCashProductPriceId(product)
    if (!priceId) {
      return NextResponse.redirect(`${BASE_URL}/pricing?checkout=${product}-missing`)
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: getCashProductSuccessUrl(product, submissionId ?? undefined),
        cancel_url: getCashProductCancelUrl(product, submissionId ?? undefined),
        metadata: { product, source, submission_id: submissionId ?? '' },
        allow_promotion_codes: true,
      })
      if (!session.url) return NextResponse.redirect(`${BASE_URL}/pricing`)
      return NextResponse.redirect(session.url)
    } catch (err) {
      console.error(`[stripe/checkout GET ${product}] error:`, err)
      return NextResponse.redirect(`${BASE_URL}/pricing`)
    }
  }

  const tierMap: Record<string, Tier> = {
    seed: 'seed',
    core: 'core',
    evolve: 'evolve',
    'agent-one': 'seed',
    one: 'seed',
    'agent-three': 'core',
    three: 'core',
    grow: 'core',
    'agent-five': 'evolve',
    five: 'evolve',
    scale: 'evolve',
    enterprise: 'evolve',
    retainer: 'evolve',
  }
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

  let body: { tier?: string; interval?: string; email?: string; product?: string; submissionId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email } = body
  const product = body.product as CashProductKey | undefined

  if (product) {
    if (!VALID_PRODUCTS.includes(product)) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const priceId = getCashProductPriceId(product)
    if (!priceId) {
      return NextResponse.json({ error: `${product} checkout is not configured yet.` }, { status: 503 })
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: getCashProductSuccessUrl(product, body.submissionId),
        cancel_url: getCashProductCancelUrl(product, body.submissionId),
        ...(email ? { customer_email: email } : {}),
        metadata: {
          product,
          source: `${product}_checkout`,
          submission_id: body.submissionId ?? '',
        },
        allow_promotion_codes: true,
      })

      if (!session.url) {
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url })
    } catch (err) {
      console.error('[stripe/checkout report-roadmap] session creation error:', err)
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: 500 },
      )
    }
  }

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

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export async function GET(req: NextRequest) {
  if (!stripe || !supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
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

  const { data: client } = await supabase
    .from('clients')
    .select('stripe_customer_id')
    .eq('id', tokenRow.client_id)
    .single()

  if (!client?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: client.stripe_customer_id,
      return_url: `${BASE_URL}/client/${token}`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[billing-portal] Stripe error:', err)
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
}

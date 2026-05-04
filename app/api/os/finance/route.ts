import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// ─── Stripe types (minimal) ──────────────────────────────────────────────────
type StripeSubscription = {
  id: string
  status: string
  plan?: { amount: number; interval: string; currency: string }
  items?: { data: Array<{ price: { unit_amount: number; recurring: { interval: string }; currency: string } }> }
}
type StripeCharge = {
  id: string
  amount: number
  currency: string
  description: string | null
  created: number
  status: string
  billing_details?: { name: string | null }
}

async function stripeGet<T>(path: string, key: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.stripe.com/v1${path}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 300 }, // cache 5 min
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY

  // ── Manual bank balance from os_state ─────────────────────────────────────
  let bankBalance: string = '$0'
  if (supabase) {
    const { data } = await supabase
      .from('os_state')
      .select('value')
      .eq('key', 'os_finance')
      .single()
    if (data?.value && typeof data.value === 'object') {
      const f = data.value as Record<string, string>
      bankBalance = f.bank_balance ?? '$0'
    }
  }

  // ── Stripe not connected ───────────────────────────────────────────────────
  if (!stripeKey) {
    return NextResponse.json({
      stripe_connected: false,
      bank_balance: bankBalance,
      mrr: null,
      arr: null,
      customer_count: null,
      recent_charges: [],
      message: 'Add STRIPE_SECRET_KEY to .env.local and Vercel to enable live data',
    })
  }

  // ── Live Stripe data ───────────────────────────────────────────────────────
  const [subsRes, customersRes, chargesRes] = await Promise.all([
    stripeGet<{ data: StripeSubscription[] }>('/subscriptions?status=active&limit=100', stripeKey),
    stripeGet<{ data: unknown[]; total_count?: number }>('/customers?limit=1', stripeKey),
    stripeGet<{ data: StripeCharge[] }>('/charges?limit=5', stripeKey),
  ])

  // MRR: sum all active subscription amounts normalized to monthly
  let mrrCents = 0
  if (subsRes?.data) {
    for (const sub of subsRes.data) {
      const items = sub.items?.data ?? []
      for (const item of items) {
        const price = item.price
        if (!price) continue
        const amount = price.unit_amount ?? 0
        const interval = price.recurring?.interval ?? 'month'
        mrrCents += interval === 'year' ? Math.round(amount / 12) : amount
      }
    }
  }

  const mrr = mrrCents > 0 ? `$${(mrrCents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$0'
  const arr = mrrCents > 0 ? `$${((mrrCents * 12) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$0'
  const customerCount = customersRes?.total_count ?? (customersRes?.data?.length ?? 0)

  const recentCharges = (chargesRes?.data ?? []).map((c) => ({
    id: c.id,
    amount: `$${(c.amount / 100).toFixed(2)}`,
    description: c.description ?? c.billing_details?.name ?? 'Charge',
    date: new Date(c.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: c.status,
  }))

  return NextResponse.json({
    stripe_connected: true,
    bank_balance: bankBalance,
    mrr,
    arr,
    customer_count: customerCount,
    recent_charges: recentCharges,
  })
}

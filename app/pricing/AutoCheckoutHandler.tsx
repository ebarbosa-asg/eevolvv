'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Tier } from '@/lib/stripe-prices'

/**
 * Reads ?tier=X&checkout=1 from the URL and auto-redirects to Stripe
 * Checkout. Used to deep-link from industry pages, SEO pages, revenue
 * calculator, contact buy buttons, etc.
 *
 * Isolated from PricingTiers so the tier cards stay SSR-able. This component
 * renders nothing visible and lives inside its own <Suspense> boundary on
 * the pricing page.
 */
export function AutoCheckoutHandler() {
  const params = useSearchParams()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    const checkout = params?.get('checkout')
    const tierParam = params?.get('tier') as Tier | null
    if (checkout !== '1') return
    if (!tierParam || !['seed', 'core', 'evolve'].includes(tierParam)) return

    fired.current = true
    const intervalParam = params?.get('interval') === 'monthly' ? 'monthly' : 'annual'

    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: tierParam, interval: intervalParam }),
    })
      .then(r => r.json())
      .then(data => {
        if (data?.url) window.location.href = data.url
      })
      .catch(() => {
        // Silent — the visible tier cards remain interactive as a fallback.
      })
  }, [params])

  return null
}

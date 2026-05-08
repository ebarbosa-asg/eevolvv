import { createClient } from '@supabase/supabase-js'

const store = new Map<string, number[]>()

const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '3', 10)
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * Synchronous IP-based rate limit check.
 * Unchanged — backward compatible with all existing callers.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const hits = (store.get(ip) ?? []).filter((t) => t > windowStart)

  if (hits.length >= MAX) {
    return { allowed: false, remaining: 0 }
  }

  store.set(ip, [...hits, now])
  return { allowed: true, remaining: MAX - hits.length - 1 }
}

/**
 * Subscription-aware rate limit check.
 * If clientId is provided and has an active subscription, returns unlimited.
 * Otherwise, falls back to IP-based 3/hr limit.
 * Never throws — on Supabase error, falls back to IP limit gracefully.
 */
export async function checkRateLimitWithSubscription(
  ip: string,
  clientId?: string | null
): Promise<{ allowed: boolean; remaining: number | null; isSubscribed: boolean }> {
  if (clientId) {
    try {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey) {
        const db = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        })
        const { data } = await db
          .from('subscriptions')
          .select('status')
          .eq('client_id', clientId)
          .eq('status', 'active')
          .maybeSingle()
        if (data) {
          // Active subscriber — unlimited diagnostics
          return { allowed: true, remaining: null, isSubscribed: true }
        }
      }
    } catch (err) {
      console.warn(
        '[rateLimit] subscription check failed, falling back to IP limit:',
        err
      )
    }
  }

  // Fall back to IP-based limit
  const result = checkRateLimit(ip)
  return { ...result, isSubscribed: false }
}

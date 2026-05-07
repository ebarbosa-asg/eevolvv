# Task Brief: Rate Limiter Upgrade (Subscription-Aware)

**ID:** T14
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** should
**Model:** sonnet
**Depends on:** T05

---

## Objective

Upgrade `lib/rateLimit.ts` so that active subscribers bypass the IP-based rate limit. Add an optional `clientId` parameter to `checkRateLimit()` — if provided, query `subscriptions` table and return unlimited if status is `active`. Non-subscribers keep the existing 3/hr IP limit. Update `app/api/diagnostic/route.ts` to pass a client ID from session/cookie if present.

---

## Context

**Verify before starting:**
- `subscriptions` table exists with `client_id`, `status` columns (T05 complete)

**Existing `lib/rateLimit.ts` (full file — read before modifying):**

```typescript
const store = new Map<string, number[]>()
const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '3', 10)
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const hits = (store.get(ip) ?? []).filter((t) => t > windowStart)
  if (hits.length >= MAX) return { allowed: false, remaining: 0 }
  store.set(ip, [...hits, now])
  return { allowed: true, remaining: MAX - hits.length - 1 }
}
```

**Existing `app/api/diagnostic/route.ts` rate limit usage (lines 44-54):**

```typescript
const ip = getClientIp(req)
const { allowed, remaining } = await checkRateLimitDb(ip)
if (!allowed) { ... return 429 }
```

The file also has `checkRateLimitDb(ip)` defined at lines 22-38 which queries Supabase for recent submissions by IP. The new `checkRateLimit` is the in-memory fallback when Supabase is unavailable.

**Client identification at diagnostic time:** Currently there's no session/cookie system. For now, the client ID can be passed as an optional header (`X-Client-Id`) or query parameter. This is a temporary mechanism until a proper session system is built. Alternatively, check if the requesting IP has a matching client record (reverse lookup) — but this is slower.

**Recommendation:** Accept `X-Client-Id` header in the diagnostic route for now. Future work will handle proper session-based auth.

**Graceful fallback:** If Supabase query fails when checking subscription status, fall back to IP limit. Never block a request due to a DB error.

---

## Implementation

### Files to Modify

- `lib/rateLimit.ts` — Add async `checkRateLimitWithSubscription()` function
- `app/api/diagnostic/route.ts` — Read `X-Client-Id` header, pass to new rate limit function

### Files to Create

None.

### Step-by-Step

1. Modify `lib/rateLimit.ts` — add new async function while keeping existing sync function unchanged:

```typescript
import { createClient } from '@supabase/supabase-js'

const store = new Map<string, number[]>()

const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '3', 10)
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

// Keep existing sync function — unchanged, used as fallback
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const hits = (store.get(ip) ?? []).filter((t) => t > windowStart)
  if (hits.length >= MAX) return { allowed: false, remaining: 0 }
  store.set(ip, [...hits, now])
  return { allowed: true, remaining: MAX - hits.length - 1 }
}

/**
 * Subscription-aware rate limit check.
 * If clientId is provided and has an active subscription, returns unlimited.
 * Otherwise, falls back to IP-based limit.
 * Never throws — on Supabase error, falls back to IP limit.
 */
export async function checkRateLimitWithSubscription(
  ip: string,
  clientId?: string | null
): Promise<{ allowed: boolean; remaining: number | null; isSubscribed: boolean }> {
  if (clientId) {
    try {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey) {
        const db = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
        const { data } = await db
          .from('subscriptions')
          .select('status')
          .eq('client_id', clientId)
          .eq('status', 'active')
          .maybeSingle()
        if (data) {
          // Active subscriber — unlimited
          return { allowed: true, remaining: null, isSubscribed: true }
        }
      }
    } catch (err) {
      console.warn('[rateLimit] subscription check failed, falling back to IP limit:', err)
    }
  }
  // Fall back to IP-based limit
  const result = checkRateLimit(ip)
  return { ...result, isSubscribed: false }
}
```

Note: Creating a Supabase client inline here (not importing from `lib/supabase.ts`) to avoid circular dependency issues. The singleton in `lib/supabase.ts` is fine for most uses, but `rateLimit.ts` is imported early and we want to avoid any import chain issues.

2. Modify `app/api/diagnostic/route.ts` — update the rate limiting section:

Find the existing rate limit block (around lines 43-54) and update it to read the client ID header:

```typescript
// ── Rate limiting ─────────────────────────────────────────────────────────────
const ip = getClientIp(req)
const clientId = req.headers.get('x-client-id') ?? null

// Use subscription-aware rate limiter
const { allowed, remaining, isSubscribed } = await checkRateLimitWithSubscription(ip, clientId)

if (!allowed) {
  const phRateLimit = getPostHogClient()
  phRateLimit.capture({ distinctId: ip, event: 'diagnostic_rate_limited', properties: { ip, is_subscribed: false } })
  await phRateLimit.shutdown()
  return NextResponse.json(
    { error: 'Too many requests. You can generate up to 3 reports per hour. Please try again later.' },
    { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  )
}
```

Also update the import at top of `app/api/diagnostic/route.ts`:
```typescript
import { checkRateLimitWithSubscription } from '@/lib/rateLimit'
// Remove import of old checkRateLimit if no longer used
```

And update the `checkRateLimitDb` function call — replace the `checkRateLimitDb` fallback inside `checkRateLimitDb` to use `checkRateLimit`:
```typescript
// In checkRateLimitDb function (lines 22-38):
if (error) return checkRateLimit(ip) // still valid — checkRateLimit is unchanged
```

3. Run `npm run build` — no TypeScript errors expected.

---

## Code Patterns to Follow

```typescript
// Never-throw pattern (from lib/supabase.ts)
try {
  const { data } = await db.from('subscriptions').select('status').eq(...)
  if (data) return { allowed: true, remaining: null, isSubscribed: true }
} catch {
  // Fall back silently
}

// Existing function unchanged — backward compatible
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number }
```

---

## Environment Variables

No new env vars needed — uses existing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_MAX`.

---

## Acceptance Criteria

- [ ] `checkRateLimitWithSubscription(ip, clientId?)` exported from `lib/rateLimit.ts`
- [ ] Original `checkRateLimit(ip)` function unchanged — backward compatible
- [ ] Active subscriber (`subscriptions.status = 'active'`) returns `{ allowed: true, remaining: null, isSubscribed: true }`
- [ ] Non-subscriber with no clientId uses existing IP-based 3/hr limit
- [ ] Supabase query failure falls back to IP limit gracefully (no crash)
- [ ] `app/api/diagnostic/route.ts` reads `X-Client-Id` header and passes to new function
- [ ] `npm run build` passes with no TypeScript errors

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `checkRateLimitWithSubscription()` | `app/api/diagnostic/route.ts` (updated in this task) |

---

## Do Not

- Do not remove or rename `checkRateLimit()` — it's used as a fallback and may be imported elsewhere
- Do not add session/cookie middleware — that's future work
- Do not block requests when Supabase is unavailable — always fall back to IP limit
- Do not touch `middleware.ts`
- Do not require authentication for the diagnostic route — keep it publicly accessible

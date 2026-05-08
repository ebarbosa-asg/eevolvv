# Task Brief: Stripe Foundation

**ID:** T01
**PRD:** autonomous-sidegig-pivot
**Complexity:** 2/5
**Priority:** must
**Model:** sonnet
**Depends on:** none

---

## Objective

Install the `stripe` npm package and create `lib/stripe.ts` as a singleton Stripe client — the foundation that every other Stripe-dependent task imports. Also add all required Stripe environment variables to `.env.example` so E knows what to provision in Vercel. This is a blocking dependency for T02, T03, T04, T07, T18, T19, T20.

---

## Context

**Codebase patterns to follow:**

- `lib/supabase.ts` — the definitive singleton pattern in this project. It initializes a client using env vars, guards against missing vars with a null check, and exports the client directly. Follow this pattern exactly for `lib/stripe.ts`.
- `app/api/diagnostic/route.ts:11` — shows how Anthropic client is initialized: `const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`. Stripe follows the same shape.
- `.env.example` — existing format uses `# ── Section Name ──` headers and `VAR_NAME=description_or_placeholder` format. Match this style.

The project uses Node.js 25 / Next.js App Router / TypeScript. The package manager is `npm`.

---

## Implementation

### Files to Create

- `lib/stripe.ts` — Singleton Stripe client initialization, exported for use by all API routes

### Files to Modify

- `package.json` — add `stripe` as a dependency
- `.env.example` — add Stripe env var block

### Step-by-Step

1. Install the Stripe Node.js SDK:
   ```bash
   npm install stripe
   ```

2. Create `lib/stripe.ts`:
   ```typescript
   import Stripe from 'stripe'

   const stripeSecretKey = process.env.STRIPE_SECRET_KEY

   export const stripe = stripeSecretKey
     ? new Stripe(stripeSecretKey, {
         apiVersion: '2025-04-30.basil',
         typescript: true,
       })
     : null
   ```
   Use the latest stable API version. Check `node_modules/stripe/types/index.d.ts` for the exact version string if different from above.

3. Add to `.env.example` after the existing `# ── CEO OS Hub (/os) ──` block:
   ```
   # ── Stripe (Payments) ────────────────────────────────────────────────────────
   # Get from Stripe dashboard → Developers → API keys
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

   # ── Stripe Price IDs (populated after T02 product creation) ─────────────────
   STRIPE_PRICE_SEED_MONTHLY=price_...
   STRIPE_PRICE_SEED_ANNUAL=price_...
   STRIPE_PRICE_CORE_MONTHLY=price_...
   STRIPE_PRICE_CORE_ANNUAL=price_...
   STRIPE_PRICE_EVOLVE_MONTHLY=price_...
   STRIPE_PRICE_EVOLVE_ANNUAL=price_...

   # ── Cron Security ────────────────────────────────────────────────────────────
   # Random secret — set same value in Vercel + vercel.json cron headers
   CRON_SECRET=your_random_cron_secret_here
   ```

4. Verify TypeScript compiles: `npm run build` — no type errors expected.

---

## Code Patterns to Follow

```typescript
// lib/supabase.ts pattern — null guard, no throw
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-04-30.basil', typescript: true })
  : null

// Consumers check for null before using:
if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Server-side secret key from Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe webhook endpoint config |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side publishable key (used by T07 frontend) |
| `STRIPE_PRICE_SEED_MONTHLY` | Price ID — Seed Monthly $99 (populated after T02) |
| `STRIPE_PRICE_SEED_ANNUAL` | Price ID — Seed Annual $950 (populated after T02) |
| `STRIPE_PRICE_CORE_MONTHLY` | Price ID — Core Monthly $499 (populated after T02) |
| `STRIPE_PRICE_CORE_ANNUAL` | Price ID — Core Annual $4,790 (populated after T02) |
| `STRIPE_PRICE_EVOLVE_MONTHLY` | Price ID — Evolve Monthly $1,999 (populated after T02) |
| `STRIPE_PRICE_EVOLVE_ANNUAL` | Price ID — Evolve Annual $19,190 (populated after T02) |
| `CRON_SECRET` | Shared secret for authenticating Vercel cron routes |

---

## Acceptance Criteria

- [ ] `npm install stripe` completes without errors; `stripe` appears in `package.json` dependencies
- [ ] `lib/stripe.ts` exports a `stripe` client initialized with `STRIPE_SECRET_KEY`
- [ ] `stripe` export is `null` when `STRIPE_SECRET_KEY` is not set (no throw)
- [ ] `.env.example` contains all 10 new env vars listed above, following existing file style
- [ ] `npm run build` passes with no TypeScript errors

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `lib/stripe.ts` — `stripe` export | T03, T04, T06, T07, T18, T19, T20, T23 |
| `.env.example` Stripe vars | T02 (price IDs), all future tasks |
| `CRON_SECRET` var pattern | T12, T21, T22, T23 |

---

## Do Not

- Do not create any API routes in this task — that is T03 and T04
- Do not modify `lib/supabase.ts` — follow its pattern, don't change it
- Do not touch `node_modules/`, `.next/`, or any `.env*` files other than `.env.example`
- Do not add `stripe` to devDependencies — it is a runtime dependency
- Do not hardcode any API keys — env vars only

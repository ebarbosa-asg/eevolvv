# Internal Dependencies — autonomous-sidegig-pivot

**Phase:** Internal Research
**Date:** 2026-05-06

---

## Core Dependencies for Pivot Features

### Payment Flow Dependencies

```
ChatEngine.tsx (report phase)
  → [NEW] PaymentWall component
      → [NEW] /app/api/stripe/checkout/route.ts
          → lib/stripe.ts (new)
              → STRIPE_SECRET_KEY (env — configured but unused)
              → Stripe SDK (not installed — needs: npm install stripe)
  → [NEW] /app/api/stripe/webhook/route.ts
      → lib/stripe.ts
      → lib/supabase.ts (existing)
      → [NEW] /app/api/os/clients/route.ts POST (existing, needs enhancement)
```

### Client Onboarding Dependencies

```
Stripe webhook (payment_intent.succeeded OR customer.subscription.created)
  → create clients row (lib/supabase.ts → supabase.from('clients'))
  → create onboarding intake session
  → send welcome email (lib/email.ts → Resend)
      → [NEW] WelcomeEmail.tsx template
  → create initial service_tasks rows
  → PostHog: identify + track 'client_subscription_created'
```

### Build Pipeline Dependencies

```
[NEW] builds table (Supabase)
  → references clients(id)
  → status: queued | in_progress | qa | deploying | live | failed

[NEW] /app/api/os/builds/route.ts
  → supabase.from('builds')
  → assignment logic (to E / technician)

[NEW] /app/api/cron/builds/route.ts (or extend existing)
  → checks builds with status='queued'
  → triggers build agent run
  → 48-hour watchdog: if no update in 48h, send notification

Build agent (extends existing agent runtime)
  → /app/api/os/clients/[id]/agents/[agentId]/run/route.ts (exists)
  → Anthropic claude-sonnet-4-6 (exists)
  → lib/langfuse.ts (exists — tracing)
```

### SEO Infrastructure Dependencies

```
Ghost CMS (ghost-locker/ directory — partially configured)
  → subdomain: blog.eevolvv.com or /blog route
  → Ghost Content API → Next.js ISR pages

Programmatic SEO pages
  → /app/industries/[slug]/page.tsx (new)
  → data/industries.ts (new)
  → sitemap.ts (new)
```

---

## Existing Reusable Infrastructure

### Can be reused as-is:
| Asset | File | Reuse |
|-------|------|-------|
| Claude agent runner | `app/api/os/clients/[id]/agents/[agentId]/run/route.ts` | Build agent backbone |
| Supabase client | `lib/supabase.ts` | All DB operations |
| Email sender | `lib/email.ts` + `resend` | All new email sequences |
| PostHog analytics | `lib/posthog-server.ts` | Revenue event tracking |
| Langfuse tracing | `lib/langfuse.ts` | Build agent traces |
| Auth middleware | `middleware.ts` + `lib/auth.ts` | Client portal auth |
| Cron infrastructure | `vercel.json` + `/api/cron/agents/` | Build queue cron |
| share_token pattern | `agents.share_token` (migration 003) | Client portal access |
| Rate limiter | `lib/rateLimit.ts` | Tier-based enhancement |
| react-email | `emails/EvolutionReport.tsx` | Template pattern |

### Must be extended:
| Asset | Extension needed |
|-------|-----------------|
| `lib/supabase.ts` | Add `saveClient()`, `createBuild()`, `updateSubscription()` helpers |
| `app/api/os/clients/route.ts` | Add `submission_id` → auto-populate from Stripe metadata |
| `vercel.json` | Add build queue cron (e.g., `0 */2 * * *` every 2 hours) |
| `ChatEngine.tsx` | Replace Calendly CTA with payment wall |

### Must be created from scratch:
- `lib/stripe.ts` — Stripe SDK wrapper
- `/app/api/stripe/` — checkout + webhook routes
- `/app/client/` — client-facing portal
- `emails/Welcome.tsx`, `emails/BuildStarted.tsx`, `emails/BuildComplete.tsx`
- `supabase/migrations/006_subscriptions_builds.sql`
- `/app/(marketing)/` — new pricing page with pivot tiers
- SEO infrastructure

---

## NPM Package Dependencies

### Already installed (relevant to pivot):
- `@anthropic-ai/sdk ^0.91.1` — agent runtime
- `@supabase/supabase-js ^2.105.1` — DB
- `resend ^3.3.0` — email
- `@react-email/components ^1.0.12` — email templates
- `next-auth ^5.0.0-beta.31` — auth
- `posthog-js` + `posthog-node` — analytics
- `langfuse ^3.31.0` — tracing
- `zod ^3.23.8` — validation

### Not installed (needed for pivot):
- `stripe` — Stripe Node SDK (critical)
- Any queue library if moving beyond Vercel cron (e.g., `bullmq` for Redis queue, or use n8n externally)
- `@vercel/kv` or `ioredis` — if adding Redis for queue/session

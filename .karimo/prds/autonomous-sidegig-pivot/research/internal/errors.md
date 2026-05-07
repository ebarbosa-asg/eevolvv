# Internal Errors & Gaps — autonomous-sidegig-pivot

**Phase:** Internal Research
**Date:** 2026-05-06

---

## Critical Gaps (Blockers for Pivot)

### GAP-01: No Stripe Integration
**Severity:** Critical
**Description:** `.env.example` defines `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` but zero Stripe code exists in any route, component, or library file. There is no checkout session creation, no subscription management, no webhook handler.
**Impact:** The entire payment wall → subscription → build trigger pipeline cannot function.
**What's needed:** `/app/api/stripe/checkout/route.ts`, `/app/api/stripe/webhook/route.ts`, `lib/stripe.ts`

### GAP-02: No Post-Report Payment Wall
**Severity:** Critical
**Description:** `ChatEngine.tsx` lines ~499–511 show the post-report CTA goes directly to Calendly (`BOOK STRATEGY CALL`). There is no payment interstitial, no tier selection after report, no pricing modal, no checkout redirect.
**Impact:** Revenue capture requires human (Calendly → manual proposal). Pivot requires zero-touch payment.
**What's needed:** Payment wall UI in `ChatEngine.tsx` report phase, Stripe checkout redirect

### GAP-03: No Automated Client Onboarding
**Severity:** Critical
**Description:** No flow exists to convert a Stripe payment event into a client record in the OS. The `clients` table exists but is manually populated via the OS UI.
**Impact:** "Automated onboarding" step of the pipeline is entirely missing.
**What's needed:** Stripe webhook → create `clients` row → create initial `service_tasks` → trigger welcome sequence

### GAP-04: No Build Queue System
**Severity:** Critical
**Description:** No table, queue, or workflow exists for managing autonomous builds. The `service_tasks` table is referenced but its schema is not in the migrations (it's referenced in the clients query at `app/api/os/clients/route.ts` line 15 but never created in migrations 001–005).
**Impact:** The core deliverable (landing page, web app, automation workflow) cannot be queued or tracked autonomously.
**What's needed:** `builds` table, build queue processor, assignment logic

### GAP-05: No Client-Facing Portal
**Severity:** High
**Description:** `/os/**` is auth-gated for E (internal operator). Clients have no login, no status page, no way to see their build progress, no way to trigger anything themselves.
**Impact:** "Automated onboarding" and "build assignment" stages require a client touchpoint.
**What's needed:** `/app/client/[token]/` portal using share_token pattern (already exists on agents)

### GAP-06: Tier Mismatch Between UI and Pivot Model
**Severity:** High
**Description:** `app/page.tsx` shows one-time project pricing (Seed $500–$1,500, Grow $3,500–$7,500, etc.). The pivot proposes recurring monthly subscriptions with build included ($99/mo, $499/mo, $1,999/mo). These are incompatible UI representations.
**Impact:** No current pricing UI supports the proposed model. Full pricing section rebuild needed.

### GAP-07: Missing `service_tasks` Migration
**Severity:** Medium
**Description:** `app/api/os/clients/route.ts` line 15 queries `service_tasks(id, status, updated_at)` as a Supabase relation, but no migration file creates this table. The `tasks` table is referenced in agent run context (`app/api/os/clients/[id]/agents/[agentId]/run/route.ts` line 44) but also has no migration.
**Impact:** OS client list will error or return nulls on `latest_task` if these tables don't exist in production.
**What's needed:** Verify production schema, add `service_tasks` / `tasks` migration

### GAP-08: Rate Limiter Not Session-Based
**Severity:** Medium
**Description:** `lib/rateLimit.ts` is IP-based (3/hour). Known issue in `CLAUDE.md`. For multi-client paid tiers, this is insufficient — paid subscribers need unlimited or higher-rate access to diagnostic re-runs.
**What's needed:** Session/user-based rate limiting tied to subscription tier

### GAP-09: No Subscription Status on Client Record
**Severity:** Medium
**Description:** `clients` table has no `subscription_id`, `subscription_status`, `plan_tier`, `billing_cycle`, `next_billing_at`, or `mrr` fields.
**Impact:** Cannot filter clients by subscription health, trigger re-calibration, or pause/cancel flows.

### GAP-10: Cron Cannot Handle Build Pipeline
**Severity:** Medium
**Description:** The single daily cron at 9am (`/api/cron/agents`) only fires pre-configured scheduled agents. It cannot: process a build queue, check build status, trigger QA, deploy, or send 48-hour watchdog notifications.
**What's needed:** Multi-step pipeline cron or event-driven queue (Vercel cron + Supabase triggers, or n8n/Make external orchestration)

### GAP-11: No SEO Infrastructure
**Severity:** Medium
**Description:** No sitemap, no blog/content section, no programmatic SEO pages exist. The pivot depends on inbound SEO traffic.
**What's needed:** `/app/sitemap.ts`, blog integration (Ghost CMS is referenced in `ghost-locker/` directory), programmatic landing pages

### GAP-12: Email Sequence Missing
**Severity:** Medium
**Description:** Only one email template exists (`EvolutionReport.tsx`). No post-payment confirmation, no build started notification, no build complete notification, no quarterly re-calibration prompt, no re-engagement sequence for clients who receive report and don't pay.
**What's needed:** 5–8 additional email templates, drip sequence trigger logic

---

## Inconsistencies

### INC-01: Two Different Pricing Models in Codebase
`app/page.tsx` shows Micro/Seed/Grow/Scale/Enterprise with one-time pricing. `emails/EvolutionReport.tsx` TIER_LABELS (lines 25–32) shows `seed: 'Seed — AI Starter ($500–$1,500)'`, `retainer: 'Evolve Retainer ($500–$25K/mo)'`. These need to be reconciled when new pivot pricing is introduced.

### INC-02: `tasks` Table Referenced But Not Migrated
`app/api/os/clients/[id]/agents/[agentId]/run/route.ts` line 44 queries `tasks` table. No migration defines it. Either it's an alias for `service_tasks` or a separate table was created manually in Supabase.

### INC-03: `TODO: add session auth` Comment
`app/api/os/clients/route.ts` line 5 has `// TODO: add session auth`. The OS API routes are only protected by middleware redirect, not by explicit token verification in the API handlers themselves. This is a security gap.

### INC-04: NEXT_PUBLIC_APP_URL
`app/api/cron/agents/route.ts` line 37 uses `process.env.NEXT_PUBLIC_APP_URL ?? 'https://os.eevolvv.com'`. This env var is not in `.env.example`. The domain `os.eevolvv.com` may not be configured.

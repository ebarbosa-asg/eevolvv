# Internal Research Findings — eevolvv Autonomous Side-Gig Pivot

**Date:** 2026-05-06
**Source:** Codebase scan of `/Users/loko/eevolvv/`

---

## What Exists and Is Working

### Diagnostic → Report Flow (Functional)

- `components/ChatEngine.tsx` — full phase state machine: `chatting → extracting → report → error`. Streams Claude responses via SSE. Sends `[READY]` signal to trigger report generation.
- `app/api/chat/route.ts` — streaming diagnostic chat endpoint, `claude-sonnet-4-6`, 6–10 exchanges to collect business info
- `app/api/diagnostic/route.ts` (called via `/api/extract-intake`) — validates intake, calls Claude (4,000 tokens), saves to Supabase `submissions` table, sends Resend email with `EvolutionReport.tsx` template, tracks PostHog events
- `lib/diagnosticPrompts.ts` — 15 industry-specific system prompts with prompt caching

**Post-report CTA: Calendly only.** ~Line 499 of `ChatEngine.tsx` — the report phase ends with a "BOOK STRATEGY CALL →" link pointing to Calendly. No payment wall. No Stripe. No checkout redirect. Nothing.

### OS Multi-Client Infrastructure (Exists)

- `app/os/` — auth-gated (NextAuth v5) internal operations dashboard
- `app/api/os/clients/[id]/agents/[agentId]/run/route.ts` — full agent execution loop: fetches client context + tasks, calls Claude, logs to `agent_runs`, traces to Langfuse, sends email for scheduled runs. This is the autonomous build backbone.
- `vercel.json` — one cron at `0 9 * * *` daily that fires all `trigger_type='schedule'` agents
- Supabase tables: `submissions`, `clients`, `agents`, `agent_runs`, `documents` (pgvector, 768-dim embeddings, `match_documents()` function), `company_tasks`, `pipeline_deals`, `investors`, `os_state`

### Analytics (Production-Ready)

- 7 PostHog diagnostic events tracked
- Langfuse traces every agent run (tokens, latency, I/O)

### Email Infrastructure

- Resend + react-email
- One template (`EvolutionReport.tsx`)
- Pattern established for additional templates

---

## Critical Gaps (Blockers for Pivot)

**GAP-01 — No Stripe integration (Critical)**
`.env.example` defines `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — zero Stripe code exists anywhere. No `stripe` npm package installed. Stripe Atlas entity exists; account is ready. Nothing is wired.

**GAP-02 — No payment wall after report (Critical)**
Post-report CTA goes to Calendly. The entire pivot's revenue model cannot function without replacing this CTA with a Stripe checkout redirect.

**GAP-03 — No automated client onboarding (Critical)**
No Stripe webhook → client creation flow. The `clients` table is manually populated via the OS UI. There is no programmatic link between a payment event and a new client record.

**GAP-04 — No build queue (Critical)**
No `builds` table, no queue processor, no assignment logic. There is also a `service_tasks` table referenced in `app/api/os/clients/route.ts` line 15 but it has no migration file (migrations 001–005 don't create it).

**GAP-05 — No client-facing portal (High)**
`/os/**` is internal only. Clients cannot see build status, approve anything, or access deliverables. The `agents.share_token` pattern (migration 003, `/app/run/[shareToken]/`) already shows how to do public-facing token access — extend this to a `/app/client/[token]/` portal.

**GAP-06 — Tier model mismatch (High)**
`app/page.tsx` shows one-time pricing (Seed $500–$1,500 etc.). The pivot proposes recurring subscriptions with build included. Full pricing section rebuild required. `emails/EvolutionReport.tsx` `TIER_LABELS` (lines 25–32) also needs updating.

**GAP-07 — Missing `service_tasks` migration (Medium)**
The `clients` query joins on `service_tasks` and `tasks` but neither table appears in migrations 001–005.

**GAP-08 — Rate limiter not subscription-aware (Medium)**
`lib/rateLimit.ts` flat 3/hour IP limit — known issue in `CLAUDE.md`. Paid subscribers need elevated access.

**INC-03 — OS API routes have no server-side auth check**
`app/api/os/clients/route.ts` line 5 has `// TODO: add session auth`. Routes are protected only by middleware redirect, not by token verification inside the handler.

---

## Supabase Schema — What's Needed vs. What Exists

**Existing tables:** `submissions`, `clients`, `agents`, `agent_runs`, `documents`, `company_tasks`, `pipeline_deals`, `investors`, `os_state`

**Missing tables for the pivot:**
- `subscriptions` (Stripe sub ID, plan tier, status, billing_cycle, next_billing_at)
- `builds` (queue, status enum: queued|in_progress|qa|deploying|live|failed, assigned_to, repo_url, deploy_url)
- `onboarding_sessions` (post-payment intake state)
- `deployments` (per-client history)
- `subscription_id` FK on `clients`

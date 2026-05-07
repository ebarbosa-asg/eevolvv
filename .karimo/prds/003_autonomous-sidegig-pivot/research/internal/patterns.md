# Internal Patterns — autonomous-sidegig-pivot

**Phase:** Internal Research
**Date:** 2026-05-06

---

## 1. Diagnostic → Report Flow (EXISTS — Functional)

The diagnostic-to-report flow is real and working. Two separate API routes handle it:

### Chat intake (`app/api/chat/route.ts`)
- Streaming SSE endpoint using `anthropic.messages.stream`
- System prompt collects: business name, type, industry, pain points, team size, revenue, tools, email
- Signals completion by appending `[READY]` to the final message
- Model: `claude-sonnet-4-6`, max_tokens: 400 per turn
- No auth required — fully public

### Report generation (`app/api/diagnostic/route.ts`)
- Called after `[READY]` signal by `ChatEngine.tsx` via `/api/extract-intake`
- Validates: businessType, topPains, email (required)
- Rate limits: 3/hour per IP (Supabase-backed + in-memory fallback in `lib/rateLimit.ts`)
- Calls Claude claude-sonnet-4-6, max_tokens: 4000 with prompt caching
- Saves to `submissions` table
- Sends email via Resend with `EvolutionReport` react-email template
- Tracks with PostHog (`diagnostic_report_generated`, `diagnostic_report_viewed`)
- Returns full report text, submissionId, tier, email

### ChatEngine.tsx orchestrates both
- Phase state machine: `chatting → extracting → report → error`
- Typewriter animation during extraction (`ACTIVITY_LINES` array)
- Report rendered inline with stat callouts, formatted HTML
- **POST-REPORT CTA: Calendly booking link only** — no payment wall, no payment form

---

## 2. Payment Wall Status — MISSING

**No payment wall exists.** The post-report CTA (ChatEngine.tsx, line ~499) is:
```
href={calendlyUrl} → BOOK STRATEGY CALL
```
Stripe is configured (`.env.example` shows `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) but no Stripe integration code exists in any file. The env vars are defined but wired to nothing.

There is no:
- `/app/api/stripe/` directory
- Stripe checkout session creation
- Subscription management route
- Webhook handler for payment events
- Any tier-gated content post-payment

---

## 3. Stripe Configuration Status

From `.env.example` (vars defined but not implemented):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Assessment:** Stripe Atlas entity exists (from CLAUDE.md), Stripe account is configured, but zero server-side Stripe code has been written. This is the single biggest infrastructure gap for the pivot.

---

## 4. Onboarding Flow Post-Payment — MISSING

No automated onboarding flow exists. The current conversion path ends at Calendly. There is no:
- Intake questionnaire post-payment
- Client provisioning logic
- Supabase client record creation from payment event
- Welcome email sequence
- Access provisioning for a client portal

---

## 5. OS — Multi-Client Infrastructure (EXISTS — Partial)

A substantial internal OS lives at `/app/os/`. It is auth-gated (`middleware.ts` redirects `/os/**` to `/signin` if no session). This is eevolvv's internal operations system for managing clients.

### Existing OS capabilities:
- **Clients CRUD:** `/api/os/clients/[id]/route.ts` — full GET/PATCH/DELETE per client
- **Client list:** `/api/os/clients/route.ts` — lists with agent count and latest task
- **Tasks per client:** `/api/os/clients/[id]/tasks/` — CRUD
- **Agents per client:** `/api/os/clients/[id]/agents/` — CRUD with `trigger_type`, `trigger_config`, `status`
- **Agent runs:** `/api/os/clients/[id]/agents/[agentId]/run/route.ts` — executes Claude agent, logs to `agent_runs`
- **Scheduled cron:** `vercel.json` runs `/api/cron/agents` at 9am daily — fires all `trigger_type='schedule'` agents
- **Langfuse tracing:** `lib/langfuse.ts` traces each agent run
- **Pipeline/deals:** `pipeline_deals` table (Supabase migration 005)
- **Investor tracking:** `investors` table
- **Company tasks:** `company_tasks` table

### What the OS is missing for the pivot:
- No client self-service portal (client-facing UI)
- No automated client creation from Stripe webhook
- No build queue / project management for autonomous builds
- No QA pipeline integration
- No deployment tracking
- No subscription status field on client record

---

## 6. Supabase Schema — Existing Tables

| Table | Purpose | Notes |
|-------|---------|-------|
| `submissions` | Diagnostic intake + generated reports | Has: email, business_type, top_pains, tier, report, status, ip_address |
| `clients` | OS client records | Has: name, company, email, stage, health, submission_id, contract_value |
| `agents` | Per-client AI agents | Has: trigger_type, trigger_config, status, share_token, run_count |
| `agent_runs` | Agent execution log | Has: status, output, tokens, latency_ms, triggered_by |
| `service_tasks` | Client delivery tasks | Referenced in clients query |
| `documents` | Client knowledge base (pgvector RAG) | vector(768), match_documents() function |
| `company_tasks` | Internal eevolvv tasks | category enum: fundraise/product/sales/ops/marketing |
| `pipeline_deals` | Sales pipeline | stage enum: lead→discovery→proposal→contract→active|lost |
| `investors` | Investor CRM | stage enum: intro→meeting→dd→term_sheet→closed|passed |
| `os_state` | Key-value store | Generic persistent state |

**Missing for pivot:**
- `subscriptions` table (Stripe sub ID, plan tier, status, billing cycle)
- `builds` table (build queue, status, assigned_to, repo_url, deploy_url)
- `onboarding_sessions` table (post-payment intake state)
- `deployments` table (per-client deployment history)
- `subscription_id` foreign key on `clients`
- `build_id` on `clients`

---

## 7. Cron / Automation Infrastructure

`vercel.json` schedules one cron: `/api/cron/agents` at `0 9 * * *` (daily 9am).
- Fetches all `agents` with `trigger_type='schedule'` and `status='live'`
- Respects `trigger_config.schedule.days` for day-of-week filtering
- POSTs to agent run endpoint with `triggeredBy: 'schedule'`
- Auth via `CRON_SECRET` bearer token

**Assessment:** Basic cron infrastructure exists. Cannot handle: build queue processing, multi-step pipeline coordination, 48-hour watchdog (notify if no action), QA trigger, or deployment automation.

---

## 8. Email Infrastructure

- **Resend** with react-email templates (`emails/EvolutionReport.tsx`)
- `lib/email.ts` has `sendRunEmail` for agent run notifications
- CTA in email: hardcoded `https://calendly.com/hello-eevolvv`
- No welcome email, no subscription confirmation, no build status email

---

## 9. Tier System — Current State

In `app/page.tsx` (lines 66–113), 5 tiers exist in UI:
- Micro ($29–$49/mo) — WhatsApp-native, 48hr live
- Seed ($500–$1,500) — one-time project pricing
- Grow ($3,500–$7,500) — one-time project pricing
- Scale ($15,000–$75,000) — one-time project pricing
- Enterprise ($50,000–$250,000+) — one-time project pricing

The proposed pivot tiers ($99/mo, $499/mo, $1,999/mo as recurring subscriptions with build included) are a completely different pricing model from what's in the UI. No recurring subscription logic exists anywhere in the codebase.

---

## 10. Auth Infrastructure

- `next-auth` v5 beta installed (`package.json`)
- `lib/auth.ts` referenced in middleware
- Only `/os/**` is protected
- No client-facing auth (clients cannot log in)
- Signin page at `/app/signin/`

---

## 11. Analytics and Observability

- **PostHog** (client + server): `posthog-js`, `posthog-node`
  - Events: `diagnostic_chat_started`, `diagnostic_intake_completed`, `diagnostic_report_viewed`, `diagnostic_report_generated`, `diagnostic_cta_clicked`, `diagnostic_error`, `diagnostic_rate_limited`
- **Sentry**: `@sentry/nextjs` — error tracking
- **Langfuse**: agent run tracing (tokens, latency, I/O)
- No revenue tracking, no subscription events in PostHog

---

## 12. Agent Runtime

The agent run endpoint (`app/api/os/clients/[id]/agents/[agentId]/run/route.ts`) is the most advanced piece of infrastructure:
- Loads agent instructions from DB
- Fetches client context + tasks
- Calls Claude claude-sonnet-4-6 with structured context
- Logs: output, tokens, latency to `agent_runs`
- Sends email for `schedule` and `share_page` triggers
- Traces to Langfuse
- Updates `run_count` and `last_run_at` on agent

**This is usable as the autonomous build agent backbone.** The pattern exists; it needs extension for build-specific workflows.

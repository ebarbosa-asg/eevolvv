# Internal Dependencies: Report Feature

**Phase:** Internal Research
**Date:** 2026-05-08

---

## Data Flow: End-to-End Report Generation

```
User types in ChatEngine
    → POST /api/chat (streaming SSE)
        ← AI streams response token-by-token
        ← When AI ready: includes [READY] sentinel in response
    → ChatEngine detects [READY], transitions to 'extracting' phase
    → POST /api/extract-intake
        → internally calls Claude (claude-sonnet-4-6, max_tokens: 600)
            to extract structured JSON from conversation
        → if email + businessType extracted successfully:
        → POST /api/diagnostic (internal server-to-server fetch)
            → rate limit check (in-memory + Supabase)
            → saveSubmission() to Supabase 'submissions' table
            → Claude (claude-sonnet-4-6, max_tokens: 4000)
                with buildSystemPrompt(industry) + structured intake data
            → update Supabase submission with report + status: 'completed'
            → Resend.emails.send() [non-blocking async]
                ← renders EvolutionReportEmail React component
            → PostHog events: diagnostic_report_generated, report_generated
        ← returns: { success, report, businessName, email, name, tier, submissionId, durationMs }
    ← ChatEngine receives report, sets state, transitions to 'report' phase
    → TierCards renders, user clicks tier → POST /api/stripe/checkout → Stripe redirect
```

---

## Key Files and Their Roles

| File | Role | Called By |
|------|------|-----------|
| `components/ChatEngine.tsx` | Main orchestrator — manages all 4 phases, state, animations | `app/page.tsx` (DiagnosticSection) |
| `components/TierCards.tsx` | Post-report payment wall | ChatEngine (report phase, revealStage 4) |
| `components/VolvvE.tsx` | Avatar sprite with 4 animation states | ChatEngine |
| `lib/stripe-prices.ts` | Tier configs (seed/core/evolve), Stripe price IDs | TierCards |
| `app/api/chat/route.ts` | Streaming Claude chat endpoint | ChatEngine.sendMessage() |
| `app/api/extract-intake/route.ts` | Extracts structured data from conversation | ChatEngine.generateReport() |
| `app/api/diagnostic/route.ts` | Rate limits, generates Claude report, saves to DB, sends email | extract-intake (internal fetch) |
| `lib/diagnosticPrompts.ts` | `buildSystemPrompt(industry)` — base prompt + 14 industry contexts | diagnostic route |
| `lib/supabase.ts` | `saveSubmission()`, `markEmailSent()`, `supabase` client | diagnostic route |
| `lib/rateLimit.ts` | `checkRateLimit()`, `checkRateLimitWithSubscription()` | diagnostic route |
| `emails/EvolutionReport.tsx` | React email template for report delivery | diagnostic route (via Resend) |
| `lib/email-helpers.ts` | Utility functions for all transactional emails (welcome, follow-ups, etc.) | webhook-handlers, API routes |
| `app/globals.css` | All `.report-content`, `.report-stat-grid`, `.diagnostic-*`, `.pricing-tier-grid` styles | All report UI |
| `app/page.tsx` | Homepage, DiagnosticSection, all CTAs | App root |

---

## API Response Shape: /api/diagnostic

```typescript
{
  success: true,
  report: string,          // Raw markdown with ### headers
  businessName: string,    // businessName || businessType
  email: string,
  name: string,
  tier: string,            // 'seed' | 'core' | 'evolve' | 'grow' | 'scale' etc.
  submissionId: string,    // Supabase UUID
  durationMs: number,
  timestamp: string,       // ISO string
}
```

Received by ChatEngine at line 285–300, stored in `report` state as `{ text, businessName, email }`.

---

## Supabase Schema (submissions table)

Columns written by `saveSubmission()`:
- `name`, `email`, `business_name`, `business_type`, `industry`
- `revenue`, `team_size`, `top_pains`, `tools`
- `customer_journey`, `error_points`, `hours_freed`
- `tier`, `ip_address`, `status` ('pending' → 'completed' | 'error')
- `report` (text), `duration_ms`, `email_sent` (bool)

No `submission_id` column for public retrieval — submissions are private by IP/email.

---

## Report Content Format (from diagnostic prompt)

Claude outputs 7–8 sections using `###` markdown headers:
1. `### BUSINESS SNAPSHOT`
2. `### TOP AUTOMATION OPPORTUNITIES`
3. `### ESTIMATED ROI PROJECTION`
4. `### QUICK WINS (Deploy in <2 weeks)`
5. `### RECOMMENDED SERVICE TIER`
6. `### YOUR ROADMAP`
7. `### THE BOTTOM LINE`
8. `### TALENT MATCH (OPTIONAL)` — only if relevant

Each section uses `**bold**` for emphasis and `- ` for bullet lists.

---

## PostHog Event Tracking Points

| Event | Fired When | Properties |
|-------|-----------|------------|
| `diagnostic_started` | First message sent | source (pricing/homepage) |
| `diagnostic_chat_started` | First message | tier |
| `diagnostic_intake_completed` | [READY] signal received | tier, message_count |
| `diagnostic_report_viewed` | Report received | businessName, tier, submissionId |
| `payment_wall_viewed` | revealStage reaches 4 | trigger: 'chat_end' |
| `tier_selected` | User clicks a tier | tier, interval, price |
| `checkout_started` | Stripe URL received | tier, interval |
| `diagnostic_error` | Any error state | stage, error |
| `diagnostic_rate_limited` | Rate limit hit | ip, is_subscribed |

---

## Email Infrastructure

Report email (`EvolutionReport.tsx`) is sent directly inside `/api/diagnostic/route.ts` as a non-blocking async IIFE — not via `lib/email-helpers.ts`. The `email-helpers.ts` file handles all lifecycle emails (welcome, follow-ups, build status, etc.) but the initial report delivery bypasses it.

Follow-up email sequence (FollowUp1, FollowUp2, FollowUp3) references the report but there's no automation that triggers these — they appear to require manual triggering or a cron job that doesn't exist yet.

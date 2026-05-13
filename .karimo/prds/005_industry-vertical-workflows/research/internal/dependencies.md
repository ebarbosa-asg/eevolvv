# Dependencies — Industry Vertical Workflows

## Core Data Flow

```
Landing Page (e.g., /dental/page.tsx)
  └─ passes defaultIndustry="Medical / Healthcare"
      └─ ChatEngine.tsx
          ├─ POST /api/chat → INDUSTRY OVERRIDE in system prompt
          └─ POST /api/extract-intake → extracts structured data, locks industry
              └─ POST /api/diagnostic → buildSystemPrompt(industry) → Claude → Supabase
                  ├─ saveSubmission() → submissions table
                  ├─ EvolutionReportEmail → Resend
                  └─ returns { report, stats, submissionId, tier }
                      └─ ChatEngine renders report phase
                          └─ /report/[id] permalink
```

## Files That Must Change for Vertical-Specific Flows

| File | Why It Needs Changing |
|------|----------------------|
| `lib/diagnosticPrompts.ts` | Add dental-specific industry key + context block; add per-vertical question sets |
| `app/api/chat/route.ts` | Inject industry-specific intake questions based on `defaultIndustry` |
| `app/api/extract-intake/route.ts` | Pass `defaultIndustry` through to diagnostic (already done at line 66); potentially add dental-specific extraction fields |
| `components/ChatEngine.tsx` | No code changes needed for basic flow; UI customization optional |
| `app/dental/page.tsx` | Fix `defaultIndustry` from `"Medical / Healthcare"` to dental-specific key |
| `app/report/[id]/page.tsx` | Fetch `industry` from submissions; render vertical-specific sections |
| `emails/EvolutionReport.tsx` | Already accepts `industry` prop — add conditional sections per vertical |
| `emails/FollowUp1.tsx`, `FollowUp2.tsx`, `FollowUp3.tsx` | Add `industry` prop support + vertical-specific copy |

## Files That Could Stay Unchanged

| File | Why It's Fine As-Is |
|------|---------------------|
| `lib/supabase.ts` | `SubmissionRow` already has `industry?: string` field |
| `supabase/migrations/001_create_submissions.sql` | `industry TEXT` column already exists |
| `app/api/diagnostic/route.ts` | Already calls `buildSystemPrompt(industry)` — just needs the right key passed in |
| `lib/format-report.ts` | Markdown formatter is generic by design — fine to keep |

## Key Interfaces

**`ChatEngine` Props:**
```typescript
{ defaultTier: string; defaultIndustry?: string }
```

**`SubmissionRow` (lib/supabase.ts):**
```typescript
{ industry?: string; business_type: string; ... }
```

**`buildSystemPrompt(industry: string)` (lib/diagnosticPrompts.ts:240):**
Returns `BASE_PROMPT + INDUSTRY_CONTEXT[industry] ?? DEFAULT_CONTEXT`

## External Integrations Listed on Pages (Not Yet Built)

| Vertical | Listed Integrations |
|----------|---------------------|
| Dental | Dentrix, Eaglesoft, Open Dental, Carestream, Weave, NexHealth, Zocdoc, Availity, Stripe |
| Restaurant | Toast, Square, Clover, OpenTable, Resy, 7shifts, QuickBooks, Google Reviews, Yelp |
| Fitness | Mindbody, Glofox, Pike13, ABC Fitness, Zen Planner, HubSpot, MailChimp, Stripe, Google Reviews |

These are marketing claims only. No actual integrations are built. Any vertical-specific build must define which integrations are first-priority.

## Supabase Tables in Scope

| Table | Relevant Columns |
|-------|-----------------|
| `submissions` | `industry`, `business_type`, `tier`, `report`, `email`, `status` |
| `clients` | `business_type`, `stage`, `health`, `submission_id` (no `industry` column) |
| `builds` | `tier`, `status`, `notes` (no `industry` column) |

**Gap:** `clients` and `builds` tables have no `industry` column. Multi-client operations (the OS dashboard) cannot currently filter by industry vertical.

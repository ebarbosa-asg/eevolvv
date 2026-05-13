# Internal Research Findings — Industry Vertical Workflows

## What Already Works

### 1. `INDUSTRY_CONTEXT` architecture in `lib/diagnosticPrompts.ts` is solid
23 industry context blocks keyed by string. Each defines automation targets, quantified benchmarks, common tech stack, highest-ROI automations, and industry vocabulary. `buildSystemPrompt(industry)` appends the right block at line 240. Adding a new vertical = ~30 lines of curated copy.

### 2. End-to-end `defaultIndustry` propagation works
`page.tsx` → `ChatEngine` → `api/chat` (skips "what kind of business" question via INDUSTRY OVERRIDE at line 31) → `api/extract-intake` (locks industry at line 66: `if (defaultIndustry) extracted.industry = defaultIndustry`) → `api/diagnostic` (calls `buildSystemPrompt(industry)` at line 114). Chain is intact.

### 3. `submissions` table has `industry TEXT` column
Migration 001 line 15. Every submission stores industry. Segmented analytics possible without schema changes.

### 4. Landing page template is already templated
All industry pages use identical 6-section structure: Hero → Stats bar → Ghost Work grid → Sub-types → How it works → Integrations bar → Testimonials → ChatEngine CTA. New vertical scaffolds in under an hour.

---

## Critical Bug (Ship as Hotfix)

**Dental page passes wrong industry key.**

`app/dental/page.tsx` line 378:
```tsx
<ChatEngine defaultTier="core" defaultIndustry="Medical / Healthcare" />
```

No `"Dental / Oral Health"` entry exists in `INDUSTRY_CONTEXT`. Dental visitors get `Medical / Healthcare` context — which references Athenahealth, Kareo, SimplePractice, RVU, CPT codes. Not Dentrix, recall rate, hygiene scheduling. Fix: add dental entry to `diagnosticPrompts.ts` + update the key string in `dental/page.tsx`. Two files, ~32 lines total.

---

## Structural Gaps (All Verticals)

### Gap 1: Chat intake questions are generic
`CHAT_SYSTEM_PROMPT` (api/chat/route.ts line 6) asks same 7 fields for every industry. A dental owner is never asked about recall rate, no-show rate, or insurance mix. The AI can't give expert dental recommendations without expert dental inputs.

### Gap 2: Report UI is not industry-aware
`app/report/[id]/page.tsx` fetches `id, business_name, report, tier, email, created_at` — does NOT fetch `industry`. Report is generic markdown-to-HTML. No KPI callout panels, no benchmark comparisons, no vertical integration CTAs.

### Gap 3: Follow-up emails are generic
`emails/FollowUp1.tsx`, `FollowUp2.tsx`, `FollowUp3.tsx` have zero `industry` prop. All leads get identical nurture copy. A dental owner should get recall campaign language; a gym owner should get churn/EFT language.

### Gap 4: No automation templates exist
ChatEngine shows `> Loading 1,200+ automation templates` (line 28) — this is UI copy only. No template library, workflow definitions, or per-industry automation catalog exists anywhere in the codebase.

### Gap 5: `clients` and `builds` tables lack `industry` column
OS dashboard cannot filter by vertical. Can't segment client list or build queue by industry.

### Gap 6: All testimonials are placeholder
`{/* TODO: replace with real [industry] client testimonials */}` with fabricated names (Marcus T., Priya S., Jordan R.) repeated across all pages.

### Gap 7: No per-industry onboarding
`app/onboard/[token]/OnboardingForm.tsx` is generic. Dental onboarding should ask about practice management software, HIPAA status, insurance credentialing. Fitness onboarding should ask for Mindbody/Glofox API credentials.

---

## Minimum Change Surface per Vertical

| File | Change |
|------|--------|
| `lib/diagnosticPrompts.ts` | Add/fix `INDUSTRY_CONTEXT` entry; add per-industry intake question set |
| `app/api/chat/route.ts` | Inject industry-specific intake questions when `defaultIndustry` is set |
| `app/{vertical}/page.tsx` | Fix `defaultIndustry` key |
| `app/report/[id]/page.tsx` | Fetch `industry`; render vertical-specific KPI panels |
| `emails/FollowUp1-3.tsx` | Add `industry` prop + conditional vertical copy |
| `app/onboard/[token]/OnboardingForm.tsx` | Add industry-aware question branches |
| `supabase/` | New migration: add `industry` to `clients` table |

### Recommended Architecture Addition
`lib/industries/{vertical}.ts` — centralizes question sets, benchmarks, and integration lists per vertical. Makes all the above coherent rather than scattered.

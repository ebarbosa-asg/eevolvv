# Internal Patterns — Industry Vertical Workflows

## Pattern 1: Industry Override via `defaultIndustry` Prop

**Location:** `components/ChatEngine.tsx:63`, `app/api/chat/route.ts:31`

Every industry landing page passes `defaultIndustry` to `ChatEngine`. The chat route injects an `INDUSTRY OVERRIDE` block into the system prompt:

```
"Do NOT ask what kind of business they run — skip that question entirely. Ask their name and business name first, then go straight into their specific pain points..."
```

This is the only behavioral difference in the chat flow per industry. The override skips one question but does not inject industry-specific questions, terminology, or diagnostic angles.

**Evidence:**
- `app/dental/page.tsx:378` → `<ChatEngine defaultTier="core" defaultIndustry="Medical / Healthcare" />`
- `app/restaurant/page.tsx:378` → `<ChatEngine defaultTier="core" defaultIndustry="Restaurant / Food & Beverage" />`
- `app/fitness/page.tsx:384` → `<ChatEngine defaultTier="core" defaultIndustry="Gym / Fitness / Wellness" />`

**Critical finding:** The dental page passes `"Medical / Healthcare"` not `"Medical / Dental"` — the industry key does not precisely match a dental-specific context block. It falls back to the generic healthcare context.

## Pattern 2: `INDUSTRY_CONTEXT` Record in `diagnosticPrompts.ts`

**Location:** `lib/diagnosticPrompts.ts:48–231`

23 industry context blocks keyed by exact string labels. Each block defines:
- Key automation targets
- Industry benchmarks (quantified)
- Common software stack
- Highest-ROI automations
- Industry terminology/language guide

The `buildSystemPrompt(industry)` function at line 240 appends the relevant context block to the base report prompt. If no match, it uses `DEFAULT_CONTEXT` (line 234).

**The architecture is extensible by design.** Adding a new industry is: add entry to `INDUSTRY_CONTEXT`, add entry to `getIndustryShortName` map.

## Pattern 3: `extract-intake` Forcibly Locks Industry from Landing Page

**Location:** `app/api/extract-intake/route.ts:65–66`

```typescript
// If we know the industry from the landing page, always use that — don't trust the extraction
if (defaultIndustry) extracted.industry = defaultIndustry
```

This ensures industry-page visitors always get the correct context block applied to their report, even if Claude's extraction would have assigned a different label.

## Pattern 4: `SubmissionRow` Has `industry` Field

**Location:** `lib/supabase.ts:20`, `supabase/migrations/001_create_submissions.sql:15`

The `submissions` table has `industry TEXT` (nullable). Every completed submission stores the industry label. This enables future segmented reporting and per-industry analytics.

## Pattern 5: Template Structure Is Identical Across All Landing Pages

**Evidence from comparing dental, restaurant, fitness pages:**

All three use the same 6-section structure:
1. Hero (industry-specific headline + CTA)
2. Stats bar (4 quantified stats, industry-specific values)
3. Ghost Work grid (6 rows: code, label, pain, win, hrs/wk)
4. Practice/Format types (8 sub-type cards)
5. How it works (3-step process — identical copy across all pages)
6. Integrations bar (industry-specific tools listed)
7. Testimonials (placeholder — all marked `TODO: replace with real testimonials`)
8. ChatEngine CTA section

**The page template is already templated.** New verticals can be scaffolded from this pattern in minutes.

## Pattern 6: Consistent CSS Class Reuse Across Industry Pages

**Evidence:** `fitness-stats-bar`, `fitness-ghost-row`, `fitness-studio-grid`, `fitness-how-grid`, `fitness-testimonial-grid` — classes named after fitness but reused on dental and restaurant pages verbatim.

This is a naming inconsistency: dental page uses `className="fitness-stats-bar"` (line 139), as does restaurant. No dental-specific CSS classes exist.

## Pattern 7: Report Template Is Fully Generic

**Location:** `app/report/[id]/page.tsx`, `components/ChatEngine.tsx:587`

The report page fetches `business_name`, `report`, `tier`, `email` from Supabase. It does NOT fetch `industry`. The rendered HTML comes from `formatReport(submission.report)` which is a markdown-to-HTML formatter — completely agnostic to industry.

No industry-specific report sections, KPI callouts, or benchmark comparisons exist in the rendered report UI.

## Pattern 8: Email Templates Are Mostly Industry-Agnostic

**Location:** `emails/EvolutionReport.tsx:91`

Only `EvolutionReport.tsx` references `industry` — it renders it as a metadata line: `"Industry: {industry} · Tier: {tierLabel}"`. The follow-up sequences (FollowUp1, FollowUp2, FollowUp3), MonthlyReport, and WelcomeEmail have zero industry-specific logic.

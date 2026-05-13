# Research Summary — Industry Vertical Workflows

**Feature:** Industry-specific diagnostic + build platform, one vertical at a time
**Date:** 2026-05-09
**Status:** Research complete — ready for planning

---

## The Big Picture

eevolvv already has the right architecture. The `INDUSTRY_CONTEXT` system in `lib/diagnosticPrompts.ts`, the `defaultIndustry` prop chain, and 15 industry landing pages are all in place. The platform looks industry-specific but isn't yet — the same generic chat questions run for every vertical, the report renders generic markdown regardless of industry, and follow-up emails have zero vertical awareness.

The gap is not architectural. It's content, questions, and UI depth.

---

## Critical Bug to Fix Now

`app/dental/page.tsx` passes `defaultIndustry="Medical / Healthcare"` — a key that doesn't match any dental-specific context block. Every dental visitor gets a report written for doctors using Athenahealth. **Fix is 2 files, ~32 lines.**

---

## Build Order Recommendation

**Start with Fitness.** Then Dental. Then Restaurant.

| Vertical | Why Now / Why Wait |
|----------|--------------------|
| Fitness | No regulatory complexity, owner-operator buyer, 30-day measurable results, no competitor does diagnostic → build |
| Dental | Higher ACV, huge market, but HIPAA infrastructure needed for patient-facing automations |
| Restaurant | Largest TAM but highest vendor skepticism — needs case studies first |

---

## What "One Vertical Done Correctly" Means

For each vertical, done = all of these:

1. **Industry-specific chat intake** — 6-8 questions tailored to that vertical (churn rate for fitness, recall rate for dental, not generic "pain points")
2. **Industry-specific system prompt** — Correct `INDUSTRY_CONTEXT` entry with real benchmarks, real software names, real terminology
3. **Industry-aware report** — Fetches `industry` from Supabase, renders vertical KPI callout panels with dollar-value benchmark comparisons
4. **Industry-aware follow-up emails** — Fitness language vs. dental language; vertical-specific automation CTA
5. **Industry-aware onboarding** — Asks for the right software credentials, names the first automation to build
6. `clients` table has `industry` column (one migration)
7. `lib/industries/{vertical}.ts` config module centralizing question sets, benchmarks, integration list

---

## Fitness Vertical KPIs (First Build)

| KPI | Industry Avg | Top Performers | Dollar Impact |
|-----|-------------|----------------|---------------|
| Monthly churn | 4-6% | <4% | Measurable in 30 days |
| Lead-to-trial conversion | 15-25% | 40-60% | — |
| ARPM | $50-150 (standard) | $250+ (boutique) | — |
| Annual retention | 66.4% median | — | — |
| Class utilization | — | 70%+ | — |

Top automations: churn early-warning, EFT dunning, 14-day lead nurture, class utilization report, referral campaign.

---

## Files to Change (Per Vertical)

| File | Change |
|------|--------|
| `lib/diagnosticPrompts.ts` | Add vertical `INDUSTRY_CONTEXT` entry + intake question set |
| `app/api/chat/route.ts` | Inject industry-specific intake questions when `defaultIndustry` is set |
| `app/{vertical}/page.tsx` | Fix `defaultIndustry` key string |
| `app/report/[id]/page.tsx` | Fetch `industry`; render vertical KPI panels |
| `emails/FollowUp1-3.tsx` | Add `industry` prop + conditional vertical copy |
| `app/onboard/[token]/OnboardingForm.tsx` | Industry-aware question branches |
| `supabase/` | Migration: add `industry` to `clients` table |
| `lib/industries/{vertical}.ts` | NEW: centralized vertical config module |

---

## Next Step

Run `/karimo:plan --prd industry-vertical-workflows` to build the PRD and task breakdown.

# PRD: Industry Vertical Workflows
**Slug:** industry-vertical-workflows
**Status:** Planning complete
**Date:** 2026-05-09
**Owner:** Eduardo Barbosa

---

## Overview

eevolvv's diagnostic platform already has the architectural bones for vertical specialization — `INDUSTRY_CONTEXT` blocks in `lib/diagnosticPrompts.ts`, the `defaultIndustry` prop chain from landing page through report, and 15 industry landing pages. What it lacks is depth: the same generic chat questions run for every vertical, the report renders generic markdown regardless of industry, and follow-up emails have zero vertical awareness.

This PRD defines the work to make fitness the first fully-realized vertical — specific intake questions, system prompt, KPI panels, email copy, and onboarding branch — while simultaneously establishing `lib/industries/{vertical}.ts` as the reusable config pattern that makes every future vertical a structured, predictable build.

Fitness is not just the first client vertical. It is the template for all verticals that follow.

**Delivery model:** eevolvv builds Month 1 automation (churn early-warning system) as proof-of-concept included in Core tier. Months 2-3 automations are delivered on retainer.

---

## Goals

1. Make the fitness diagnostic experience fully vertical-specific: intake questions, report KPI panels, follow-up email copy, and onboarding form all reference fitness-specific language, benchmarks, and software.
2. Establish `lib/industries/{vertical}.ts` as the canonical config pattern so every future vertical is a predictable, structured addition — not a scattered one-off.
3. Fix the dental `defaultIndustry` bug so dental visitors receive the correct diagnostic context immediately.
4. Ship dental as the second vertical using the fitness template, with one conditional: dental automations touching patient records require HIPAA groundwork, so diagnostic-only is the safe initial scope.
5. Reach 90-day client retention on the first fitness client, with Month 1 automation live and producing a documented measurable result (churn drop rate or EFT recovery rate).

---

## Non-Goals

- Restaurant vertical (Phase 3 — requires fitness and dental case studies first)
- Full automation library / template catalog (UI copy at `> Loading 1,200+ automation templates` is intentionally deferred)
- HIPAA BAA infrastructure for patient-facing dental automations (diagnostic is safe; automations are future phase)
- User authentication or session-based rate limiting upgrades
- New pricing tiers or pricing changes (discount discounts only, no tier restructuring)
- Fully automated onboarding (Calendly + admin notification is human-in-the-loop by design for now)
- Testimonials replacement (placeholder names remain until real client results exist)

---

## User Stories

**Fitness client — diagnostic:**
As a boutique gym owner completing the diagnostic, I want the AI to ask me about my current churn rate, gym software, and what happens when an EFT fails — so the report I receive feels like it was written by someone who understands my business, not a generic AI tool.

**Fitness client — report:**
As a gym owner reading my Evolution Report, I want to see my churn rate benchmarked against the 4-6% industry average with an actual dollar-value retention opportunity calculated — so I can justify the investment to myself before the sales call.

**Fitness client — email nurture:**
As a gym owner who completed the diagnostic three days ago, I want the follow-up email to reference "members," "EFT," and "class utilization" — not "customers," "payments," and "appointments" — so the communication feels relevant and I read past the first sentence.

**Fitness client — onboarding:**
As a new fitness client who just paid, I want the onboarding form to ask for my Mindbody or Glofox login and name the specific automation eevolvv will build first — so I know exactly what I'm getting and when.

**Eduardo — operator:**
As Eduardo, when a new fitness client pays, I want an immediate admin notification so I can book the kickoff Calendly within the same business day — the current human-in-loop step before this becomes fully automated.

**Dental client — diagnostic:**
As a dental practice owner, I want the AI to ask about my recall rate, no-show rate, and practice management software (Dentrix, Eaglesoft, Open Dental) — not generic business questions — so the diagnostic output maps to the real levers in my practice.

---

## Technical Approach

### Architecture: `lib/industries/{vertical}.ts` as the central config pattern

Each vertical gets a single TypeScript config module that centralizes everything vertical-specific. This module is the single import point for all downstream files.

```
lib/industries/
  fitness.ts     ← Wave 1
  dental.ts      ← Wave 5
```

Each config module exports:

```typescript
export const VERTICAL_CONFIG = {
  key: string,                    // must match INDUSTRY_CONTEXT key in diagnosticPrompts.ts
  displayName: string,
  intakeQuestions: string[],      // 6-8 ordered questions for api/chat/route.ts
  benchmarks: Record<string, { avg: string; target: string; dollarImpact?: string }>,
  softwareOptions: string[],      // for onboarding dropdown
  automationCatalog: Automation[], // all 5 named automations
  emailVocabulary: {              // for FollowUp emails
    customer: string,             // "member"
    payment: string,              // "EFT"
    appointment: string,          // "class"
  },
  kpiPanels: KPIPanel[],         // for report page
  onboardingFields: OnboardingField[], // for OnboardingForm.tsx
}
```

### 7 Change Surfaces Per Vertical

| Surface | File | What Changes |
|---------|------|-------------|
| 1. Landing page key | `app/{vertical}/page.tsx` | Fix or set `defaultIndustry` string to match config key |
| 2. System prompt | `lib/diagnosticPrompts.ts` | Add/fix `INDUSTRY_CONTEXT` entry using real benchmarks + terminology |
| 3. Chat intake | `app/api/chat/route.ts` | Inject vertical intake questions when `defaultIndustry` matches config key |
| 4. DB column | `supabase/migrations/` | Add `industry` to `clients` table (one migration, shared across all verticals) |
| 5. Report UI | `app/report/[id]/page.tsx` | Fetch `industry`, render vertical KPI panels with dollar-value benchmarks |
| 6. Follow-up emails | `emails/FollowUp1-3.tsx` | Add `industry` prop, inject vertical vocabulary + automation CTAs |
| 7. Onboarding form | `app/onboard/[token]/OnboardingForm.tsx` | Industry-aware branch: ask for correct software credentials, name first automation |

### Data flow

```
app/fitness/page.tsx
  → ChatEngine (defaultIndustry="fitness")
  → api/chat/route.ts (inject fitness intake questions from VERTICAL_CONFIG)
  → api/extract-intake (locks industry = "fitness")
  → api/diagnostic (buildSystemPrompt("fitness") → INDUSTRY_CONTEXT block)
  → Supabase (submissions + clients tables, industry stored)
  → app/report/[id]/page.tsx (fetch industry → render fitness KPI panels)
  → emails/FollowUp1-3.tsx (industry prop → fitness vocabulary)
  → app/onboard/[token]/OnboardingForm.tsx (fitness branch → gym software credentials)
```

---

## Research Findings

### Internal

- `INDUSTRY_CONTEXT` system in `lib/diagnosticPrompts.ts` is architecturally solid: 23 blocks keyed by string, `buildSystemPrompt(industry)` appends the right one at line 240. Adding a new vertical is ~30 lines of curated copy.
- The `defaultIndustry` prop chain (page → ChatEngine → api/chat → api/extract-intake → api/diagnostic) is intact and working.
- `submissions` table already has `industry TEXT` column (migration 001, line 15). The `clients` table does not — one migration needed.
- **Critical bug:** `app/dental/page.tsx` line 378 passes `defaultIndustry="Medical / Healthcare"` — a key with no dental-specific context. Every dental visitor receives Athenahealth/CPT codes context. Fix is 2 files, ~32 lines.
- Chat intake questions (in `api/chat/route.ts`) are generic for all industries. No vertical-specific question injection exists yet.
- Report page does not fetch `industry` column. No KPI panels, no benchmark comparisons, no vertical CTAs.
- Follow-up emails have zero `industry` prop — all leads receive identical nurture copy.
- Onboarding form is generic — no software-specific credential fields, no automation naming.

### External

- Fitness AI market projected at $10.3B by 2030. 63% of boutique studios planning AI by 2025.
- Monthly churn benchmark: 4-6% industry average; AI reduces 25-35%. Lead-to-trial conversion: 15-25% without automation, 40-60% with.
- Dental: $1.96B AI market (2025), CAGR 10.77%. Recall rate avg 55-65%; top practices 85-90%. Each 10% gain = $50K-$100K/yr.
- 64% of dental practices would pay 20% premium for AI automation. Monthly billing ($300-600/mo) strongly preferred.
- Vertical SaaS commands 2-3x higher ACVs than horizontal tools (Tidemark 2025). Multi-product vertical companies grow 21% faster.
- Competitive gap in dental: Weave, NexHealth, Doctible, Arini AI are all point tools (communication/scheduling). None do diagnostic + custom build.

---

## Automation Catalog — Fitness

All 5 automations are in scope. Delivery model: Month 1 built by eevolvv as proof-of-concept. Months 2-3 delivered on retainer.

| # | Automation | Month | Description |
|---|-----------|-------|-------------|
| 1 | **Churn early-warning system** | 1 (included) | Flags at-risk members 30 days before they cancel based on attendance drop-off, billing flags, and engagement signals. Triggers staff alert or automated re-engagement sequence. |
| 2 | **EFT dunning sequence** | 2 (retainer) | 3-touch SMS + email sequence triggered on failed EFT payment. Recovers revenue without requiring front desk action. |
| 3 | **14-day lead nurture sequence** | 2 (retainer) | Automated follow-up for leads who book a trial but don't convert. Fitness-specific copy: class experience, community, transformation proof. |
| 4 | **Class utilization weekly report** | 3 (retainer) | Auto-generated report showing low-utilization time slots, instructor performance, and member engagement by class type. Delivered to owner every Monday. |
| 5 | **Referral campaign automation** | 3 (retainer) | Triggered outreach to engaged members (high attendance, renewing memberships) with referral incentive. Tracks source and conversion. |

**Build readiness required before Month 1 build:**
- Gym software name (Mindbody, Glofox, Zen Planner, Pike13, or other)
- Login credentials for gym software
- API key (if available for the platform)

---

## Post-Payment Flow

Current state (human-in-loop):

1. Client pays via Stripe
2. Onboarding form is sent automatically (token-based link)
3. Client completes onboarding form (gym software credentials, current churn rate, member count, API key)
4. **Admin notification sent to Eduardo** with client name, vertical, and form data
5. **Calendly booking CTA** presented to client on onboarding confirmation page
6. Eduardo receives booking notification and conducts kickoff call

North star (future phase): fully automated — kickoff call replaced by automated handoff to build agent queue.

---

## Success Metrics

| Metric | Definition | Measurement |
|--------|-----------|-------------|
| **90-day retention** | Client is still active and paying at day 90 | Supabase client record: `status = active` at day 90 |
| **Month 1 automation live** | Churn early-warning system is deployed and running in client's environment | Build record marked complete; client confirms in kickoff check-in |
| **Documented measurable result** | At least one of: churn drop rate measured, EFT recovery rate tracked, or lead conversion improvement logged | Client-reported metric or integration data captured at 30-day check-in |

---

## Future Phases

| Phase | Description |
|-------|-------------|
| **Fully automated onboarding** | No human touchpoint — kickoff call replaced by async agent briefing and automated build queue assignment |
| **Dental vertical** | Same 7-surface template. Diagnostic-only is safe now. Automations touching patient records require HIPAA BAA infrastructure before shipping. |
| **Restaurant vertical** | Largest TAM. Requires fitness + dental case studies to overcome vendor skepticism. Toast/Square/OpenTable integrations. |
| **Automation template library** | Structured catalog backing the UI copy at `> Loading 1,200+ automation templates`. Per-vertical automation definitions with connection specs. |
| **OS dashboard vertical filtering** | Segment client list, build queue, and revenue by industry. Requires `industry` column on `clients` table (delivered in Wave 1 of this PRD). |

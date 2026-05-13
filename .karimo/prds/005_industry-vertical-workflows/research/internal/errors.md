# Internal Errors & Gaps — Industry Vertical Workflows

## Gap 1: Wrong Industry Key on Dental Page

**Location:** `app/dental/page.tsx:378`

```tsx
<ChatEngine defaultTier="core" defaultIndustry="Medical / Healthcare" />
```

The dental landing page passes `"Medical / Healthcare"` as the `defaultIndustry`. In `diagnosticPrompts.ts`, this maps to the `Medical / Healthcare` context block (line 81–87) — which is written for general healthcare (Athenahealth, Kareo, SimplePractice) rather than dental-specific (Dentrix, Eaglesoft, Open Dental).

The dental-specific context lives in the landing page's `GHOST_WORK_ITEMS` array (static marketing copy) but is NOT injected into the AI diagnostic prompt. Dental visitors get a generic healthcare report.

**Impact:** Every dental user who completes the diagnostic receives a report generated with healthcare benchmarks rather than dental benchmarks. Terms like "RVU," "CPT codes," "prior auth" appear instead of "hygiene recall rate," "ARO," "treatment acceptance rate."

## Gap 2: Chat System Prompt Has Zero Industry-Specific Questions

**Location:** `app/api/chat/route.ts:6–19`

The `CHAT_SYSTEM_PROMPT` asks for: business name, business type, industry, 2-3 pain points, team size, annual revenue, current software/tools, email. These are identical across all verticals.

A dental practice owner gets asked the same generic questions as a logistics company. The AI does not ask about: hygiene scheduling patterns, no-show rate, recall effectiveness, insurance mix (PPO vs. FFS), practice management software, or production targets — the questions that would unlock a truly expert dental report.

**Impact:** The report quality ceiling is capped by the generic intake questions. Even with the industry context block, the AI can only work with the generic data provided.

## Gap 3: Report UI Has No Industry-Specific Rendering

**Location:** `app/report/[id]/page.tsx:25–34`

The permalink page fetches: `id, business_name, report, tier, email, created_at`. It does NOT fetch `industry`. The report body is rendered from markdown via `formatReport()` — there are no industry-specific KPI callouts, benchmark comparison panels, or vertical-specific action items.

**Impact:** A dental practice owner's permalink report looks identical in structure to a restaurant owner's. No industry benchmarks ("Your no-show rate vs. the 4% industry average"), no vertical-specific call-to-action, no integration-specific next steps.

## Gap 4: Follow-Up Email Sequence Is Completely Generic

**Location:** `emails/FollowUp1.tsx`, `FollowUp2.tsx`, `FollowUp3.tsx`

None of the follow-up emails accept an `industry` prop or contain industry-specific copy. The 3-email nurture sequence that goes out to all diagnostic leads uses identical copy regardless of whether the lead is a dentist or a restaurant owner.

**Impact:** Lost conversion opportunity. A dental practice owner receiving "Your automation roadmap is ready" is less compelling than "Your recall campaign is ready to launch — practices like yours recover 15–25% of lapsed patients."

## Gap 5: Monthly Report and Quarterly Recalibration Are Not Industry-Aware

**Location:** `emails/MonthlyReport.tsx`, `app/api/cron/quarterly-recalibration/route.ts`

These lifecycle emails do not pull `industry` from the client record and do not customize content per vertical. A dental client's monthly report looks the same as a fitness studio client's.

## Gap 6: No Per-Vertical Intake Question Sets

There is no data structure or configuration for "what additional questions to ask for dental vs. restaurant vs. fitness." The chat flow has a single universal intake template (6-10 exchanges, generic fields). Building a truly vertical-specific experience would require per-industry question banks.

## Gap 7: Testimonials Are Placeholders

**Evidence:** dental page line 314, restaurant page line 314, fitness page line 315 all contain:
```tsx
{/* TODO: replace with real [industry] client testimonials */}
```

All three pages use fabricated testimonials (Dr. Sarah M., Marcus T., Priya S., Jordan R. — names reused across verticals). No social proof layer exists.

## Gap 8: No Vertical-Specific Report Sections

The `BASE_PROMPT` in `diagnosticPrompts.ts` (lines 1–46) defines a fixed 7-section report structure:
1. Business Snapshot
2. Top Automation Opportunities
3. Estimated ROI Projection
4. Quick Wins
5. Recommended Service Tier
6. Your Roadmap
7. The Bottom Line

A truly vertical-specific report for dental would include:
- Hygiene recall rate benchmark comparison
- No-show cost calculator
- Insurance pre-auth workflow map
- Treatment acceptance rate analysis
- Practice type sub-vertical classification (general vs. ortho vs. cosmetic)

None of these exist. The report structure is one-size-fits-all.

## Gap 9: No Vertical-Specific Automation Templates

The chat (line 28 in ChatEngine.tsx) claims: `> Loading 1,200+ automation templates`. No actual template library exists in the codebase — this is UI copy only. The `builds` table in Supabase stores build status but no template definitions. There is no per-industry automation library that could power a "here are your 5 specific automations ready to deploy" experience.

## Gap 10: No Industry-Specific Onboarding Flow

**Location:** `app/onboard/[token]/OnboardingForm.tsx`, `app/api/onboard/[token]/route.ts`

The onboarding form is generic — same fields for all clients regardless of industry. A dental onboarding flow should ask about: practice management software (Dentrix, Eaglesoft, Open Dental), EHR integration preferences, insurance credentialing, HIPAA compliance requirements, and staff structure (front desk, hygienists, assistants).

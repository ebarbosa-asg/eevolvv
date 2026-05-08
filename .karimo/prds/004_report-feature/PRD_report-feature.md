# PRD: report-feature
**PRD ID:** 004  
**Slug:** report-feature  
**Date:** 2026-05-08  
**Status:** Ready for Execution  
**Author:** KARIMO Interviewer (direct generation)

---

## 1. Overview

The eevolvv diagnostic report is the product's core value delivery moment. A business owner completes a 10-minute AI conversation and receives a custom Evolution Report — their first and most visceral experience of what eevolvv can do.

This PRD addresses 12 improvements across three priority levels, organized into three execution waves:

- **Wave 1 (Critical):** Two issues that directly damage conversion — fragile stat extraction and an email CTA that routes to Calendly instead of payment.
- **Wave 2 (Polish):** Five UX improvements that elevate the report from functional to premium — progress ring smoothing, section animations, avatar state, confetti celebration, email confirmation in UI, and TierCards dynamic recommendation.
- **Wave 3 (Expansion):** Four features that extend the report's reach — permalink URL, auto-triggered follow-up emails, dead code removal, and PDF download.

These improvements are estimated to measurably improve the free-to-paid conversion rate by tightening the report-to-checkout pathway and adding trust signals at the moment of decision.

---

## 2. Goals

### Conversion
- Route email CTA directly to Stripe checkout for the recommended tier (remove Calendly as primary CTA)
- Display real extracted stats instead of generic fallbacks to increase report credibility
- Pre-highlight the recommended tier in TierCards based on report content
- Add placeholder social proof near the payment wall
- Auto-trigger FollowUp1 email within the 72-hour conversion window

### Trust
- Accurate stat callouts: hours freed, automations found, annual savings pulled from structured output (not regex on prose)
- Email confirmation in UI after report delivery ("Report sent to {email}")
- Report permalink at `/report/[submissionId]` — survives browser close/refresh

### Delight
- Confetti burst at report reveal moment (respects `prefers-reduced-motion`)
- Smooth progress ring: 92 → 99 → 100% with eased final fill, no freeze-jump
- Section-by-section staggered fade-in per `<h3>` heading
- VolvvEAvatar state tied to actual ghost state during streaming

### Code Health
- Delete ~200 lines of dead `DiagnosticForm` code from `app/page.tsx`
- Extract `formatReport()` to `lib/format-report.ts` (single source of truth)

---

## 3. User Stories

**Business owner — report flow**

1. As a business owner completing the diagnostic, I want to see a smooth progress indicator so I feel confident the system is working during the 15–35 second wait.

2. As a business owner receiving my report, I want to see a celebration moment when the report arrives so the experience feels premium and earned.

3. As a business owner reading my report, I want to see real numbers (hours saved, automations found, projected savings) extracted from my specific answers — not generic defaults.

4. As a business owner who wants to act, I want the email I receive to link directly to my recommended payment tier — not a scheduling call — so I can start immediately.

5. As a business owner who closed my browser, I want to return to my report at a permanent URL so I don't lose my results.

6. As a business owner on the fence, I want to see social proof near the payment options so I can trust the service before committing.

7. As a business owner ready to pay, I want to see my recommended tier pre-highlighted in the tier cards so I know exactly where to start.

**Developer**

8. As a developer, I want `formatReport()` in one place so there's a single implementation to maintain.

9. As a developer, I want stats extracted via a structured `### STATS` block in the Claude prompt (not regex on prose) so stat extraction is deterministic and reliable.

---

## 4. Out of Scope

- Retry on report generation failure (identified in research; deferred to a separate health-improvement PRD)
- Mobile keyboard handling improvements (deferred)
- Chat progress "Q 1 / ~10" reframing (deferred)
- First-load entrance sequence for chat (deferred)
- `@react-pdf/renderer` upgrade (start with `react-to-pdf` in Wave 3; upgrade separately if quality is insufficient)
- Trial / opt-out offer CTA in TierCards (deferred to pricing-experiments PRD)
- Real testimonials — Wave 2 uses placeholder copy; real copy sourced separately

---

## 5. Technical Scope

### Wave 1 — Critical Fixes

#### T01: Fix `extractStats()` — server-side structured extraction

**Problem:** `extractStats()` in `ChatEngine.tsx` uses fragile regex on Claude's prose output. When patterns don't match, generic fallbacks appear that undermine trust.

**Solution:** Add a `### STATS` block to the diagnostic prompt in `lib/diagnosticPrompts.ts`. The block instructs Claude to output exactly three lines at the end of every report:

```
### STATS
HOURS_FREED: {n}
AUTOMATIONS: {n}
ANNUAL_SAVINGS: ${n}
```

Parse this block server-side in `app/api/diagnostic/route.ts` and return `stats: { hoursFeed, automations, annualSavings }` alongside the report text in the API response. Remove `extractStats()` from `ChatEngine.tsx` and consume `stats` from the API response.

**Files:**
- `lib/diagnosticPrompts.ts` — add `### STATS` instruction to base prompt
- `app/api/diagnostic/route.ts` — parse `### STATS` block, strip it from report text, return `stats` object
- `components/ChatEngine.tsx` — remove `extractStats()`, consume `stats` from API response

**Dependencies:** None

---

#### T02: Email CTA — Stripe payment link for recommended tier

**Problem:** `emails/EvolutionReport.tsx` primary CTA ("Book Your Strategy Call →") links to Calendly. Users who want to buy from email have no direct payment path.

**Solution:** Replace the primary CTA button in `EvolutionReport.tsx` with "Start Your Evolution →" linking to `/api/stripe/checkout?tier={recommendedTier}&source=email`. Pass `recommendedTier` and `submissionId` from `app/api/diagnostic/route.ts` into the email template props. Retain Calendly as a secondary, lower-emphasis link ("Prefer to talk first? Book a call →").

**Files:**
- `emails/EvolutionReport.tsx` — swap primary CTA, add secondary Calendly link
- `app/api/diagnostic/route.ts` — pass `tier` and `submissionId` to `EvolutionReportEmail` props

**Dependencies:** None (tier is already in the API response)

---

### Wave 2 — Experience Polish

#### T03: TierCards — dynamic recommended tier + placeholder social proof

**Problem:** The recommended tier from the report (`### RECOMMENDED SERVICE TIER` section) is not pre-highlighted in TierCards. The payment wall has no social proof.

**Solution:**
- In `ChatEngine.tsx`, parse the `tier` field from the diagnostic API response (already returned) and pass it as `recommendedTier` prop to `TierCards`.
- In `TierCards.tsx`, visually highlight the `recommendedTier` card with an accent border and "RECOMMENDED FOR YOU" badge (replacing the hardcoded "MOST POPULAR" on `core`).
- Add three placeholder testimonial rows below the tier grid — each with a name, business type, and one-line result quote. Mark with a `// TODO: replace with real testimonials` comment.

**Files:**
- `components/TierCards.tsx` — accept `recommendedTier` prop, highlight recommended, add testimonial placeholder section
- `components/ChatEngine.tsx` — pass `tier` from API response to `TierCards`

**Dependencies:** T01 (tier is in API response; T01 confirms the field is reliably present)

---

#### T04: Progress ring smooth 92 → 99 → 100%

**Problem:** `extractPct` is capped at `Math.min(92, ...)` during animation, then jumps to 100 on API success. The pause at 92% reads as a system error.

**Solution:** Replace the hard cap with a smooth interpolation:
- During activity log animation: advance to 92% as currently done.
- After all lines complete, start a slow fill from 92 → 99 over 8 seconds using `setInterval` (no API dependency — visual only).
- On API success: cancel the interval, animate to 100% with a 0.4s CSS transition.
- This eliminates the freeze-jump regardless of whether the API is fast or slow.

**Files:**
- `components/ChatEngine.tsx` — replace `Math.min(92, pct)` cap with interval-based 92→99 drift + cancel-on-success

**Dependencies:** None

---

#### T05: Report section stagger fade-in per `<h3>`

**Problem:** The report content (`.report-content` div) appears all at once via `dangerouslySetInnerHTML`. The `revealStage` system staggers the overall phases but not individual sections within the report body.

**Solution:** After the report text is formatted by `formatReport()`, inject `style="animation-delay: {n * 120}ms"` on each `<h3>` and its following sibling paragraph group so sections cascade in sequentially. Implement as a post-processing step in `formatReport()` that adds CSS classes and inline delays. Add a `.report-section-fade` keyframe to `app/globals.css` (`opacity: 0 → 1, translateY(8px) → 0`, 0.5s ease`).

**Files:**
- `lib/format-report.ts` (created in T11) — add stagger delay injection to `formatReport()`
- `app/globals.css` — add `.report-section-fade` keyframe and class

**Dependencies:** T11 (format-report.ts must exist first; if T11 runs in Wave 3, this task uses the inline version in ChatEngine.tsx and T11 updates it)

Note: If execution order requires Wave 2 before Wave 3, implement stagger directly in `ChatEngine.tsx` `formatReport()` and let T11 migrate it. Document the migration point.

---

#### T06: Fix VolvvEAvatar hardcoded `state="idle"`

**Problem:** `<VolvvEAvatar state="idle" />` is hardcoded in `ChatEngine.tsx` line 599. The `ghostState` variable is computed but never passed to the avatar, so the avatar never shows `thinking` during streaming.

**Solution:** One-line fix: change `state="idle"` to `state={ghostState}` in the `VolvvEAvatar` render call.

**Files:**
- `components/ChatEngine.tsx` — line 599: `state="idle"` → `state={ghostState}`

**Dependencies:** None

---

#### T07: Email confirmation in UI after report

**Problem:** After report generation, an email is sent non-blocking via Resend. The UI never tells the user. Users may not check their inbox because they don't know an email was sent.

**Solution:** In the report phase header area (below the report ID), show a small confirmation line:

```
→ Report sent to {email}
```

Style as `.mono` 11px muted (40% opacity), same row as or immediately below the report metadata line. The `email` field is already available in `ChatEngine` state after the API response.

**Files:**
- `components/ChatEngine.tsx` — add email confirmation line in report header section

**Dependencies:** None

---

#### T08: Confetti + celebration burst on report complete

**Problem:** The report reveal has no celebration moment. The experience goes from a loading screen directly to a document header with no delight signal.

**Solution:** Add `react-confetti` package. Mount `<Confetti>` when `revealStage >= 1` (document header appears). Configure:
- `recycle={false}` — one burst, not infinite
- `numberOfPieces={180}`
- `colors={['#8C2B1A', '#141413', '#faf7f0', '#d4a574']}` — brand palette approximation (accent, ink, paper, warm gold)
- `gravity={0.25}` — slower fall for premium feel
- Wrap in `!window.matchMedia('(prefers-reduced-motion: reduce)').matches` check
- Remove component from DOM after `onConfettiComplete` fires

**Files:**
- `components/ChatEngine.tsx` — import and mount `<Confetti>` conditionally
- `package.json` — add `react-confetti`

**Dependencies:** None

---

### Wave 3 — Expansion

#### T09: `/report/[submissionId]` permalink page

**Problem:** The report exists only in React state. A browser refresh destroys it. `submissionId` is saved in Supabase but there is no public retrieval page.

**Solution:**
- Create `app/report/[id]/page.tsx` — a server component that fetches the submission from Supabase by ID and renders the report.
- Access model: signed token in URL query param (`/report/[id]?token={jwt}`) — same pattern as `/client/[token]`. Generate a short-lived (30-day) JWT from `submissionId` + `email` when the report is created, include in the API response.
- The permalink page renders: document header, stat callouts, formatted report content, and TierCards payment wall (same layout as ChatEngine report phase but standalone page).
- In `ChatEngine.tsx`, show a "Bookmark this report →" link after the report appears, linking to the generated permalink.
- In `app/api/diagnostic/route.ts`, generate the token and return `reportUrl` in the API response.

**Files:**
- `app/report/[id]/page.tsx` — new permalink page (server component)
- `app/api/diagnostic/route.ts` — generate permalink token, return `reportUrl`
- `components/ChatEngine.tsx` — show "Bookmark this report →" link in report header

**Dependencies:** T01 (for `stats` object in the response shape), T11 (for `formatReport()` from shared lib)

---

#### T10: Auto-trigger FollowUp1 email after report generation

**Problem:** FollowUp1/2/3 email templates exist in `lib/email-helpers.ts` but no automation triggers them. The critical 72-hour conversion window is not covered.

**Solution:**
- In `app/api/diagnostic/route.ts`, after the initial report email is sent, schedule FollowUp1 to send 24 hours later.
- Implementation: insert a row into a new `email_queue` Supabase table with `{ submissionId, email, template: 'followup1', send_after: now() + 24h, status: 'pending' }`.
- Create a Supabase Edge Function `process-email-queue` that queries pending rows where `send_after <= now()` and sends via `lib/email-helpers.ts` `sendFollowUpEmail()`.
- Trigger the Edge Function via a pg_cron job: `cron.schedule('0 * * * *', ...)` — runs hourly.
- FollowUp2 and FollowUp3 are inserted at 48h and 72h respectively in the same transaction.

**Files:**
- `app/api/diagnostic/route.ts` — insert `email_queue` rows for FollowUp1/2/3
- `supabase/migrations/` — new migration: `email_queue` table
- `supabase/functions/process-email-queue/index.ts` — new edge function
- `lib/email-helpers.ts` — verify `sendFollowUpEmail()` accepts `submissionId` and `email`

**Dependencies:** T01 (submissionId available in API response chain)

---

#### T11: Delete `DiagnosticForm` dead code + extract `formatReport()` to `lib/format-report.ts`

**Problem:** ~200 lines of dead `DiagnosticForm` code in `app/page.tsx` inflate the bundle and create confusion. `formatReport()` is duplicated between `ChatEngine.tsx` and `page.tsx`.

**Solution:**
1. Delete the `DiagnosticForm` component from `app/page.tsx` (lines ~1249–1380) — confirm it is not rendered anywhere before deleting.
2. Extract `formatReport()` from `components/ChatEngine.tsx` to `lib/format-report.ts` as a named export.
3. Import `formatReport` in `ChatEngine.tsx` from the shared lib.
4. Verify no other references to the deleted `DiagnosticForm` exist in the codebase.

**Files:**
- `app/page.tsx` — delete `DiagnosticForm` component and its local `formatReport` copy
- `lib/format-report.ts` — new file, exports `formatReport(text: string): string`
- `components/ChatEngine.tsx` — import `formatReport` from `lib/format-report.ts`

**Dependencies:** None (can run independently; T05 and T09 depend on this)

---

#### T12: PDF download button on report

**Problem:** The report is ephemeral — there is no take-away artifact. Users who download the report are more likely to share it (social proof) and return to convert.

**Solution:**
- Add `react-to-pdf` package.
- Add a "Download PDF →" button in the report header area (same row as "Bookmark this report →" from T09, or below it).
- Target the `.report-content` div plus the stat callouts section for PDF export.
- Use `usePDF` hook from `react-to-pdf` on button click.
- File name: `eevolvv-evolution-report-{businessName}-{date}.pdf`
- Style note: PDF output will use system fonts (custom fonts don't embed in html2canvas). Accept this for Wave 3; document as a known limitation.

**Files:**
- `components/ChatEngine.tsx` — add PDF download button and `usePDF` hook
- `package.json` — add `react-to-pdf`

**Dependencies:** T09 (report header area layout defined there; can also implement independently if needed)

---

## 6. UX Notes

### Report Header — Target State (Phase: report)

```
┌─────────────────────────────────────────────────────────┐
│  EEVOLVV DIAGNOSTIC REPORT          [dark header area]  │
│  {businessName}                                         │
│  {date} · REPORT ID: {submissionId[0..7]}               │
│  → Report sent to {email}      [11px mono, 40% opacity] │
│  [Bookmark this report →]  [Download PDF →]             │
└─────────────────────────────────────────────────────────┘
[Confetti burst fades out over 2s]

[Stat callouts — 3 col]
  {hoursFeed} HRS/WEEK  |  {automations} AUTOMATIONS  |  ${annualSavings}/YR

[Report sections — stagger fade in per h3, 120ms delay each]

[Next-step banner]

[TierCards — {recommendedTier} pre-highlighted]
[Testimonial placeholders — 3 rows]
```

### Email Template — Target State

**Primary CTA:** "Start Your Evolution →" → `/api/stripe/checkout?tier={tier}&source=email`  
**Secondary CTA:** "Prefer to talk first? Book a call →" → Calendly (lower emphasis, text link)

### Progress Ring — Target Behavior

| Time | State |
|------|-------|
| 0–activity log runs | 0 → 92% (tied to typewriter animation) |
| After log completes | 92 → 99% (slow drift, 8s interval) |
| API success | Cancel drift, animate to 100% (0.4s transition) |
| API failure | Stay at current %, transition to error phase |

---

## 7. Design Constraints

- No new npm packages except: `react-confetti` (T08), `react-to-pdf` (T12)
- All new UI follows `components/ds/` design system conventions where applicable
- Design tokens: `--paper`, `--ink`, `--accent`, `--rule` — no raw hex values in new code
- CSS class naming: `diagnostic-`, `report-`, `pricing-` prefixes for new globals.css additions
- No Tailwind arbitrary values — use design tokens or CSS variables

---

## 8. Open Questions

None — all pre-interview questions are resolved per brief:
1. `/report/[id]` access: signed token, publicly accessible without login
2. Follow-up emails: auto-trigger YES (Supabase email_queue + Edge Function)
3. Social proof: placeholder testimonials for now
4. DiagnosticForm deletion: confirmed safe to delete
5. Celebration treatment: confetti + premium feel throughout

---

## 9. Complexity Assessment

```
╭──────────────────────────────────────────────────────────────╮
│  Complexity Assessment                                       │
╰──────────────────────────────────────────────────────────────╯

Tasks: 12
Total complexity: 42 points

Distribution:
  Sonnet (1-4): 12 tasks
  Opus (5-10): 0 tasks
  High-risk (7+): 0 tasks

No slicing needed — all tasks within Sonnet range.
```

---

## 10. Wave Structure

| Wave | Tasks | Description | Complexity Sum |
|------|-------|-------------|----------------|
| 1 | T01, T02 | Critical fixes: stats extraction, email CTA | 8 |
| 2 | T03, T04, T05, T06, T07, T08 | Experience polish | 22 |
| 3 | T09, T10, T11, T12 | Permalink, follow-ups, cleanup, PDF | 12 |

Wave 1 must complete before Wave 2. Wave 3 is independent of Wave 2 (except T05 depends on T11 — see task notes).

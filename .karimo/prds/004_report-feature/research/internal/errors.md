# Internal Errors & UX Gaps: Report Feature

**Phase:** Internal Research
**Date:** 2026-05-08

---

## Critical Issues

### 1. Dead Code: DiagnosticForm (Legacy)
`app/page.tsx` contains a complete `DiagnosticForm` component (~200 lines) that is no longer rendered. The homepage renders `<DiagnosticSection>` which uses `<ChatEngine>`. The old `DiagnosticForm` references `/api/diagnostic` directly, has its own `LoadingNarrative`, `ChatMark`, and `formatReport()` functions. These are dead weight that inflate the bundle and cause confusion.

### 2. Duplicate formatReport() Logic
`formatReport()` is defined twice:
- `components/ChatEngine.tsx` line 36 — used in the live chat UI
- `app/page.tsx` line ~1340 — inside the legacy `DiagnosticForm`
Should be extracted to a shared utility (e.g., `lib/format-report.ts`).

### 3. VolvvE Ghost State Not Reflected in Chat UI
`resolveGhostState()` correctly tracks ghost state through all 4 phases, but the chat bubble avatar is always rendered as `<VolvvEAvatar state="idle" />` (line 599, ChatEngine.tsx). The avatar never shows `thinking` state during streaming. The correct state (`ghostState`) is computed but not passed to the avatar.

### 4. extractStats() Relies on Fragile Regex
The stat callouts (hours freed, automations found, annual savings) are critical social proof elements at the top of the report. But they're extracted via simple regex patterns that may not match Claude's actual output. When they fail, generic fallbacks appear (`3+`, `5+`, `6`) which look fabricated and undermine trust. There's no visual distinction between real extracted stats and fallback defaults.

### 5. No Report Permalink / Share URL
The report lives entirely in React state — there's no URL, no saved version the user can return to. If they close the browser or refresh, the report is gone. The submissionId is saved in Supabase but there's no `/report/[id]` page to retrieve it.

### 6. Email Delivery: No Confirmation in UI
After the report is generated, an email is sent non-blocking via Resend. But the UI never tells the user "We sent your report to {email}." The report header shows a report ID but no email confirmation. Users may not realize the email was sent.

### 7. Email Template: CTA Points to Calendly, Not Payment
`emails/EvolutionReport.tsx` CTA button says "Book Your Strategy Call →" and links to Calendly. This is a soft conversion path. There is no payment CTA in the email itself — no link to the tier cards or Stripe checkout. Users who want to buy from email have no direct path.

### 8. Email Template: No Brand Font
`EvolutionReport.tsx` uses `"Helvetica Neue", Helvetica, Arial` — safe email fallbacks are correct, but the brand voice is expressed entirely through Helvetica rather than Space Grotesk. The email section headings use monospace for the heading labels (correct) but the font is `monospace` generic, not JetBrains Mono specifically.

### 9. Loading Phase: No Real-Time Feedback on API Progress
The extracting phase has a typewriter animation that's purely cosmetic — it runs on a fixed timer, not tied to actual API progress. The progress ring hits 92% during animation and then jumps to 100% only when the API returns. There's no way to know if the API is actually working or stuck.

### 10. Progress Ring Caps at 92% Artificially
`extractPct` is capped at `Math.min(92, ...)` during animation (line 159), then set to 100 on success. This creates a jarring jump from 92 → 100 with a 700ms delay. The 92% cap is arbitrary — users may interpret the pause as an error.

### 11. No Retry on Report Generation Failure
If `generateReport()` fails, the UI transitions to the error phase with a generic "TRY AGAIN →" button that resets the entire chat. The user loses all conversation context and must start over from the beginning. There's no option to retry just the report generation step.

### 12. Chat: No Mobile Keyboard Handling
The input area at the bottom of the chat has no `inputmode` or `enterkeyhint` attributes. On mobile, the keyboard may push the input off-screen or obscure the message feed. The `chat-messages-panel` has `max-height: min(420px, 52vh)` on mobile but there's no `position: sticky` or scroll-to-bottom handling for keyboard resize events.

### 13. TierCards: No Pricing Context After Report
The TierCards render inside the report flow with minimal context. Users see tier cards immediately after an emotionally resonant report but with no transition copy that connects their specific findings to the tier recommendation. The tier recommended in the report (section "### RECOMMENDED SERVICE TIER") is not highlighted or pre-selected in TierCards.

### 14. No Social Proof Near Payment Wall
TierCards has a footer note ("Build starts the moment checkout completes") but no testimonials, client logos, or case studies. The payment wall appears immediately after the report with no trust signals.

### 15. Section Header "01" Wrong for DiagnosticSection
`DiagnosticSection` uses `<SectionHeader number="01" ...>` but this is not the first section on the page — it appears after Stats, Problem, Process, Who, and Pricing sections. The number is likely a copy-paste artifact. The large watermark "03" in the background also doesn't match.

### 16. Chat Progress "Q 1 / ~10" Starts Misleadingly
The progress indicator shows `Q 1 / ~10` after the first message, suggesting 10 questions are required. The actual Claude chat is dynamic and typically ends in 8–12 exchanges depending on the business type. The `APPROX_QUESTIONS = 10` constant is a rough estimate and the "~10" framing may discourage users who see "Q 3 / ~10" and think they're only 30% done.

### 17. No Empty State / First-Load Animation
When the chat first loads, the opening message appears without animation. There's no entrance sequence or moment of delight for the initial state — it just appears. The `VolvvEAvatar` is always `idle` so there's no visual signal that the AI is "waking up."

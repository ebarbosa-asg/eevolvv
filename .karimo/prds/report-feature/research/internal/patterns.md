# Internal Patterns: Report Feature CTAs and Components

**Phase:** Internal Research
**Date:** 2026-05-08

---

## CTA Buttons That Lead to the Report Flow

### 1. Hero CTA — `app/page.tsx` line 702
```
"GET FREE REPORT →"
```
- Class: `btn-gradient` (animated gradient button)
- Action: `onClick={onCTA}` → calls `scrollToDiagnostic()` which does `document.getElementById('diagnostic')?.scrollIntoView(...)`
- Padding: 18px 32px, fontSize 14, fontWeight 600

### 2. Header Nav CTA — `app/page.tsx` line 275, 361
- Nav item: `['diagnostic', 'GET REPORT']` — links to `#diagnostic`
- Primary header button (mobile+desktop): fires `onCTA()` → same scroll function
- Class: `header-cta-gradient` (same animated gradient as btn-gradient + 1px ink border)

### 3. Pricing Section — "Run the free diagnostic first →" — `app/page.tsx` line 1157–1158
- Inline text link styled with accent color + underline
- No special class; inline style only
- Fires `onCTA('seed')` which scrolls to diagnostic with `targetTier = 'seed'`

### 4. Pricing Section Footer CTA — `app/page.tsx` line ~1181
- Not a direct report CTA; a `diagnostic_engine.run` label below the pricing section
- Informational only

### 5. Footer Nav — `app/page.tsx` line 2066
- Link: `['Free Audit', '#diagnostic']` in ENGAGE nav group
- Plain `<a>` anchor tag, no special button class

### 6. Agents Section — `app/page.tsx` line 1760
- "FIND A SPECIALIST →" button — links to `#diagnostic` section
- Styled as ink/paper button, `.mono` class

---

## ChatEngine Phases

### Phase 1: `chatting`
File: `components/ChatEngine.tsx`

- Chrome bar with status dot and `AI READY / AI THINKING...` label
- Progress bar (2px) shows `userMsgCount / APPROX_QUESTIONS (10)` as percentage
- Message feed with `VolvvEAvatar` (76px pixel sprite) for AI messages
- User messages: dark ink box (no border radius anywhere — square design language)
- Streaming AI response shown live with cursor blink `▍`
- SEND → button in input bar
- When AI returns `[READY]` signal → transitions to `extracting` phase

### Phase 2: `extracting`
- Dark (`var(--ink)`) background, blueprint grid overlay
- Animated scan beam (`.diagnostic-scan-beam`) sweeping top-to-bottom
- Progress ring (`ProgressRing` SVG component) — circular, 92×92px, fills from 0 to 100%
- Activity log: typewriter animation through 9 `ACTIVITY_LINES` at 22ms/char speed
- Completed lines shown at 28% opacity with `✓ DONE` in green
- Active line shown at 82% opacity with blinking cursor
- When all lines done: shows `→ Compiling` with 3 bouncing dots
- `extractPct` goes 0 → 92 during typing, then 100 on API success
- After report received: 700ms delay, then transitions to `report` phase

### Phase 3: `report`
- `revealStage` system: 4 staged fade-ins at 100ms / 500ms / 1000ms / 1600ms
  - Stage 1: Document header (dark header with grid, business name, date, report ID)
  - Stage 2: Report content (`.report-content` div with `formatReport()` HTML)
  - Stage 3: Next-step banner ("Your roadmap is ready. Time to build it.")
  - Stage 4: TierCards payment wall
- Stat callouts (`.report-stat-grid`): 3 extracted stats from `extractStats()`
- PostHog fires `payment_wall_viewed` at revealStage 4

### Phase 4: `error`
- Simple centered error display
- Error message text
- "TRY AGAIN →" button with `btn-gradient` class

---

## formatReport() Function

Location: `components/ChatEngine.tsx` line 36–57

Process:
1. Split report text on `### ` section markers
2. For non-section chunks: wrap in `<p>` tags, convert `**bold**` to `<strong>`, newlines to `<br />`
3. For `### Heading` chunks: output `<h3>heading</h3>` + body paragraphs
4. Body: split by double-newlines into paragraphs; if all lines start with `- `, convert to `<ul><li>` list
5. Returns concatenated HTML string

Same `formatReport()` logic also exists as a local copy inside `DiagnosticForm` in `page.tsx` (line ~1340) — **duplicated code**.

---

## extractStats() Function

Location: `components/ChatEngine.tsx` line 59–78

Extracts up to 3 stats from report text via regex:
1. Hours/week freed: matches patterns like "X hours per week", "X hrs/week"
2. Number of automations: matches "X automations identified", "X workflows recommended"
3. Annual savings: matches "$X per year", "$X annually"

Fallback defaults if fewer than 3 found:
- `WORKFLOWS MAPPED: 3+`
- `AUTOMATIONS FOUND: 5+`
- `ROI SECTIONS: 6`

Weakness: regex is fragile — Claude's output format may not always trigger matches, so defaults appear frequently.

---

## DiagnosticSection (Homepage) — `app/page.tsx` line 1769–1831

Structure:
1. Section header: "Get your eevolvv report. Free." with `§ 01 · FREE AI AUDIT` eyebrow
2. Value badge: "★ VALUED ~$3K — YOURS FREE" with pulsing border animation
3. Sub-copy: "10 minutes. No signup required."
4. Value prop cards (3-col grid, bordered): GHOST WORK AUDIT / ROI PROJECTION / 90-DAY ROADMAP
5. Chat container: `<div style="border: 1px solid var(--ink); overflow: hidden"><ChatEngine /></div>`

The `ChatEngine` is rendered inside a bordered container. The section has a blueprint grid background at 0.4 opacity and a large watermark "03" at 2.2% opacity.

---

## DiagnosticForm (Legacy) — `app/page.tsx` line 1249–1380+

There is a **legacy static form** (`DiagnosticForm`) still in `page.tsx` that appears to not be rendered currently — the homepage renders `<DiagnosticSection>` which uses `<ChatEngine>` instead. The `DiagnosticForm` is a multi-step chat UI using fixed CHAT_QUESTIONS array, calls `/api/diagnostic` directly (not via extract-intake), and has its own loading narrative. This is dead code that should be removed.

---

## VolvvE Avatar

Location: `components/VolvvE.tsx`

States: `'idle' | 'thinking' | 'done' | 'error'`
- `idle`: `volvve-float` — gentle vertical bob, 3s infinite
- `thinking`: `volvve-thinking` — combined pulse opacity + sway, 1.8s
- `done`: `volvve-bounce` — single bounce animation, 0.7s `both` fill
- `error`: `volvve-shake` — horizontal shake, 0.6s `both` fill

Three export variants:
- `VolvvE` — base component (img tag with animation class)
- `VolvvEAvatar` — wrapper div for inline avatar use (in chat bubbles)
- `VolvvECorner` — fixed-position floating corner presence

In ChatEngine, only `VolvvEAvatar` is used — at `state="idle"` for all AI messages regardless of actual ghost state. The main `VolvvE` component is imported but only `resolveGhostState()` references the main state (not rendered anywhere in the report flow UI).

---

## TierCards Payment Wall

Location: `components/TierCards.tsx`

Tiers from `lib/stripe-prices.ts`: `seed | core | evolve`
- Annual/Monthly toggle (defaults to annual)
- "2 MONTHS FREE" label when annual selected
- 3-column tier grid (`.pricing-tier-grid`) — becomes 1-column at ≤760px
- "MOST POPULAR" badge on `core` tier (positioned absolutely, accent background)
- Feature list with `→` accent bullets
- CTA buttons: `START SEED →`, `START CORE →`, `START EVOLVE →`
- On click: calls `/api/stripe/checkout` → redirects to Stripe checkout URL
- Error state: accent-tinted error box below grid
- Footer note: "Build starts the moment checkout completes."
- PostHog events: `tier_selected`, `checkout_started`

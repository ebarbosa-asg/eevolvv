# Internal Structure: Report Flow Architecture

**Phase:** Internal Research
**Date:** 2026-05-08

---

## Component Architecture

```
app/page.tsx
├── Header (onCTA → scrollToDiagnostic)
│   ├── Nav: "GET REPORT" → #diagnostic
│   └── Header CTA: btn-gradient → scrollToDiagnostic()
├── Hero (onCTA → scrollToDiagnostic)
│   └── "GET FREE REPORT →" — btn-gradient
├── [Stats, Problem, Process, WhoItsFor sections]
├── Pricing (onCTA → scrollToDiagnostic with tier)
│   └── "Run the free diagnostic first →" text link
├── DiagnosticSection (targetTier: string)
│   ├── Blueprint grid background
│   ├── SectionHeader "FREE AI AUDIT"
│   ├── Value badge "★ VALUED ~$3K — YOURS FREE"
│   ├── 3-col value prop cards (GHOST WORK / ROI / ROADMAP)
│   └── Chat container (1px ink border)
│       └── ChatEngine (defaultTier: string)
│           ├── Phase: 'chatting'
│           │   ├── Chrome bar (status dot, AI READY/THINKING)
│           │   ├── Progress bar (thin, 2px)
│           │   ├── Messages feed (VolvvEAvatar + user bubbles)
│           │   ├── Streaming AI text
│           │   └── Input bar (text + SEND →)
│           ├── Phase: 'extracting'
│           │   ├── Dark background + scan beam
│           │   ├── Blueprint grid overlay
│           │   ├── Progress ring (SVG, 92px)
│           │   └── Activity log (typewriter animation)
│           ├── Phase: 'report'
│           │   ├── Document header (dark, ink bg)
│           │   ├── Stat callouts (3-col grid)
│           │   ├── Report content (.report-content div)
│           │   ├── Next-step banner
│           │   └── TierCards (payment wall)
│           │       ├── Annual/Monthly toggle
│           │       ├── 3-col tier grid (Seed / Core / Evolve)
│           │       └── Stripe checkout redirect
│           └── Phase: 'error'
│               └── Error message + TRY AGAIN button
└── [GlobalHorizon, AgentsSection, Footer]
```

---

## CSS Structure for Report Flow

All diagnostic/report styles live in `app/globals.css`:

**Report content (lines 447–513):**
- `.report-content` — typography base (15px, 1.75 line-height)
- `.report-content h3` — 11px mono uppercase, 3px left border in accent
- `.report-content p` — 15px, 1.72 line-height
- `.report-content ul li` — row with `→` pseudo-element in accent
- `.report-stat-grid` — 3-col → 1-col at ≤600px

**Diagnostic animations (lines 793–884):**
- `@keyframes pulse` — used for typing indicator dots
- `@keyframes msgSlideIn` — 0.22s slide-up for new messages
- `@keyframes scanBeam` — 3.5s sweep for extracting screen
- `@keyframes statusPulse` — green/accent dot glow
- `@keyframes valueBadgePulse` — accent ring pulse on value badge
- `.diagnostic-status-dot` — green pulsing dot
- `.diagnostic-status-dot--thinking` — accent-colored, faster pulse
- `.diagnostic-scan-beam` — absolute positioned beam overlay
- `.diagnostic-value-badge` — pulsing border badge
- `.diagnostic-msg-in` — slide-in animation for new messages

**Pricing tier grid (lines 887–948):**
- `.pricing-tier-grid` — 3-col → 1-col at ≤760px

**Mobile overrides (lines 761–791 in ≤760px block):**
- `.diagnostic-report-cta` — becomes single column
- `.chat-messages-panel` — smaller padding, max-height 52vh
- `.diagnostic-value-cards` — single column

---

## Naming Conventions

- CSS: kebab-case with `diagnostic-`, `report-`, `pricing-` prefixes
- Components: PascalCase (`ChatEngine`, `TierCards`, `VolvvE`)
- Types: `Phase`, `Msg`, `ApiMsg`, `GhostState`, `Tier`
- API routes: kebab-case directories (`/api/extract-intake`, `/api/diagnostic`)
- PostHog events: snake_case (`diagnostic_started`, `payment_wall_viewed`)

---

## Styling Approach

The codebase uses a mix of:
1. **Inline styles** — used extensively in ChatEngine and TierCards for layout and dynamic values
2. **CSS classes in globals.css** — for animations, reusable typography, grid layouts
3. **Design System components** (`components/ds/`) — NOT used in ChatEngine or TierCards (they predate or bypass the DS)
4. **Tailwind** — minimal usage in ChatEngine (only `anim-blink` class referenced)

The report flow is entirely implemented in raw inline styles + CSS classes, not using the design system components. This creates inconsistency with other parts of the app that use `<Button>`, `<Card>`, etc.

---

## API Chaining Architecture

The report generation involves two sequential Claude API calls:
1. `POST /api/chat` (streaming) — conversational AI, fires many times during the chat
2. `POST /api/extract-intake` → `POST /api/diagnostic` (sequential, internal) — called once at end

This means report generation involves:
- Multiple streaming chat calls (typically 8–12)
- One extraction call (600 max tokens)
- One full report generation call (4000 max tokens)
- One Supabase write
- One Resend email send (async)

Total latency from "extracting" to "report": typically 15–35 seconds based on Claude API response time.

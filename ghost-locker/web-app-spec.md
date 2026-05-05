# GHOST LOCKER WEB APP — Product Spec
> eevolvv Internal · v1 Design · 2026-05-04

```
§ GL-WEB · WEB APP SPECIFICATION
→ PURPOSE    ↳ Visual dashboard for Ghost Locker — build management, status, analytics
→ STACK      ↳ Next.js (App Router) · TypeScript · Tailwind · eevolvv design system
→ ROUTE      ↳ /internal/ghost (password-gated, eevolvv-only)
→ PRIORITY   ↳ Build the skill first. Ship the web app when you have 3+ active clients.
```

---

## Why a Web App

The Claude skill handles the work. The web app handles the visibility. When you have multiple active builds, you need:
- A real-time status board (not just GHOST.md)
- Visual phase tracking across all clients
- Quick access to client files from one place
- Analytics: avg build time per phase, eval pass rates, cost projections

The web app is a dashboard, not an editor. Claude does the work. The web app shows the results.

---

## Routes

```
/internal/ghost               → Dashboard (status board)
/internal/ghost/[codename]    → Client detail view
/internal/ghost/new           → Start new intake (launches Claude w/ /ghost:intake)
```

All routes are password-gated (same pattern as `_investor/pitch.html` — JS gate, not server auth).

---

## Page 1: Dashboard

### Layout
Full-width dark section (--ink background, --paper text). eevolvv design system throughout.

### Components

**Header**
```
§ GL-00 · GHOST LOCKER                            [+ NEW BUILD]
→ SYSTEM  ↳ Agent manufacturing pipeline
→ STATUS  ↳ {n} active · {n} locked
```

**Active Builds — Card Grid (3 columns)**

Each card:
```
┌─────────────────────────────────┐
│ {CODENAME}                      │
│ {Agent Name}                    │
│                                 │
│ ▓▓▓▒░░░░░  [BLUEPRINT]          │
│ Phase 2 of 5                    │
│                                 │
│ Complexity: {score}             │
│ Started: {date}                 │
│ Operator: {name}                │
│                                 │
│ [VIEW →]                        │
└─────────────────────────────────┘
```

Progress bar is a visual `▓▒░` representation of the 5 phases.

Phase indicator color:
- INTAKE → accent/40% opacity
- BLUEPRINT → accent/60%
- BUILD → accent/80%
- EVAL → accent
- LOCKED → #4ade80 (status green)

**Locked Builds — Table**

| Codename | Agent Name | Locked | Eval Score | Next Review |
|----------|-----------|--------|-----------|------------|
| {name} | {name} | {date} | {%} | {date} |

**Right Sidebar — Quick Stats**
```
→ TOTAL AGENTS BUILT   ↳ {n}
→ AVG BUILD TIME       ↳ {n} days
→ AVG EVAL SCORE       ↳ {%}
→ TOTAL MONTHLY COST   ↳ ~${n} across all clients
```

---

## Page 2: Client Detail View

### Layout
Split: left sidebar (file tree + phase nav) + right main panel (content viewer)

### Left Sidebar
```
{CODENAME}
{Agent Name}

● PHASE PROGRESS
  ✅ INTAKE
  ✅ BLUEPRINT
  🔄 BUILD ← current
  ○ EVAL
  ○ LOCK

● FILES
  intake.md
  blueprint.md
  build/
    system-prompt.md
    tools.json
    agent-config.md
    deployment.md
  eval/
  handoff/
```

Clicking any file opens it in the main panel (rendered markdown, read-only in web app).

### Main Panel

**Phase Summary Card** — shows what was decided in each completed phase

For BUILD phase in progress:
```
§ GL-03 · BUILD IN PROGRESS
→ PATTERN      ↳ ReAct
→ MODEL        ↳ claude-sonnet-4-6
→ TOOLS        ↳ 4 defined (1 high-risk with gate)
→ EST. COST    ↳ ~$45/mo

[OPEN IN CLAUDE →]  ← button that copies /ghost:build {codename} to clipboard
```

**Timeline** — Horizontal timeline showing when each phase was started/completed

**Eval Results** (if available) — pass/fail gauge + test case table

---

## Page 3: New Build

Simple centered form:

```
§ GL-NEW · START BUILD

→ CODENAME
  [________________]
  e.g. meridian-qa, cascade-finance

→ CLIENT NAME (internal only)
  [________________]

→ OPERATOR
  [E ▼]

→ TIER
  [Standard ▼] [Complex] [Enterprise]

[INITIALIZE BUILD →]
```

On submit: creates `ghost-locker/clients/{codename}/` folder + opens Claude with the intake command pre-loaded.

---

## Data Layer

The web app reads directly from the `ghost-locker/` file system. No database needed for v1.

For v2 (when you have 10+ clients): migrate to Supabase with the existing eevolvv schema.

**File parsing:**
- GHOST.md → parse the tables for the dashboard
- Phase files → detect existence for progress bars
- results.md → parse for eval score display

---

## Design Tokens (inherit from eevolvv system)

```css
/* Use existing globals.css tokens */
--paper: #faf7f0
--ink:   #141413
--accent: oklch(0.45 0.13 25)
--rule: rgba(20,20,19,.14)

/* Ghost Locker specific */
--gl-phase-1: color-mix(in oklch, var(--accent) 20%, transparent)
--gl-phase-2: color-mix(in oklch, var(--accent) 40%, transparent)
--gl-phase-3: color-mix(in oklch, var(--accent) 60%, transparent)
--gl-phase-4: color-mix(in oklch, var(--accent) 80%, transparent)
--gl-locked:  #4ade80  /* status green */
```

**Typography:** Space Grotesk headings, JetBrains Mono for all labels/stats, same as rest of eevolvv.

---

## Build Priority

**Ship when:** You have 3+ active client builds and GHOST.md is getting hard to scan.

**V1 scope (1-2 days):**
- Dashboard page (status board)
- Client detail view (read-only, file viewer)
- Password gate

**V2 scope (later):**
- New build page with Claude integration
- Supabase data layer
- Analytics (avg build time, pass rates, cost totals)
- Team assignment (when you have more operators)

---

## Implementation Notes

Route: add `/app/internal/ghost/` to the existing Next.js app. Same auth pattern as investor pitch (JS-based gate, not middleware — fast to ship).

The web app reads from `ghost-locker/` at build time or via a local API route. Since this is internal-only, reading from the filesystem via a server component is fine.

No new dependencies needed. Uses existing: Next.js, Tailwind, eevolvv design system components.

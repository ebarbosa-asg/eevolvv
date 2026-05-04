# PRD: eevolvv Design System

**Slug:** design-system  
**Created:** 2026-05-03  
**Status:** ready  
**Priority:** must  
**Complexity:** 10

---

## Summary

Build a formalized, reusable design system for eevolvv that can be copied to any future project in three files. The system formalizes what already exists — warm paper/ink/accent tokens, Space Grotesk + JetBrains Mono typography, editorial UI patterns — into a proper component library that Claude and human contributors must use. The immediate outcome: new features are on-brand by default, and the design system is portable to future projects.

The `/os` dashboard rebuild is scoped to a follow-on PRD once the system is stable.

---

## Problem

Claude defaults to shadcn/ui + Tailwind gray aesthetic when there's no component library to reference. eevolvv's `tailwind.config.js` compounds this with a stale dark-mode color set (`void`, `carbon`, `signal`, `pulse`, `electric`) that doesn't match the real design system — Claude reaches for those instead of `--paper`/`--ink`/`--accent`. Every new feature or project ends up looking like generic AI-generated UI.

eevolvv already has a strong, distinctive design language. It just isn't enforced anywhere.

---

## Goals

1. Fix `tailwind.config.js` so Tailwind tokens match the real design system
2. Build `components/ds/` — 13 primitive + brand-specific components wired to real tokens
3. Enforce the system via `CLAUDE.md` and `components/ds/README.md` so no future session drifts back to defaults
4. Make the system portable: copy `components/ds/` + `globals.css` + `tailwind.config.js` to start any new project on-brand

---

## Non-Goals

- `/os` dashboard rebuild (separate follow-on PRD)
- Dark mode token layer (light mode first; `/os` dark mode is handled in the follow-on PRD)
- npm package / monorepo setup (not needed yet)
- shadcn/ui integration or replacement

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Tailwind config | Replace stale tokens entirely | No partial fix — stale tokens cause Claude to drift |
| `/os` mode | Light base + dark sidebar + dark header | Ops tool pattern; full dark mode scoped to follow-on PRD |
| Portability | 3-file copy (ds/ + globals.css + tailwind.config.js) | Simple, no build tooling needed |
| PR strategy | One PR for full design system | Review as a unit, not piecemeal |
| Execution | Parallel waves where deps allow | Faster delivery |
| CLAUDE.md | Short rule entry + full reference in README | Two-layer enforcement |

---

## Design Tokens (Source of Truth)

These tokens are the foundation. All components must use CSS variables, not hardcoded values.

```css
--paper:    #faf7f0          /* Primary background — warm off-white */
--ink:      #141413          /* Primary text + dark section fills */
--accent:   oklch(0.45 0.13 25)  /* Brick red ~#8C2B1A — CTAs, markers, highlights */
--rule:     rgba(20,20,19,.14)   /* Borders, dividers */
```

**Tailwind mapping** (after T01):
```js
paper:  'var(--paper)'
ink:    'var(--ink)'
accent: 'var(--accent)'
rule:   'var(--rule)'
```

**Font stack:**
- `Space Grotesk` — primary UI (headings, labels, body)
- `JetBrains Mono` — section markers, terminal blocks, data labels
- `Newsreader` — editorial serif (italic accents only)

---

## Component Inventory

### Primitives (`components/ds/`)

| Component | Variants | Notes |
|---|---|---|
| `Button` | primary, secondary, ghost, danger | Wire to `--accent` for primary |
| `Card` | default | `bg-white border border-rule rounded-xl` |
| `CardHeader` | — | Padding + bottom border |
| `CardContent` | — | Padding only |
| `Badge` | success, warning, danger, neutral | Pill shape, 11px mono text |
| `StatusPill` | same as Badge | Alias with dot indicator |
| `Input` | default, error | `bg-paper border-rule` focus ring in accent |
| `Textarea` | default, error | Same as Input |
| `Label` | — | 11px JetBrains Mono uppercase 0.12em tracking |

### eevolvv-Specific (`components/ds/`)

| Component | Pattern | Notes |
|---|---|---|
| `SectionMarker` | `§ 00 · LABEL` | JetBrains Mono 11px uppercase 0.2em tracking, accent color |
| `TerminalBlock` | `→ KEY  ↳ value` | `bg-ink/5 border-l-3 border-accent` mono block |
| `KPIStat` | Large number + small label | Display size number, 11px mono label underneath |
| `DataRow` | Mono label + value pair | Horizontal, label in accent/muted, value in ink |

---

## Acceptance Criteria

### T01 — Tailwind config
- [ ] Stale colors (`void`, `carbon`, `graphite`, `smoke`, `steel`, `mist`, `ghost`, `pure`, `signal`, `signal-dim`, `signal-glow`, `pulse`, `pulse-dim`, `electric`) removed
- [ ] `paper`, `ink`, `accent`, `rule` added as Tailwind color tokens using CSS variables
- [ ] Font family tokens (`display`, `body`, `mono`) retained and working
- [ ] `npm run build` passes with no errors after change

### T02 — Documentation
- [ ] `components/ds/README.md` documents all 13 components with usage examples
- [ ] `CLAUDE.md` updated with `## Design System` section (short rule + pointer to README)
- [ ] README includes the 3-file portability instructions

### T03 — Primitive components
- [ ] All 9 primitive components exist in `components/ds/`
- [ ] Each component uses CSS variables (`--paper`, `--ink`, `--accent`, `--rule`) — no hardcoded hex
- [ ] Each component is TypeScript, exports named type for props
- [ ] `Button` primary variant uses gradient animation from `globals.css`
- [ ] `Input` focus ring uses `--accent`
- [ ] `Badge`/`StatusPill` use JetBrains Mono 11px

### T04 — eevolvv-specific components
- [ ] All 4 brand-specific components exist in `components/ds/`
- [ ] `SectionMarker` renders `§ {num} · {label}` in correct font/color
- [ ] `TerminalBlock` renders lines with `→`/`↳` prefix in correct mono style
- [ ] `KPIStat` renders large display number + small mono label
- [ ] `DataRow` renders horizontal mono label + value pair

---

## Research Findings

See `research/summary.md` for full findings. Key points:

- eevolvv's existing tokens (`--paper`, `--ink`, `--accent`) are strong and distinctive — the system formalizes them, it doesn't replace them
- 9 Dribbble references all validated the existing direction (warm neutrals + single accent)
- The stale Tailwind color set is the primary cause of Claude drift
- No shadcn/ui in the project — components must be built from scratch on the tokens

---

## Out of Scope

- `/os` dashboard reskin (follow-on PRD)
- Dark mode token layer
- npm package publishing
- Storybook or component playground
- Animation system (split-flap, scan beam already exist in globals.css)

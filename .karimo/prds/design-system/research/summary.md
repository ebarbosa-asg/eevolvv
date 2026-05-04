# Design System Research Summary

**Feature:** Reusable Design System — all Eduardo projects  
**Date:** 2026-05-03  
**Status:** Research complete → ready for /karimo:plan

---

## Executive Summary

Eduardo already has a **distinctive, well-developed design language** in eevolvv. The problem isn't that there's no design — it's that there's no *system* enforcing it. New features and projects fall back to generic Tailwind/shadcn defaults because there's no component library, no importable token file, and no standardized "here's our design, use this" starting point.

The 9 Dribbble references confirm Eduardo's aesthetic taste aligns precisely with what eevolvv already uses: **warm editorial, single punchy accent, data-forward layout, terminal/mono details**. The references validate the existing direction rather than proposing something new.

The opportunity: **formalize what already exists into a portable package** every project (eevolvv, /os, future apps) can import and extend.

---

## The Existing System (Don't Throw Away)

eevolvv's design tokens are strong and distinctive:

- **Paper/Ink** — warm off-white `#faf7f0` + near-black `#141413`. Not the generic white/gray of shadcn
- **Brick red accent** — `oklch(0.45 0.13 25)` ≈ `#8C2B1A`. Unusual, editorial, warm. Not blue.
- **Space Grotesk** — more character than Inter, professional without being corporate
- **JetBrains Mono** — used for UI labeling (§ markers, terminal blocks), not just code
- **Split-flap animations** — distinctive, brand-level motion language
- **Editorial patterns** — section markers `§ 00 · LABEL`, terminal log blocks, scan beam overlay

These are *good choices*. Keep them. Formalize them.

---

## What the Dribbble References Tell Us

### Confirmed patterns (align with eevolvv's existing direction):
- Warm off-white backgrounds over pure white ✓
- Single bold accent on neutral base ✓
- Sans-serif primary ✓
- Data hierarchy: large number, small label ✓
- Left sidebar on desktop ✓
- Status badges / pill chips ✓

### New signals from references:
- **Card style**: 12px radius, soft border + 1px border. More rounded than eevolvv currently uses
- **Dark mode panels**: selective dark surfaces for data-heavy views (not full dark mode, just panels)
- **AI-native UI** (Shot 2): bottom-docked input bar + floating action chips — relevant for eevolvv's diagnostic engine

### What to ignore:
- The electric blue `#2E5BFF` proposed in the external research is **wrong for eevolvv** — the brick red accent is already differentiated and better. Keep `--accent`.
- The lime green accents in Haulix/Delivery shots = operations tools. Not eevolvv's context.

---

## The Problem (Root Cause)

1. **`tailwind.config.js` has a stale dark-mode color set** (`void`, `carbon`, `signal`, `pulse`, `electric`) that doesn't match the actual design system — Claude reaches for these
2. **No component library** — no `Button`, `Card`, `Badge`, `Input` built on the design tokens
3. **No single importable file** — tokens are in `globals.css` and documented in `CLAUDE.md` but not in a format other projects can `import`
4. **`/os` dashboard was built without the design system** — it's the clearest example of the problem

---

## Proposed Solution

### Three deliverables

**1. Design tokens package (`packages/tokens/` or `lib/design/tokens.ts`)**
- Export all CSS variables as a typed object
- Also ship as a Tailwind theme extension
- Can be imported by any Next.js project

**2. Component library (`components/ds/`)**
Build ~12 primitives on top of the tokens:
- `Button` (primary, secondary, ghost, danger)
- `Card` + `CardHeader` + `CardContent`
- `Badge` / `StatusPill` (success, warning, danger, neutral)
- `Input` / `Textarea`
- `Label`
- `Sidebar` (collapsible left nav)
- `DataRow` (label + value with mono label pattern)
- `SectionMarker` (§ 00 · LABEL pattern as component)
- `TerminalBlock` (log block with → ↳ pattern)
- `KPIStat` (large number + small label)

**3. Design system CLAUDE.md entry**
A mandatory section in every project's `CLAUDE.md`:
```
## Design System
→ Use components from `components/ds/` — never build from raw Tailwind
→ Colors: --paper (#faf7f0), --ink (#141413), --accent (#8C2B1A brick red), --rule (rgba dividers)
→ Fonts: Space Grotesk (UI), JetBrains Mono (labels/code), Newsreader (editorial serif)
→ Section markers: § 00 · LABEL — JetBrains Mono 11px uppercase 0.2em tracking
→ See components/ds/README.md for all components
```

---

## Priority Order

| Priority | Item | Reason |
|---|---|---|
| 1 | Fix `tailwind.config.js` to expose real tokens | Immediate Claude confusion fix |
| 2 | Build `components/ds/` — Card, Button, Badge, Input | Covers 80% of all new UI |
| 3 | Apply to `/os` dashboard | Highest-visibility existing gap |
| 4 | SectionMarker + TerminalBlock + KPIStat | eevolvv-specific patterns |
| 5 | Tokens package for cross-project portability | Future apps |

---

## Files Written

- `research/internal/findings.md` — codebase audit: what exists, what's broken, what's missing
- `research/external/design-references.md` — 9 Dribbble shots analyzed, patterns extracted, design direction proposed

---

## Next Step

```
/karimo:plan --prd design-system
```

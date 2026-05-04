# Internal Research — eevolvv Design System

**Date:** 2026-05-03  
**Source:** app/globals.css, tailwind.config.js, CLAUDE.md brand section

---

## What Already Exists

eevolvv has a **fully developed, distinctive design language** in `app/globals.css` and documented in `CLAUDE.md`. This is not a blank slate — it's a mature editorial system.

### Core Tokens (`:root`)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#faf7f0` | Primary background — warm off-white |
| `--ink` | `#141413` | Primary text + dark section fills |
| `--accent` | `oklch(0.45 0.13 25)` ≈ `#8C2B1A` | Brick red — CTAs, markers, highlights |
| `--rule` | `rgba(20,20,19,.14)` | Borders, dividers |
| `--font-display` | `'Space Grotesk', sans-serif` | Headings, wordmarks, UI |
| `--font-serif` | `'Newsreader', serif` | Italic editorial accents |
| `--site-max` | `1280px` | Content rail |
| `--site-pad-x` | `32px` | Horizontal padding |

### Font Stack
- **Space Grotesk** (400–700) — primary UI font
- **JetBrains Mono** (300–700) — section labels, code, terminal blocks
- **Newsreader** (serif) — editorial italic accent
- **Press Start 2P** — ticker/arcade text (sparingly)

### UI Language Patterns
- **Section markers**: `§ 00 · LABEL` — JetBrains Mono 11px, uppercase, 0.2em tracking, `--accent` color
- **Sub-labels**: `N=01`, `T-00`, `A-01`
- **Arrows**: `→` (primary, accent) / `↳` (sub-item, muted)
- **Progress bar**: `▓▓▓▓▓░░░░░`
- **Terminal log block**: `rgba(20,20,19,.055)` bg, `1px var(--rule)` border, `3px var(--accent)` left, JetBrains Mono 13px, 1.9 line-height

### Component Classes in globals.css
- `.site-rail` — max-width 1280px centered
- `.mono` / `.serif` — font switches
- `.link-rule` — hover underline draw animation
- `.hero-gradient-word` — animated ink→accent gradient text
- `.btn-gradient` / `.header-cta-gradient` — animated gradient CTA buttons
- `.grid-drift` — animated 64px grid background
- `.blueprint-grid` — static 32px grid
- `.anim-fade-up/in/draw-line/blink` — standard entrance animations
- `.flap-cell` / `.flap-half` — split-flap digit animation system

### Animations
- `gradientShift` 9s — gradient buttons + hero word
- `fadeUp` 0.9s cubic — section entrances
- `flapTop/Bottom` 0.32s — split-flap counter
- `scanBeam` 3.5s — diagnostic scan overlay
- `heroQuoteMarquee` 360s — ticker

---

## The Problem (Why Projects Look Boring)

### 1. Tailwind config is misaligned
`tailwind.config.js` has a second color system: `void`, `carbon`, `graphite`, `signal` (#00ff94 green), `pulse` (#ff6b35 orange), `electric` (#4d9fff blue). None of these appear in the main design system. This is a stale or legacy set that causes confusion — Claude or other tools reach for these instead of the `--paper`/`--ink`/`--accent` system.

### 2. No component library
The tokens exist but there are no reusable components (Button, Card, Badge, Input) built on top of them. Every new page/feature gets hand-crafted with Tailwind utilities, leading to drift.

### 3. No `components/ui/` directory
eevolvv doesn't use shadcn/ui (no `/components/ui/`), which is correct — but there's also no custom equivalent. New components default back to raw Tailwind + inline styles.

### 4. Design system only documented in CLAUDE.md
The design tokens and patterns are documented in `CLAUDE.md` but not in a dedicated, importable format. When Claude (or any contributor) starts a new feature, they may not read the CLAUDE.md brand section, and fall back to generic patterns.

### 5. The `/os` dashboard has no design system applied
The ops hub (`app/os/`) was built quickly and uses generic gray Tailwind patterns — it looks nothing like the eevolvv homepage. This is the most visible example of the problem.

---

## Reuse Opportunity

The eevolvv design system is already strong enough to serve as the base for ALL Eduardo projects. What's needed:

1. Clean up `tailwind.config.js` to expose `--paper`, `--ink`, `--accent`, `--rule` as Tailwind tokens
2. Build a `/design-system` package (or `components/ds/`) with primitive components
3. Create a `design-system.md` reference file that Claude reads at session start
4. Apply the system retroactively to `/os`

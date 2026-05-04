# PRD: OS Dashboard Redesign

**Slug:** os-dashboard-redesign  
**Created:** 2026-05-03  
**Status:** ready  
**Priority:** must  
**Complexity:** 25

---

## Summary

Rebuild the entire `/os` dashboard using `components/ds/`. The current implementation is 2,472 lines of inline `style={}` objects with hardcoded `rgba()` values — zero design system usage. This PRD converts all three major components (HubClient, ClientWorkspace, AgentBuilder) to use the design system while adding a persistent sidebar, per-section routing, and an overview page.

---

## Problem

The `/os` dashboard was built before `components/ds/` existed. It looks nothing like eevolvv.com — different fonts, gray patterns, no brick red accent, no JetBrains Mono labels. Every interactive element is hand-crafted with inline styles. The 989-line HubClient monolith is unmaintainable and cross-imports create tight coupling between files.

---

## Goals

1. Apply `components/ds/` to all three OS files — zero inline `style={}` patterns remain
2. Add persistent dark sidebar with section links + live count badges
3. Convert 8 sections from one scrolling page to individual sub-routes
4. Add `/os` overview page with key metrics
5. Fix cross-file coupling (ClientWorkspace imports from HubClient)
6. Replace all injected `<style>` tags with Tailwind responsive classes

---

## Non-Goals

- API route changes (no backend work)
- New features or data (no new sections, tables, or endpoints)
- Auth improvements (flagged separately)
- Mobile optimization beyond what Tailwind responsive classes provide

---

## Architecture

### Layout

All `/os` routes share a layout wrapper `app/os/layout.tsx` (or `OSLayout` client component):

```
┌─────────────────────────────────────────────┐
│  OSTopbar — page title + breadcrumb + signout│  dark bg-ink, h-12
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Page content                    │
│ (dark)   │  bg-paper                        │
│ w-60     │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

- Sidebar: `<Sidebar>` from ds/, `bg-ink`, collapsible to icon-only
- Topbar: `<OSTopbar>` — section title + breadcrumb + sign out, `bg-ink`
- Content: `bg-paper` with `site-rail` padding

### Routes

| Route | Component | Description |
|---|---|---|
| `/os` | `app/os/page.tsx` → `OSOverview` | KPI summary: tasks, MRR, clients, pipeline |
| `/os/tasks` | `app/os/tasks/page.tsx` | § 00 · Company Tasks |
| `/os/feed` | `app/os/feed/page.tsx` | § 01 · Diagnostic Feed |
| `/os/clients` | `app/os/clients/page.tsx` | § 02 · Active Clients list |
| `/os/clients/[id]` | existing — rebuilt | Client Workspace |
| `/os/agents` | `app/os/agents/page.tsx` | § 03 · Agent Registry |
| `/os/pipeline` | `app/os/pipeline/page.tsx` | § 04 · Pipeline |
| `/os/finance` | `app/os/finance/page.tsx` | § 05 · Finance |
| `/os/investors` | `app/os/investors/page.tsx` | § 06 · Investors |
| `/os/links` | `app/os/links/page.tsx` | § 07 · Quick Links + § 08 · Internal Docs |
| `/os/clients/[id]/agents/[id]` | existing — rebuilt | Agent Builder |

### Shared Components (`app/os/components/`)

- `OSLayout.tsx` — layout wrapper (sidebar + topbar + content slot)
- `OSTopbar.tsx` — page title bar (section name + breadcrumb + sign out)
- `OSBreadcrumb.tsx` — mono uppercase breadcrumb
- `shared.tsx` — `HealthDot`, `StagePipeline`, `EmptyState`

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Page bg | `bg-paper` (`#faf7f0`) | Light base as agreed in design-system PRD |
| Sidebar | Dark (`bg-ink`) | Navigation chrome stays dark |
| Topbar | Dark (`bg-ink`) | Matches sidebar, signals "shell not content" |
| Sidebar badges | Live count on sections with data | More useful than static labels |
| `/os` root | Overview page with 4 KPI stats | Better entry point than redirect |
| AgentBuilder left rail | Light wizard variant | Signals "wizard step" not "nav" |
| Sections | Separate sub-routes | Better addressability, shareable URLs |

---

## Acceptance Criteria

### T01 — OS Layout
- [ ] `app/os/layout.tsx` renders dark sidebar + topbar + light content slot
- [ ] Sidebar uses `<Sidebar>` from ds/ with section items
- [ ] Sidebar items show live count badges for tasks, clients, agents, pipeline deals, investors
- [ ] `<OSTopbar>` shows current section title + sign out
- [ ] Layout is responsive — sidebar collapses on mobile

### T02 — Shared OS Components
- [ ] `app/os/components/OSBreadcrumb.tsx` — mono uppercase crumb trail
- [ ] `app/os/components/shared.tsx` — exports `HealthDot`, `StagePipeline`, `EmptyState`
- [ ] No more exports of these from HubClient.tsx

### T03 — Overview Page
- [ ] `/os` renders 4 `<KPIStat>` cards: open tasks, MRR, active clients, pipeline value
- [ ] Data fetched from existing API routes
- [ ] Uses `<Card>` + `<KPIStat>` from ds/

### T04 — 6 Section Pages
- [ ] `/os/tasks` — full company tasks section with filter tabs, task rows, add form
- [ ] `/os/feed` — diagnostic submissions table + funnel metrics
- [ ] `/os/agents` — all-agents table with status badges
- [ ] `/os/pipeline` — deals list with stage pills, add form
- [ ] `/os/investors` — investor rows with stage pills, raise progress bar
- [ ] `/os/links` — quick links grid + internal docs grid
- [ ] All use ds/ components exclusively — no inline `style={}`
- [ ] All use `<SectionMarker>` for section headers
- [ ] Injected `<style>` tags removed, replaced with Tailwind

### T05 — Clients List Page
- [ ] `/os/clients` renders client table (was inside HubClient)
- [ ] Uses `<HealthDot>`, `<StagePipeline>` from `app/os/components/shared.tsx`
- [ ] Uses `<Badge>` for stage labels

### T06 — Finance Page
- [ ] `/os/finance` renders MRR/ARR/customer `<KPIStat>` cards
- [ ] Bank balance editable inline
- [ ] Recent charges table uses `<DataRow>` or `<Card>`
- [ ] `<StatusPill>` for "live stripe" / "manual" tags

### T07 — ClientWorkspace Rebuild
- [ ] All inline `style={}` replaced with ds/ components + Tailwind
- [ ] Cross-imports from HubClient fixed — imports from `app/os/components/shared.tsx`
- [ ] `<OSBreadcrumb>` for nav
- [ ] `<Input>`, `<Textarea>`, `<Label>`, `<Button>` from ds/
- [ ] `<Badge>` for task status
- [ ] `<DataRow>` for activity log entries
- [ ] `<SectionMarker>` for section headers
- [ ] Injected `<style>{WORKSPACE_CSS}</style>` removed

### T08 — AgentBuilder Rebuild
- [ ] Left rail is a light wizard variant (not dark Sidebar)
- [ ] `<OSBreadcrumb>` for nav
- [ ] `<Input>`, `<Textarea>`, `<Label>`, `<Button>` from ds/
- [ ] `<SectionMarker>` for step headers
- [ ] `<TerminalBlock>` for next-runs preview and run output
- [ ] `<StatusPill>` for run history status
- [ ] `<Card>` for review section blocks and deploy environment cards
- [ ] `<Button variant="primary">Save & Continue →</Button>` pattern throughout

---

## Research Findings

See `research/summary.md` for full details. Key points:

- 2,472 lines to replace across 3 files
- 50 direct pattern-to-ds/ mappings documented in `research/internal/replacement-map.md`
- ds/ `Card` is `bg-white` — works correctly on `bg-paper` content surface
- Critical structural fix: extract `HealthDot`, `StagePipeline`, `StatusBadge` out of HubClient before other tasks import them

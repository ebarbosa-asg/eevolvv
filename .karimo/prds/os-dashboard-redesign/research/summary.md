# OS Dashboard Redesign — Research Summary

**Feature:** Apply design system to /os dashboard  
**Date:** 2026-05-03  
**Status:** Research complete → ready for /karimo:plan

---

## Executive Summary

The /os dashboard is a 2,471-line codebase (3 major components) built entirely with inline `style={}` objects and raw `rgba()` values. Zero `components/ds/` imports exist. The redesign is a direct replacement job — every button, card, badge, input, and label has an exact ds/ equivalent already built. The design direction is confirmed from the design-system PRD: light base + dark sidebar + dark header.

The biggest structural challenge is `HubClient.tsx` — a 989-line monolith that must be split into section components before it can be reasonably maintained or extended.

---

## What Exists Today

| Component | Lines | Problem |
|---|---|---|
| `HubClient.tsx` | 989 | Monolith; all inline styles; injects raw CSS via `<style>` tags; exports sub-components used by other files |
| `ClientWorkspace.tsx` | 651 | Inline styles; imports from HubClient (tight coupling) |
| `AgentBuilder.tsx` | 832 | Inline styles; 200px fixed left rail that maps directly to `<Sidebar>` |

**Total: 2,472 lines to replace.** No existing ds/ usage. No Tailwind color classes — all rgba/CSS variables via inline styles.

---

## Design Decision Carried Forward

From the design-system plan interview:
- **Light base** for content areas (`bg-paper`)
- **Dark sidebar + dark header** for navigation chrome (`bg-ink`)
- All components from `components/ds/` — no new raw Tailwind patterns

The ds/ `Card` component (`bg-white`, `rounded-xl`) is light-mode correct and will work directly on the `bg-paper` surface. No Card variant needed.

---

## Replacement Coverage

Every UI pattern has a ds/ replacement or a new shared component to build:

**Direct ds/ replacements (no new components needed):**
`Button`, `Card`, `CardHeader`, `CardContent`, `Badge`, `StatusPill`, `Input`, `Textarea`, `Label`, `Sidebar` (AgentBuilder left rail), `SectionMarker`, `TerminalBlock`, `KPIStat`, `DataRow`

**New shared components needed (`app/os/components/`):**
- `OSTopbar` — sticky frosted topbar with live metric chips
- `OSBreadcrumb` — mono uppercase breadcrumb trail
- `HealthDot` — 8px colored dot (currently exported from HubClient, must move)
- `StagePipeline` — 4-dot progress trail (same issue)
- `EmptyState` — centered mono uppercase "no data" message

---

## Structural Work Required

1. **Split HubClient.tsx** into 9 section components + orchestrator:
   `CompanyTasksSection`, `DiagnosticFeedSection`, `ActiveClientsSection`, `AgentRegistrySection`, `PipelineSection`, `FinanceSection`, `InvestorSection`, `QuickLinksSection`, `InternalDocsSection`

2. **Extract shared sub-components** — `HealthDot`, `StagePipeline`, `StatusBadge` currently live inside HubClient and are imported by ClientWorkspace. Move to `app/os/components/shared.tsx`.

3. **Remove all injected `<style>` tags** — both HubClient and ClientWorkspace inject raw CSS for responsive breakpoints. Replace with Tailwind responsive classes.

4. **Fix cross-imports** — ClientWorkspace imports from HubClient directly. After extraction to shared.tsx, update all import paths.

---

## Key Risk

The `ds/Card` component is `bg-white`. If the redesign uses a dark page background, cards will look correct (white cards on dark = standard card elevation). But if the layout uses `bg-paper` (warm off-white) as the page bg, cards need `border border-rule` to be visible — this is already in the Card spec so it works.

The one tricky area: the current HubClient dark surface uses `rgba(255,255,255,0.04)` semi-transparent cards over a dark bg. The redesign shifts to light mode — these all become `bg-white` cards over `bg-paper`, which is the correct ds/ pattern.

---

## Files Written

- `research/internal/findings.md` — full file inventory, color audit, component map, API routes, navigation, table list, critical issues
- `research/internal/replacement-map.md` — 50-row file-by-file replacement table (current pattern → ds/ component)

---

## Next Step

```
/karimo:plan --prd os-dashboard-redesign
```

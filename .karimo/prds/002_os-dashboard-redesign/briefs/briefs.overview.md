# Briefs Overview: os-dashboard-redesign

Generated after all 8 task briefs are complete.

## Task Summary

| Task | Title | Wave | Complexity | Model | Status |
|------|-------|------|------------|-------|--------|
| [T01](T01.md) | OS Layout — dark Sidebar + OSTopbar | 1 | 3 | sonnet | ready |
| [T02](T02.md) | Shared OS components — OSBreadcrumb, HealthDot, StagePipeline, EmptyState | 1 | 2 | sonnet | ready |
| [T03](T03.md) | /os overview page — KPI summary dashboard | 2 | 2 | sonnet | ready |
| [T04](T04.md) | 6 section pages — tasks, feed, agents, pipeline, investors, links | 2 | 5 | opus | ready |
| [T05](T05.md) | /os/clients list page | 2 | 2 | sonnet | ready |
| [T06](T06.md) | /os/finance page | 2 | 3 | sonnet | ready |
| [T07](T07.md) | Rebuild ClientWorkspace.tsx with ds/ components | 2 | 4 | sonnet | ready |
| [T08](T08.md) | Rebuild AgentBuilder.tsx with ds/ components + light wizard rail | 2 | 4 | sonnet | ready |

## Wave Breakdown

### Wave 1 — No dependencies (run in parallel)

- **T01** — Create `app/os/components/OSTopbar.tsx` + update `OSSidebar.tsx` to use route-based navigation with live count badges
- **T02** — Create `app/os/components/OSBreadcrumb.tsx` + `app/os/components/shared.tsx` (HealthDot, StagePipeline, EmptyState)

### Wave 2 — Depends on T01 + T02 (all can run in parallel after Wave 1)

- **T03** — Replace `app/os/page.tsx` with KPI overview (4 cards: tasks, MRR, clients, pipeline)
- **T04** — Create 6 section pages: tasks, feed, agents, pipeline, investors, links
- **T05** — Create `app/os/clients/page.tsx` client list
- **T06** — Create `app/os/finance/page.tsx` finance dashboard
- **T07** — Rebuild `ClientWorkspace.tsx` removing HubClient import + all inline styles
- **T08** — Rebuild `AgentBuilder.tsx` with light wizard rail + ds/ components

## Source File Mapping

| Source (HubClient.tsx section) | Target file |
|-------------------------------|-------------|
| Entire monolith (989 lines) | Being dismantled |
| § 00 COMPANY TASKS | `app/os/tasks/page.tsx` (T04) |
| § 01 DIAGNOSTIC FEED | `app/os/feed/page.tsx` (T04) |
| § 02 ACTIVE CLIENTS | `app/os/clients/page.tsx` (T05) |
| § 03 AGENT REGISTRY | `app/os/agents/page.tsx` (T04) |
| § 04 PIPELINE | `app/os/pipeline/page.tsx` (T04) |
| § 05 FINANCE | `app/os/finance/page.tsx` (T06) |
| § 06 INVESTOR | `app/os/investors/page.tsx` (T04) |
| § 07 QUICK LINKS | `app/os/links/page.tsx` (T04) |
| § 08 INTERNAL DOCS | `app/os/links/page.tsx` (T04) |
| HealthDot, StagePipeline | `app/os/components/shared.tsx` (T02) |

## File Overlap Analysis

| File | Tasks | Notes |
|------|-------|-------|
| `app/os/HubClient.tsx` | T03, T04, T05, T06 (read source only) | Not modified by any task — stays until manual cleanup |
| `app/os/OSSidebar.tsx` | T01 only | Single owner |
| `app/os/components/OSTopbar.tsx` | T01 creates, T03/T04/T05/T06 import | No conflict (read-only after T01) |
| `app/os/components/shared.tsx` | T02 creates, T05/T07 import | No conflict |
| `app/os/components/OSBreadcrumb.tsx` | T02 creates, T07/T08 import | No conflict |
| `app/os/clients/[id]/ClientWorkspace.tsx` | T07 only | Single owner |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | T08 only | Single owner |

## ds/ Component Usage Map

| Component | Used in |
|-----------|---------|
| `Button` | T03, T04, T05, T06, T07, T08 |
| `Card`, `CardHeader`, `CardContent` | T03, T04, T05, T06, T07, T08 |
| `Badge` | T04, T05, T06, T07, T08 |
| `StatusPill` | T04, T06, T07, T08 |
| `Input` | T04, T05, T06, T07, T08 |
| `Textarea` | T07, T08 |
| `Label` | T04, T05, T06, T07, T08 |
| `SectionMarker` | T03, T04, T05, T06, T07, T08 |
| `KPIStat` | T03, T04, T06 |
| `DataRow` | T06, T07, T08 |
| `TerminalBlock` | T04 (feed), T08 |
| `Sidebar` | NOT used — OSSidebar is custom-built |

## Quick Links

- [PRD](../PRD_os-dashboard-redesign.md)
- [Tasks YAML](../tasks.yaml)
- [T01 Brief](T01.md)
- [T02 Brief](T02.md)
- [T03 Brief](T03.md)
- [T04 Brief](T04.md)
- [T05 Brief](T05.md)
- [T06 Brief](T06.md)
- [T07 Brief](T07.md)
- [T08 Brief](T08.md)

## Critical Constraints (apply to ALL tasks)

1. `app/os/clients/[id]/page.tsx` — EXISTS, do NOT touch
2. `components/ds/` — READ ONLY
3. `app/os/HubClient.tsx` — do NOT modify (stays until manual cleanup after all tasks complete)
4. Auth guard `const session = await auth(); if (!session) redirect(...)` must be preserved in T03 and T04 (feed page)
5. No injected `<style>` tags in any output file
6. No `style={{}}` inline objects except: priority dot (T04 tasks), progress bar width (T04 investors), deploy card borderLeft (T08), sticky container backgrounds

---
*For full briefs, see `T{NN}.md` files.*
*Total complexity: 25 | Wave 1: 5 | Wave 2: 20*

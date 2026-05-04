# OS Dashboard — Internal Audit Findings

**Scanned:** 2026-05-03  
**Scope:** app/os/, app/api/os/, components/ds/

---

## 1. File Inventory

### app/os/

| File | What it does | Approx lines |
|------|-------------|--------------|
| `app/os/page.tsx` | Server page: auth guard, fetches submissions from Supabase, renders HubClient | 39 |
| `app/os/HubClient.tsx` | Monolithic client component — the entire OS hub dashboard (topbar + 8 sections) | 989 |
| `app/os/clients/[id]/page.tsx` | Server page: fetches client + submissions, renders ClientWorkspace | 19 |
| `app/os/clients/[id]/ClientWorkspace.tsx` | Client workspace detail page — agents, service tasks, notes, activity log | 651 |
| `app/os/clients/[id]/agents/[agentId]/page.tsx` | Server page: fetches agent + client brief, renders AgentBuilder | 27 |
| `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` | 6-step agent creation wizard + deploy/run panel | 832 |

### app/api/os/

| File | Method(s) | What it does |
|------|-----------|-------------|
| `app/api/os/metrics/route.ts` | GET | PostHog funnel events (7d + 30d) |
| `app/api/os/clients/route.ts` | GET, POST | List clients with agent count + latest task; create client |
| `app/api/os/clients/[id]/route.ts` | GET, PATCH, DELETE | Full client with agents, tasks, activity; update; delete |
| `app/api/os/clients/[id]/agents/route.ts` | GET, POST | List agents for client; create agent |
| `app/api/os/clients/[id]/agents/[agentId]/route.ts` | GET, PATCH, DELETE | Get, update, delete single agent |
| `app/api/os/clients/[id]/agents/[agentId]/run/route.ts` | POST | Execute agent via Claude API, record run, Langfuse trace |
| `app/api/os/clients/[id]/agents/[agentId]/runs/route.ts` | GET | Last 20 run records for agent |
| `app/api/os/clients/[id]/tasks/route.ts` | GET, POST | List + create service tasks |
| `app/api/os/clients/[id]/tasks/[taskId]/route.ts` | PATCH, DELETE | Update or delete service task |
| `app/api/os/clients/[id]/activity/route.ts` | GET, POST | Activity log |
| `app/api/os/company-tasks/route.ts` | GET, POST | Company-level tasks |
| `app/api/os/company-tasks/[id]/route.ts` | PATCH, DELETE | Update or delete company task |
| `app/api/os/pipeline/route.ts` | GET, POST | Pipeline deals |
| `app/api/os/pipeline/[id]/route.ts` | PATCH, DELETE | Update or delete deal |
| `app/api/os/investors/route.ts` | GET, POST | Investor tracker |
| `app/api/os/investors/[id]/route.ts` | PATCH, DELETE | Update or delete investor |
| `app/api/os/finance/route.ts` | GET | Stripe MRR/ARR/customers + manual bank balance from os_state |
| `app/api/os/state/route.ts` | GET, POST | Key-value state store for persistent OS settings |

---

## 2. Current Visual Stack

### Color approach
All OS components use **inline `style={}` objects** with hardcoded `rgba()` values. Zero Tailwind color classes. Zero `components/ds/` imports anywhere in `app/os/`.

The color model is **fully inverted** throughout — `var(--ink)` as the page background, `var(--paper)` as text.

| Pattern | Usage |
|---------|-------|
| `rgba(255,255,255,0.04)` | Card backgrounds |
| `rgba(255,255,255,0.07)` | Card borders |
| `rgba(20,20,19,0.95)` | Topbar background (frosted) |
| `rgba(255,255,255,0.06)` | Input backgrounds |
| `rgba(255,255,255,0.1)` | Input borders |
| `var(--accent)` | CTAs, markers, value highlights |
| `var(--paper)` | All text on dark bg |
| `#4ade80` | Success/live green (hardcoded hex) |
| `#f59e0b` | Warning/in-progress amber (hardcoded hex) |
| `rgba(140,43,26,0.2)` | Error/blocked backgrounds |

### Font usage
- **Space Grotesk** — referenced via string literal `fontFamily: 'Space Grotesk, sans-serif'`
- **JetBrains Mono** — referenced via string literal `fontFamily: 'JetBrains Mono, monospace'`
- Neither `.mono` class nor CSS font variables are used

### Layout
- All layout via inline `style={}` — flexbox/grid with explicit pixel values
- **Responsive CSS injected via `<style>{RESPONSIVE_CSS}</style>`** inside component body — fragile and unmaintainable
- Breakpoints at 900px and 600px
- Max-width 1280px, padding 48px 32px desktop

---

## 3. Component Inventory

### HubClient.tsx (989 lines — monolith)

**Props:** `{ submissions: Submission[] }`

**Data fetched client-side:** `/api/os/metrics`, `/api/os/clients`, `/api/os/agents`, `/api/os/company-tasks`, `/api/os/pipeline`, `/api/os/investors`, `/api/os/finance`

**Local sub-components (duplicates of ds/):**
- `SectionMarker({ n, label, noMargin })` — duplicates `components/ds/SectionMarker`
- `Stat({ label, value })` — duplicates `components/ds/KPIStat`
- `StatusBadge({ status })` — duplicates `components/ds/Badge`
- `HealthDot({ health })`, `StagePipeline({ stage })`, `Skeleton({ height })` — no ds/ equivalent

**Sections rendered:**
1. Topbar — sticky, frosted, live metric chips, clock, sign out
2. § 00 · COMPANY TASKS — filter tabs, task rows, inline add form
3. § 01 · DIAGNOSTIC FEED — 4 stat cards, submissions table, funnel metrics
4. § 02 · ACTIVE CLIENTS — clients table, inline add form
5. § 03 · AGENT REGISTRY — all-agents table with status badge
6. § 04 · PIPELINE — deals list, inline add form
7. § 05 · FINANCE — stat cards, recent charges, quick links
8. § 06 · INVESTOR — raise progress bar, investor rows
9. § 07 · QUICK LINKS — 18-item grid
10. § 08 · INTERNAL DOCS — 4-item grid

---

### ClientWorkspace.tsx (651 lines)

**Props:** `{ client: ClientFull; allSubmissions: SubmissionBrief[] }`

**Cross-imports:** Imports `HealthDot`, `StagePipeline`, `StatusBadge` from `../../HubClient` — tight coupling that must be fixed

**Local sub-components:** `SectionLabel({ n, label })` — duplicates `components/ds/SectionMarker`

**Layout:** 2-column grid (2fr left / 1fr right), collapses to 1 col at 900px

**Sections:** Topbar breadcrumb, Client header, § A · AGENTS, § B · SERVICE TASKS, § C · LINKED DIAGNOSTIC, § D · NOTES, § E · ACTIVITY LOG

---

### AgentBuilder.tsx (832 lines)

**Props:** `{ agent: AgentFull; client: ClientBrief }`

**Layout:** 200px fixed left rail (step nav) + flex-1 scrollable right content

**Steps:** 1. IDENTITY → 2. INSTRUCTIONS → 3. INTEGRATIONS → 4. TRIGGER → 5. REVIEW → 6. DEPLOY

---

## 4. Navigation Structure

| Route | Page |
|-------|------|
| `/os` | Hub — all 8 sections, single scrolling page |
| `/os/clients/:id` | Client workspace |
| `/os/clients/:id/agents/:agentId` | Agent builder wizard |

**No sidebar nav.** The hub is a single scrolling page with a sticky topbar. AgentBuilder has a local step navigator (200px fixed left rail).

---

## 5. Supabase Tables

| Table | Access |
|-------|--------|
| `submissions` | Read only (SSR) |
| `clients` | Read + Write |
| `agents` | Read + Write |
| `service_tasks` | Read + Write |
| `activity_log` | Read + Write |
| `company_tasks` | Read + Write |
| `pipeline_deals` | Read + Write |
| `investors` | Read + Write |
| `os_state` | Read + Write (key-value) |
| `agent_runs` | Read + Write |

---

## 6. Critical Issues Found

1. **HubClient.tsx is 989 lines.** Must be split into section components during redesign.
2. **Injected `<style>` tags** — both `HubClient.tsx` and `ClientWorkspace.tsx` inject raw CSS via `<style>{CSS}</style>` inside the component body. Must be replaced with Tailwind responsive classes.
3. **Cross-file imports** — `ClientWorkspace.tsx` imports `HealthDot`, `StagePipeline`, `StatusBadge` from `HubClient.tsx`. These must move to `app/os/components/shared.tsx`.
4. **ds/ Card is light-mode** (`bg-white`) — the OS dashboard uses dark bg. The redesign decision (from the plan interview): light base + dark sidebar + dark header. Card components will work correctly on the light content area.
5. **Auth missing** — several API routes have `// TODO: add session auth` comments. Out of scope for this PRD but flagged.
6. **Table name inconsistency** — run route references `tasks` table, but client task API uses `service_tasks`. Possible bug.

---

## 7. Gap Analysis — ds/ Usage

**Current state: zero ds/ imports in /os.**

Every interactive element has a direct ds/ replacement. See `replacement-map.md` for the full file-by-file table.

**Patterns with no ds/ equivalent (need new shared components):**

| Pattern | Location | Approach |
|---------|---------|----------|
| OS Topbar | HubClient | New `app/os/components/OSTopbar.tsx` |
| Breadcrumb nav | ClientWorkspace, AgentBuilder | New `app/os/components/OSBreadcrumb.tsx` |
| HealthDot | HubClient, ClientWorkspace | New `app/os/components/shared.tsx` |
| StagePipeline | HubClient, ClientWorkspace | New `app/os/components/shared.tsx` |
| EmptyState | All sections | New `app/os/components/shared.tsx` |

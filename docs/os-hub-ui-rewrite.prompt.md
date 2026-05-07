# OS Hub UI Rewrite — One-Shot Build Prompt
# Use this with: claude --dangerously-skip-permissions < docs/os-hub-ui-rewrite.prompt.md

You are working inside the eevolvv Next.js codebase (TypeScript, Tailwind, Supabase, NextAuth).

## Context
The OS hub at `/os` is an internal dashboard for eevolvv. It lives in:
- `app/os/HubClient.tsx` — main 684-line client component (the whole page UI)
- `app/os/OSSidebar.tsx` — collapsible sidebar with section nav

The DB migration (005) and all new API routes are already built and working:
- `GET/POST /api/os/company-tasks` + `PATCH/DELETE /api/os/company-tasks/[id]`
- `GET/POST /api/os/pipeline` + `PATCH/DELETE /api/os/pipeline/[id]`
- `GET/POST /api/os/investors` + `PATCH/DELETE /api/os/investors/[id]`
- `GET /api/os/finance` → returns `{ stripe_connected, mrr, arr, customer_count, recent_charges[], bank_balance }`

Design system tokens (from `app/globals.css`):
- `--paper`: #faf7f0 (warm white)
- `--ink`: #141413 (near black)
- `--accent`: oklch(0.45 0.13 25) ≈ #8C2B1A (brick red)
- `--rule`: rgba(20,20,19,.14)
- Fonts: Space Grotesk (headings/UI), JetBrains Mono (labels/code), Newsreader (italic accents)
- Status green (live indicators only): #4ade80

## Task: Rewrite `app/os/HubClient.tsx` completely

### New type definitions to add at top:
```ts
type CompanyTask = {
  id: string; title: string; description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  priority: 'high' | 'normal' | 'low'
  category: 'fundraise' | 'product' | 'sales' | 'ops' | 'marketing' | 'general'
  due_date: string | null; assignee: string | null; notes: string | null
  created_at: string; updated_at: string
}
type PipelineDeal = {
  id: string; company: string; contact_name: string | null; contact_email: string | null
  stage: 'lead' | 'discovery' | 'proposal' | 'contract' | 'active' | 'lost'
  value: number | null; notes: string | null; last_contact_at: string | null
  created_at: string; updated_at: string
}
type Investor = {
  id: string; name: string; firm: string | null
  stage: 'intro' | 'meeting' | 'dd' | 'term_sheet' | 'closed' | 'passed'
  check_size: string | null; last_contact_at: string | null
  next_action: string | null; notes: string | null
  created_at: string; updated_at: string
}
type FinanceData = {
  stripe_connected: boolean; mrr: string | null; arr: string | null
  customer_count: number | null; bank_balance: string
  recent_charges: Array<{ id: string; amount: string; description: string; date: string; status: string }>
}
```

### Topbar — upgrade with live vitals strip:
Replace the current topbar (which shows "Agents Desk by eevolvv", clock, INTERNAL badge, sign out) with:
- Left: "eevolvv" wordmark (Space Grotesk 600, 15px) + thin divider + live vitals strip
- Vitals strip shows (loaded from state on mount, update as data loads):
  - `tasks N` — count of non-done company tasks
  - `clients N` — count of active clients  
  - `mrr $X` — from finance API
  - `● live` — green dot + "live" text (always show)
- Each vital: label at 40% opacity + value in `var(--accent)`
- Right: clock + INTERNAL badge (keep existing). Remove "Agents Desk by eevolvv" text.

### State to add:
```ts
const [companyTasks, setCompanyTasks] = useState<CompanyTask[]>([])
const [companyTasksLoading, setCompanyTasksLoading] = useState(true)
const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>('all')
const [newTaskOpen, setNewTaskOpen] = useState(false)
const [newTaskForm, setNewTaskForm] = useState({ title: '', category: 'general', priority: 'normal', due_date: '' })
const [taskSubmitting, setTaskSubmitting] = useState(false)

const [deals, setDeals] = useState<PipelineDeal[]>([])
const [dealsLoading, setDealsLoading] = useState(true)
const [newDealOpen, setNewDealOpen] = useState(false)
const [newDealForm, setNewDealForm] = useState({ company: '', contact_name: '', contact_email: '', stage: 'lead', value: '' })
const [dealSubmitting, setDealSubmitting] = useState(false)

const [investors, setInvestors] = useState<Investor[]>([])
const [investorsLoading, setInvestorsLoading] = useState(true)
const [newInvestorOpen, setNewInvestorOpen] = useState(false)
const [newInvestorForm, setNewInvestorForm] = useState({ name: '', firm: '', stage: 'intro', check_size: '', next_action: '' })
const [investorSubmitting, setInvestorSubmitting] = useState(false)

const [finance, setFinance] = useState<FinanceData | null>(null)
const [financeLoading, setFinanceLoading] = useState(true)
const [bankBalanceEditing, setBankBalanceEditing] = useState(false)
const [bankBalanceLocal, setBankBalanceLocal] = useState('')
```

### useEffect fetches to add:
```ts
useEffect(() => {
  fetch('/api/os/company-tasks').then(r => r.json()).then(setCompanyTasks).catch(() => {}).finally(() => setCompanyTasksLoading(false))
}, [])
useEffect(() => {
  fetch('/api/os/pipeline').then(r => r.json()).then(setDeals).catch(() => {}).finally(() => setDealsLoading(false))
}, [])
useEffect(() => {
  fetch('/api/os/investors').then(r => r.json()).then(setInvestors).catch(() => {}).finally(() => setInvestorsLoading(false))
}, [])
useEffect(() => {
  fetch('/api/os/finance').then(r => r.json()).then((d: FinanceData) => { setFinance(d); setBankBalanceLocal(d.bank_balance) }).catch(() => {}).finally(() => setFinanceLoading(false))
}, [])
```

### Helper: `cycleTaskStatus`
```ts
const cycleTaskStatus = useCallback(async (task: CompanyTask) => {
  const order: CompanyTask['status'][] = ['todo', 'in_progress', 'done', 'todo']
  const next = order[order.indexOf(task.status) + 1] ?? 'todo'
  const res = await fetch(`/api/os/company-tasks/${task.id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next })
  })
  if (res.ok) setCompanyTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t))
}, [])
```

### Helper: `cycleDealStage`
```ts
const DEAL_STAGES = ['lead','discovery','proposal','contract','active','lost'] as const
const cycleDealStage = useCallback(async (deal: PipelineDeal) => {
  const idx = DEAL_STAGES.indexOf(deal.stage)
  const next = DEAL_STAGES[idx + 1] ?? 'lead'
  const res = await fetch(`/api/os/pipeline/${deal.id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: next })
  })
  if (res.ok) setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: next } : d))
}, [])
```

### Helper: `cycleInvestorStage`
```ts
const INV_STAGES = ['intro','meeting','dd','term_sheet','closed','passed'] as const
const cycleInvestorStage = useCallback(async (investor: Investor) => {
  const idx = INV_STAGES.indexOf(investor.stage)
  const next = INV_STAGES[Math.min(idx + 1, INV_STAGES.length - 1)]
  if (next === investor.stage) return
  const res = await fetch(`/api/os/investors/${investor.id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: next })
  })
  if (res.ok) setInvestors(prev => prev.map(i => i.id === investor.id ? { ...i, stage: next } : i))
}, [])
```

### New submit handlers:
```ts
const submitTask = async () => {
  if (!newTaskForm.title.trim()) return
  setTaskSubmitting(true)
  const res = await fetch('/api/os/company-tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTaskForm) })
  if (res.ok) { const t = await res.json(); setCompanyTasks(prev => [t, ...prev]); setNewTaskOpen(false); setNewTaskForm({ title: '', category: 'general', priority: 'normal', due_date: '' }) }
  setTaskSubmitting(false)
}
const submitDeal = async () => {
  if (!newDealForm.company.trim()) return
  setDealSubmitting(true)
  const res = await fetch('/api/os/pipeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newDealForm, value: newDealForm.value ? parseFloat(newDealForm.value) : null }) })
  if (res.ok) { const d = await res.json(); setDeals(prev => [d, ...prev]); setNewDealOpen(false); setNewDealForm({ company: '', contact_name: '', contact_email: '', stage: 'lead', value: '' }) }
  setDealSubmitting(false)
}
const submitInvestor = async () => {
  if (!newInvestorForm.name.trim()) return
  setInvestorSubmitting(true)
  const res = await fetch('/api/os/investors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newInvestorForm) })
  if (res.ok) { const i = await res.json(); setInvestors(prev => [i, ...prev]); setNewInvestorOpen(false); setNewInvestorForm({ name: '', firm: '', stage: 'intro', check_size: '', next_action: '' }) }
  setInvestorSubmitting(false)
}
const saveBankBalance = async () => {
  await fetch('/api/os/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'os_finance', value: { ...(finance ?? {}), bank_balance: bankBalanceLocal } }) })
  setFinance(prev => prev ? { ...prev, bank_balance: bankBalanceLocal } : prev)
  setBankBalanceEditing(false)
}
```

### Color helpers:
```ts
function taskStatusStyle(status: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    todo:        { background: 'rgba(255,255,255,0.06)', color: 'rgba(250,247,240,0.45)' },
    in_progress: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' },
    done:        { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
    blocked:     { background: 'rgba(140,43,26,0.2)', color: 'var(--accent)', border: '1px solid rgba(140,43,26,0.3)' },
  }
  return map[status] ?? map.todo
}
function taskPriorityColor(priority: string): string {
  return priority === 'high' ? 'var(--accent)' : priority === 'low' ? 'rgba(250,247,240,0.2)' : 'rgba(250,247,240,0.45)'
}
function dealStageStyle(stage: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    lead:     { background: 'rgba(255,255,255,0.08)', color: 'rgba(250,247,240,0.5)' },
    discovery:{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' },
    proposal: { background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' },
    contract: { background: 'rgba(140,43,26,0.2)', color: 'var(--accent)', border: '1px solid rgba(140,43,26,0.3)' },
    active:   { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
    lost:     { background: 'rgba(255,255,255,0.04)', color: 'rgba(250,247,240,0.25)' },
  }
  return map[stage] ?? map.lead
}
function investorStageStyle(stage: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    intro:       { background: 'rgba(255,255,255,0.06)', color: 'rgba(250,247,240,0.4)' },
    meeting:     { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' },
    dd:          { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' },
    term_sheet:  { background: 'rgba(140,43,26,0.2)', color: 'var(--accent)', border: '1px solid rgba(140,43,26,0.3)' },
    closed:      { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
    passed:      { background: 'rgba(255,255,255,0.04)', color: 'rgba(250,247,240,0.25)' },
  }
  return map[stage] ?? map.intro
}
```

### Section layout changes:

Add this CSS to RESPONSIVE_CSS:
```css
.os-group-divider { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(250,247,240,0.2); padding: 6px 0; margin: 48px 0 40px; display: flex; align-items: center; gap: 12px; }
.os-group-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%); }
.os-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.os-section-hd-right { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(250,247,240,0.35); }
.os-meta-btn { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); background: none; border: 1px solid rgba(140,43,26,0.4); padding: 3px 9px; cursor: pointer; border-radius: 2px; transition: border-color 0.15s, background 0.15s; }
.os-meta-btn:hover { background: rgba(140,43,26,0.1); border-color: var(--accent); }
.task-filter-tabs { display: flex; gap: 4px; margin-bottom: 14px; flex-wrap: wrap; }
.task-filter-tab { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 9px; border-radius: 2px; background: rgba(255,255,255,0.04); border: 1px solid transparent; color: rgba(250,247,240,0.4); cursor: pointer; transition: all 0.12s; }
.task-filter-tab.active { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.1); color: var(--paper); }
.task-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.12s; }
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: rgba(255,255,255,0.03); }
.deal-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.12s; }
.deal-row:last-child { border-bottom: none; }
.deal-row:hover { background: rgba(255,255,255,0.03); }
.inv-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.12s; }
.inv-row:last-child { border-bottom: none; }
.inv-row:hover { background: rgba(255,255,255,0.03); }
.os-stage-pill { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 2px; flex-shrink: 0; cursor: pointer; transition: opacity 0.12s; }
.os-stage-pill:hover { opacity: 0.75; }
.os-status-chip { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; cursor: pointer; flex-shrink: 0; transition: opacity 0.12s; }
.os-status-chip:hover { opacity: 0.75; }
.finance-stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 18px; }
.finance-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(250,247,240,0.35); margin-bottom: 8px; }
.finance-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 2rem; line-height: 1; color: var(--accent); }
.finance-source-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #4ade80; border: 1px solid rgba(74,222,128,0.25); padding: 1px 6px; border-radius: 2px; margin-top: 6px; }
.finance-manual-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(250,247,240,0.3); padding: 1px 6px; margin-top: 6px; cursor: pointer; border-bottom: 1px solid rgba(250,247,240,0.15); }
.raise-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; margin: 10px 0; overflow: hidden; }
.raise-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.5s ease; }
.os-empty-state { padding: 40px 24px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(250,247,240,0.2); }
```

### New section order in JSX (replace all existing sections):

**§ 00 — COMPANY TASKS** (new, at top, before Diagnostic Feed):
- Section header: left = `§ 00 · COMPANY TASKS`, right = `{openTaskCount} open` + `<button className="os-meta-btn" onClick={() => setNewTaskOpen(v => !v)}>+ new task</button>`
- Category filter tabs: All | Fundraise | Product | Sales | Ops | Marketing — each shows count badge
- Filter tasks: `companyTasks.filter(t => t.status !== 'done' && (taskCategoryFilter === 'all' || t.category === taskCategoryFilter))`
- Task rows inside `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)` wrapper:
  - priority dot (color from taskPriorityColor) + title (flex:1) + category tag (opacity 0.4, 10px mono) + due_date (opacity 0.3) + status chip (click = cycleTaskStatus)
- Slide-in "+ new task" form: title (full width), then row: category select + priority select + due_date input + submit button
- Empty state if no tasks: "No open tasks — you're either done or not tracking. Add your first task."

**§ 01 — DIAGNOSTIC FEED** (keep existing, just add funnel metrics inline below the table as a compact row of 4 event counts):
- Keep the 4-stat header + submission table exactly as-is
- After the table, add a compact metrics row: the 4 FUNNEL_EVENTS as inline `event: 7d count / 30d count` with conversion arrows between them. Replace the entire separate `§ 02 FUNNEL METRICS` section with this row.

**§ 02 — ACTIVE CLIENTS** (renumbered from 03, keep exactly as-is, just renumber the SectionMarker)

**§ 03 — AGENT REGISTRY** (renumbered from 04, keep exactly as-is, slim the table: remove Repo and Deploy columns)

**Group divider JSX between §03 and §04:**
```jsx
<div className="os-group-divider">Business Development</div>
```

**§ 04 — PIPELINE** (rebuild):
- Compute: `const totalPipelineValue = deals.filter(d => d.stage !== 'lost').reduce((s, d) => s + (d.value ?? 0), 0)`
- Section header: left = `§ 04 · PIPELINE`, right = `$${totalPipelineValue.toLocaleString()} total` + `<button className="os-meta-btn" onClick={() => setNewDealOpen(v => !v)}>+ new deal</button>`
- Slide-in form: company (required), contact_name, contact_email, stage select, value input → submit
- Deal table inside card wrapper:
  - Columns: stage pill (clickable = cycleDealStage) | company (bold) | contact | value | last contact | delete button
  - Stage pill styled with dealStageStyle()
  - Empty state: "No deals tracked — add your first prospect to the pipeline"

**§ 05 — FINANCE** (fix with live Stripe):
- Fetch `/api/os/finance` on mount
- If loading: 4 skeleton cards
- If `finance.stripe_connected = true`: 4 stat cards: MRR (live stripe tag), ARR (live stripe tag), Customers (live stripe tag), Bank Balance (manual, editable)
- If `finance.stripe_connected = false`: 3 stat cards showing "—" + a connect CTA card: `Add STRIPE_SECRET_KEY to Vercel → env vars to enable live data`
- Bank balance card: click value to edit inline (same EditableField pattern), save on blur/enter via saveBankBalance()
- Below stats: recent charges mini-table (only if stripe_connected and recent_charges.length > 0)
- Bottom row: quick links to Mercury, Stripe, Wave (same as before)

**§ 06 — INVESTOR** (rebuild from 08):
- Compute: `const totalCommitments = investors.filter(i => i.stage === 'closed').reduce((s,i) => { const n = parseFloat((i.check_size ?? '0').replace(/[^0-9.]/g,'')); return s + (isNaN(n) ? 0 : n) }, 0)`
- Section header: left = `§ 06 · INVESTOR`, right = `$${totalCommitments.toLocaleString()} / $1M committed` + `<button className="os-meta-btn" onClick={() => setNewInvestorOpen(v => !v)}>+ add investor</button>`
- Progress bar: `<div className="raise-bar"><div className="raise-fill" style={{ width: `${Math.min(100, (totalCommitments/1000000)*100)}%` }} /></div>`
- Subtitle: "Pre-seed · $1M target · Q2 2026" at 25% opacity
- Slide-in form: name (required), firm, stage select, check_size, next_action → submit
- Investor table inside card wrapper:
  - Columns: stage pill (clickable = cycleInvestorStage, styled with investorStageStyle) | name (bold) | firm (muted) | check_size | next_action (truncated, muted) | last contact relative time | delete
  - Empty state: "No investors tracked — add your first LP or VC contact"
- Bottom: links to Pitch Deck (/investor/pitch.html) and Calendly

**§ 07 — QUICK LINKS** (renumbered from 09):
- Keep exactly the same QUICK_LINKS array but ADD these two entries:
  ```ts
  { name: 'GitHub', tag: 'Codebase', url: 'https://github.com/ebarbosa-asg/eevolvv' },
  { name: 'Vercel', tag: 'Hosting', url: 'https://vercel.com/dashboard' },
  ```
- Keep the grid layout as-is

**§ 08 — INTERNAL DOCS** (renumbered from 10, keep exactly as-is)

**REMOVE entirely:** The old §05 Pipeline (text fields), §06 Finance (text fields), §07 Engineering (commits + links), §08 Investor (text fields). Also remove the associated state: `pipeline`, `finance`, `investor` useState objects and their `updatePipeline`, `updateFinance`, `updateInvestor` callbacks and timer refs (pipelineTimer, financeTimer, investorTimer). Keep `saveState` helper but it's now only used by bank balance.

### Task: Update `app/os/OSSidebar.tsx`

Replace the SECTIONS constant with:
```ts
const SECTIONS = [
  { n: '00', label: 'COMPANY TASKS', anchor: 'company-tasks' },
  { n: '01', label: 'DIAGNOSTIC FEED', anchor: 'diagnostic-feed' },
  { n: '02', label: 'ACTIVE CLIENTS', anchor: 'active-clients' },
  { n: '03', label: 'AGENT REGISTRY', anchor: 'agent-registry' },
  { n: '04', label: 'PIPELINE', anchor: 'pipeline' },
  { n: '05', label: 'FINANCE', anchor: 'finance' },
  { n: '06', label: 'INVESTOR', anchor: 'investor' },
  { n: '07', label: 'QUICK LINKS', anchor: 'quick-links' },
  { n: '08', label: 'INTERNAL DOCS', anchor: 'internal-docs' },
]
```

Add section group labels in the nav. Before §00 show "COMPANY" group, before §01 show "OPERATIONS" group, before §04 show "BUSINESS" group, before §07 show "INTERNAL" group. Style group labels: `font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.25; padding: 10px 18px 4px; display: block`.

Add count badges to §00 (open company tasks), §02 (active clients), §03 (agent count). The sidebar already fetches clients from `/api/os/clients`. Add a fetch for company_tasks count:
```ts
const [openTaskCount, setOpenTaskCount] = useState(0)
useEffect(() => {
  fetch('/api/os/company-tasks').then(r => r.json()).then((d: CompanyTask[]) => setOpenTaskCount(d.filter(t => t.status !== 'done').length)).catch(() => {})
}, [])
```
Import the CompanyTask type: `import type { CompanyTask } from './HubClient'`

### Final step:
Run `npx tsc --noEmit` and fix any TypeScript errors. Then run `npm run build` and verify it compiles clean.

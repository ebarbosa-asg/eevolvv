# Internal Research Findings: OS Tasks Area + Agent Builder

## Current `service_tasks` Model
```ts
type Task = {
  id: string; client_id: string; title: string; description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  due_date: string | null; priority: 'high' | 'normal' | 'low'
  created_at: string; updated_at: string
}
```
POST writes: client_id, title, description, status, due_date, priority. PATCH does raw update(body).

**Missing fields:**
- `agent_id UUID REFERENCES agents(id)` — no link between task and the agent it's building
- `category TEXT` — no way to tag 'agent_build' vs general service work
- `assignee TEXT`, `estimated_hrs NUMERIC`, `actual_hrs NUMERIC`, `sort_order INTEGER`

## Current `agents` Model
```ts
type Agent = {
  id: string; client_id: string; name: string; description: string | null
  type: string | null   // 'qa-automation'|'finance-audit'|'data-sync'|'reporting'|'notification'|'custom'
  status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null; repo_url: string | null; deploy_url: string | null
  last_run_at: string | null; health: 'green' | 'yellow' | 'red'; notes: string | null
  created_at: string; updated_at: string
}
```

**Critical missing fields for agent builder:**
- `trigger_type TEXT` — 'manual'|'schedule'|'webhook'|'event'
- `trigger_config JSONB` — cron string, webhook URL, event name
- `instructions TEXT` — the AI system prompt / natural-language spec
- `input_schema JSONB`, `output_schema JSONB`
- `estimated_output TEXT`
- `config JSONB` — integration-specific settings
- `version INTEGER`, `run_count INTEGER`, `error_count INTEGER`

## Current Agent UI Gaps
Add form has: Name, Description, Repo URL, Deploy URL, Integrations (plain text), Type, Status.
Edit form has even less: name, type, status, repo_url, deploy_url only.

Missing: trigger picker, instructions textarea, integration chip palette, estimated output preview, step-by-step wizard, dedicated agent page route.

## Current Task UI Gaps
- No `agent_id` — can't link a task to the agent it's building
- No task deletion button (API route exists, no UI)
- No cross-client tasks view
- `+ add task` at bottom, awkward on long lists
- No category field

## API Routes — What Exists
| Route | Methods |
|---|---|
| /api/os/clients/[id]/tasks | GET, POST |
| /api/os/clients/[id]/tasks/[taskId] | PATCH, DELETE |
| /api/os/clients/[id]/agents | GET, POST |
| /api/os/clients/[id]/agents/[agentId] | PATCH, DELETE (no GET — blocker for agent builder page) |
| /api/os/agents | GET (global registry) |

**Missing routes:**
- `GET /api/os/clients/[id]/agents/[agentId]` — required for agent builder page
- `POST /api/os/clients/[id]/agents/[agentId]/run` — manual trigger

## Design Patterns to Follow
All UI uses inline styles, no Tailwind. Constants:
```ts
const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '2px' }
const MONO = { fontFamily: 'JetBrains Mono, monospace' }
const MONO_LABEL = { ...MONO, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.4, marginBottom: '6px' }
const INPUT = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', ...MONO, fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' }
```
Slide-form reveal: CSS `.os-slide-form` with max-height + opacity transition.
Exports from HubClient.tsx: `StatusBadge`, `HealthDot`, `StagePipeline`, `Client`, `AgentRow`.

## Routing Structure
Current: `/os` and `/os/clients/[id]`
Proposed: `/os/clients/[id]/agents/[agentId]` (agent builder page)
Tasks stay embedded in ClientWorkspace, upgraded in-place.

## Key File References
- ClientWorkspace.tsx L24–50: Type definitions
- ClientWorkspace.tsx L295–487: Agent and task section UI
- HubClient.tsx L93–126: Shared exported components
- app/api/os/clients/[id]/agents/[agentId]/route.ts: PATCH+DELETE only, needs GET added

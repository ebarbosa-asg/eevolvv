# Research Summary: OS Tasks Area + Agent Builder
**Slug:** os-tasks-agent-builder  
**Date:** 2026-05-02

---

## What We're Building

Two features inside the eevolvv internal OS (`/os`), both scoped to per-client workspaces:

1. **Tasks area** — upgraded task board linked to automation work; tasks can be tagged to a specific agent being built
2. **Agent builder** — a 6-step wizard to compose, configure, and deploy an AI automation agent

---

## Database Changes Required

### ADD to `agents` table
```sql
ALTER TABLE agents ADD COLUMN trigger_type TEXT DEFAULT 'manual';    -- 'manual'|'schedule'|'webhook'
ALTER TABLE agents ADD COLUMN trigger_config JSONB;                  -- {'cron':'0 9 * * 1'} or {'url':'...'}
ALTER TABLE agents ADD COLUMN instructions TEXT;                     -- AI system prompt
ALTER TABLE agents ADD COLUMN estimated_output TEXT;                 -- plain-language output description
ALTER TABLE agents ADD COLUMN config JSONB;                          -- integration-specific settings
ALTER TABLE agents ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE agents ADD COLUMN run_count INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN error_count INTEGER DEFAULT 0;
```

### ADD to `service_tasks` table
```sql
ALTER TABLE service_tasks ADD COLUMN agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE service_tasks ADD COLUMN category TEXT DEFAULT 'general'; -- 'research'|'build'|'qa'|'review'|'deploy'|'comms'
ALTER TABLE service_tasks ADD COLUMN assignee TEXT;
ALTER TABLE service_tasks ADD COLUMN estimated_hrs NUMERIC(5,1);
ALTER TABLE service_tasks ADD COLUMN blocked_reason TEXT;
```

---

## New API Route Required

```
GET /api/os/clients/[id]/agents/[agentId]   ← currently missing, required for agent builder page
```

---

## Feature 1: Tasks Area (Upgrade ClientWorkspace)

### What changes
- Upgrade task rows to show: Status pill | Title | Category badge | Agent link pill | Est hrs | Due date | Delete
- Add `category` and `agent_id` to add/edit task form
- Add delete button per task (API already exists)
- Move `+ add task` button to top of section
- Show `blocked_reason` textarea when status = blocked

### Stays the same
- Same embedded position in ClientWorkspace left column (§ B)
- Same list-view layout, same status cycling on pill click
- Same slide-form reveal pattern for add/edit

---

## Feature 2: Agent Builder (New Page)

### New route
`/os/clients/[id]/agents/[agentId]` → `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx`

### 6-Step Wizard Structure
```
Step 1 — IDENTITY      Name, type, description
Step 2 — INSTRUCTIONS  System prompt textarea (JetBrains Mono, code-editor styling)
Step 3 — INTEGRATIONS  Chip multi-select palette (inline, no modal)
Step 4 — TRIGGER       3-card picker (Manual / Schedule / Webhook) + config form per type
Step 5 — REVIEW        Read-only summary + synthesized "This agent will…" sentence
Step 6 — DEPLOY        3-stage pipeline card (DEV → STAGING → LIVE) + promote buttons
```

### Step navigator
Fixed left rail (inside agent builder page only), JetBrains Mono, step number + label + completion dot.

### Trigger step detail
- Manual: just a confirm card, no config
- Schedule: frequency dropdown → time/day pickers → **"Next 3 runs" preview** (critical UX)
- Webhook: auto-generated URL + copy button, auth type, generated secret with reveal toggle

### Deploy step detail
Three horizontal cards (DEV / STAGING / LIVE) with Heroku pipeline visual:
- Left-border color: DEV=#6366f1, STAGING=#f59e0b, LIVE=#4ade80
- Promote button only appears when current stage is active
- Promote to LIVE requires confirmation modal

### Navigation from ClientWorkspace
Each agent card in § A gets a `→ build` link that opens `/os/clients/[id]/agents/[agentId]`.
Breadcrumb: `eevolvv / os / {Company} / {Agent Name}`.

---

## Integration List (Chip Palette)
```
HubSpot · Slack · GitHub · Supabase · Notion · Linear · Resend · 
Stripe · Airtable · Google Sheets · Zapier · Twilio · SendGrid · 
Salesforce · Shopify · Custom Webhook
```
Chips in `flex-wrap` row. Selected = accent border + faint accent background.
Lock icon on unauthenticated — selection allowed, auth deferred.

---

## Design Rules (All Apply)
- Background: `var(--ink)` = #141413
- Text: `var(--paper)` = #faf7f0  
- Accent: `var(--accent)` = oklch(0.45 0.13 25) (brick red)
- All labels: JetBrains Mono 11px uppercase 0.2em tracking, var(--accent)
- Body: Space Grotesk
- No Tailwind — inline styles only
- Section left-border: `borderLeft: '3px solid var(--accent)'`
- Reuse: `StatusBadge`, `HealthDot`, `StagePipeline` from HubClient.tsx

---

## Implementation Order

1. DB migrations (3 ALTER TABLE statements)
2. Add `GET /api/os/clients/[id]/agents/[agentId]` route
3. Upgrade tasks in ClientWorkspace (category, agent link, delete, blocked_reason)
4. New agent builder page: `app/os/clients/[id]/agents/[agentId]/`
   - `page.tsx` (server component, fetches agent + client)
   - `AgentBuilder.tsx` (client component, 6-step wizard)
5. Add `→ build` link to agent cards in ClientWorkspace
6. Update OSSidebar if needed (no structural change required)

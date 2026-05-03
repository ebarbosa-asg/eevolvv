# External Research Findings: OS Tasks Area + Agent Builder

## Agent Builder UX Patterns

### The Core 6-Step Wizard (Zapier / n8n / Retool / OpenAI pattern)
1. **Identity** — Name, slug, description of purpose
2. **Instructions** — System prompt / behavioral guidelines (treat as first-class field)
3. **Integrations** — Which external services the agent can touch
4. **Trigger** — Manual / scheduled / webhook / event
5. **Review** — Read-only summary of all config choices + estimated behavior sentence
6. **Deploy** — Environment selection and promotion controls

Left-rail step navigator with: step number, label, completion dot/checkmark. Validate on "Next", not final submit. Allow free backward navigation.

### Instructions Field
Monospace textarea, ~12 rows, character counter. Code-editor styling:
`background: rgba(10,10,10,0.6); border: 1px solid rgba(255,255,255,0.12); font-family: JetBrains Mono`

### Review Step
Render all config as read-only two-column label/value grid. Include a synthesized human-readable sentence: "This agent runs daily at 09:00 UTC and posts summaries to Slack #ops-channel." "Edit step X" back-links next to each section.

## Task Management for Service Work

### Required Fields (Linear + ClickUp + agency PM tools)
- `title`, `status`, `assignee`, `estimated_hours`, `due_date`
- `client_id` — always scope to client
- `agent_id` — nullable FK; links task to agent being built; show as pill badge on row
- `category` — `research | build | qa | review | deploy | comms`
- `priority`, `blocked_reason` (shown only when blocked)

### Status Colors for Dark Terminal
- todo: `rgba(255,255,255,0.2)` border, muted
- in_progress: `#f59e0b` amber
- done: `#4ade80` green
- blocked: `var(--accent)` brick red

### List View Over Kanban
For 10–30 tasks per client: list wins. Row height 44px. Hover: `rgba(255,255,255,0.03)`.
Grid layout: `Status | Title | Category | Agent link | Est hrs | Due date | Actions`

## Trigger Configuration

### Three Trigger Types as 3-Card Picker
Not a dropdown — three visual cards with icon + label + one-line description. Selected gets accent border.
```
[ ▶ Manual — Run on demand ]  [ ⏰ Schedule — Cron-based ]  [ ⚡ Webhook — HTTP endpoint ]
```

### Cron/Schedule Fields
Frequency dropdown → time picker → timezone select. **Critical: Show "Next 3 runs" preview below any cron input.** Eliminates misconfiguration.

### Webhook Fields
Auto-generated URL (read-only + copy), method select, auth type (None / Bearer / HMAC). Auto-generate token/secret with reveal toggle. Show verification snippet for HMAC.

## Deployment Pipeline UI

### Heroku Pipeline Model (canonical)
Horizontal left-to-right: DEV → STAGING → LIVE. Each stage is a card.
- Stage card: environment label, version/hash, last deployed timestamp, status dot, [Test run] + [Promote →] buttons
- Left-border color coding: DEV `#6366f1` indigo, STAGING `#f59e0b` amber, LIVE `#4ade80` green
- LIVE promotion requires confirmation modal: "This replaces the current live version (v0.2)."

### Status Indicators
- not_deployed — dashed border, muted "Not deployed"
- deploying — pulsing CSS animation
- active — solid colored dot, version + relative time
- failed — red dot, error text, Retry button

## Integration Palette

### Recommendation: Inline Chip Multi-Select
Best for 8–30 curated integrations. No modal overhead.

```js
// Unselected chip
{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', cursor: 'pointer', fontSize: 12, ...MONO }
// Selected chip  
{ border: '1px solid var(--accent)', background: 'rgba(140,43,26,0.15)', color: 'var(--paper)' }
```

Container: `display: flex; flex-wrap: wrap; gap: 8px`.
Show small lock icon on integrations not yet authenticated. Do not block wizard step — defer OAuth to a "Configure Integrations" settings page (Zapier pattern: selection and auth are decoupled).

## Sources
Zapier, n8n docs, Retool Agents, LangSmith Agent Builder, OpenAI Agent Builder, Heroku Pipelines, ClickUp Developer Docs, Linear, Monday.com, Workamajig, Harness deployment pipeline patterns.

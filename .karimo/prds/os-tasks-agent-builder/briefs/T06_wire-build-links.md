# Task Brief: T06

**Title:** ClientWorkspace — wire build links on agent cards
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 4
**Dependencies:** T05

---

## Objective

Add two small navigation elements to `ClientWorkspace.tsx`: a `→ build` link on each agent card that opens the agent builder page, and an agent link pill on task rows that links to the same page when a task has `agent_id` set.

---

## Context

**Parent Feature:** eevolvv OS — Tasks Area + Agent Builder

`ClientWorkspace.tsx` is the per-client page at `/os/clients/[id]`. It has already been modified by T04 (Wave 2) to add the extended `Task` type including `agent_id`, and the task rows already render an agent link pill as part of T04's scope.

T05 (Wave 3) created the agent builder route at `/os/clients/[id]/agents/[agentId]`.

This task (Wave 4) wires the final navigation layer: the `→ build` link on agent cards in § A AGENTS. It runs after T04 and T05 are merged.

**Important coordination note:** The agent link pill on task rows (showing agent name as a pill linking to the builder) was specified in T04 and may already be present in the codebase if T04 merged. Before implementing, read `ClientWorkspace.tsx` and check whether the agent pill is already in the task row. If it is, **do not add it again** — only add the `→ build` link on agent cards.

This task is part of **Wave 4** — depends on T04 (extended Task type + agents state in scope) and T05 (the builder route must exist for links to be correct).

---

## Research Context

### Patterns to Follow

- **File location**: `app/os/clients/[id]/ClientWorkspace.tsx` — `'use client'`, already imports `Link` from `'next/link'` at line 3.
- **MONO constant** (line 12): `{ fontFamily: 'JetBrains Mono, monospace' }` — already defined, use it.
- **Agent card action row** (lines 372–375): the existing ✎ and ✕ buttons are in:
  ```tsx
  <div style={{ display: 'flex', gap: '8px' }}>
    <button onClick={() => { setEditingAgent(a.id); setEditAgentForm({}) }} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>✎</button>
    <button onClick={() => deleteAgent(a.id, a.name)} style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
  </div>
  ```
  The `→ build` link is appended inside this same `div`, after the ✕ button.

- **`client.id`** is available as `client.id` (the `client` state variable from `const [client, setClient] = useState(initialClient)` at line 87 — the `ClientFull` type has `id: string`).
- **Task row structure** (lines 401–441): the row is a `div.task-row` rendered inside a `.map(t => ...)` where `t` is of type `Task`. The `agents` array is in scope as `const [agents, setAgents] = useState<Agent[]>(...)` at line 88.
- **No Tailwind** — all inline styles only.
- **`Link` component**: already imported, use directly.

### Known Issues to Address

- If T04 already added the agent pill to task rows, this task must NOT duplicate it. Always read the current file before making changes.

---

## Requirements

### 1. Add `→ build` link to each agent card

In the non-edit-mode agent card view (inside the `else` branch at line 364), find the action row `<div style={{ display: 'flex', gap: '8px' }}>` that contains the ✎ and ✕ buttons (lines 372–375).

Add the `→ build` link as a third element inside that same div, after the ✕ button:

```tsx
<Link
  href={`/os/clients/${client.id}/agents/${a.id}`}
  style={{
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent)',
    textDecoration: 'none',
    opacity: 0.8,
  }}
>
  → build
</Link>
```

The `client.id` comes from the `client` state variable (type `ClientFull`). The `a.id` comes from the agent map iteration variable `a`.

### 2. Add agent link pill to task rows (only if T04 did not already add it)

**Read the file first.** Look for the `agent_id` check inside the task row `.map(t => ...)`. If it's already present, skip this requirement entirely.

If it is NOT present, add the following inside the task-row div (between the category badge and the due date, or after the title if T04's category badge is not present either):

```tsx
{t.agent_id && (() => {
  const agent = agents.find(a => a.id === t.agent_id)
  if (!agent) return null
  return (
    <Link
      href={`/os/clients/${client.id}/agents/${t.agent_id}`}
      onClick={(e) => e.stopPropagation()}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
        borderRadius: '10px',
        padding: '1px 8px',
        textDecoration: 'none',
        opacity: 0.8,
      }}
    >
      {agent.name}
    </Link>
  )
})()}
```

The `e.stopPropagation()` on `onClick` prevents the pill click from also triggering the row's expand handler.

The `client.id` comes from the `client` state variable. `t.agent_id` is the new field on `Task` added by T04.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] File read before any edits (do not edit blind)
- [ ] `→ build` link added to each agent card action row (inside the existing flex div with ✎ and ✕)
- [ ] `→ build` link uses `Link` component (not `<a>`)
- [ ] `→ build` link href is `/os/clients/${client.id}/agents/${a.id}` — both IDs are dynamic
- [ ] `→ build` link style: JetBrains Mono 11px, `color: 'var(--accent)'`, `textDecoration: 'none'`, `opacity: 0.8`
- [ ] Agent link pill on task rows: either already present from T04 (acceptable) or added by this task
- [ ] Agent pill uses `Link` component pointing to `/os/clients/${client.id}/agents/${t.agent_id}`
- [ ] Agent pill's onClick calls `e.stopPropagation()`
- [ ] No duplicate agent pills (do not add if T04 already added it)
- [ ] No new imports added (Link is already imported)
- [ ] No Tailwind classes added
- [ ] `npx tsc --noEmit` passes with zero errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/os/clients/[id]/ClientWorkspace.tsx` | modify | Add `→ build` link to agent cards; conditionally add agent pill to task rows |

### File Ownership Notes

T04 also modified this file (Wave 2). This task (T06, Wave 4) runs after T04 is merged, so the file already has:
- Extended `Task` type with `agent_id`, `category`, etc.
- `TASK_CATEGORIES` constant
- Updated add-task and edit-task forms
- Category badges and possibly agent pills on task rows

Do not remove or alter any of T04's additions.

---

## Implementation Guidance

### Exact location for `→ build` link

The agent card non-edit view (line ~364) renders:
```tsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    {/* agent name, type badge, StatusBadge, HealthDot */}
  </div>
  <div style={{ display: 'flex', gap: '8px' }}>
    <button ...>✎</button>  {/* edit button */}
    <button ...>✕</button>  {/* delete button */}
    {/* ADD → build LINK HERE */}
  </div>
</div>
```

The `→ build` link goes inside the second `div` (the one with `display: 'flex', gap: '8px'`), after the ✕ button.

### Exact location for agent pill on task rows

If adding (i.e., T04 did not add it), the task row div looks like:
```tsx
<div className="task-row" onClick={...}>
  <PriorityDot priority={t.priority} />
  <span style={{ flex: 1, ... }}>{t.title}</span>
  {/* T04 may have added: category badge here */}
  {/* ADD AGENT PILL HERE (if not already present) */}
  {t.due_date && <span ...>{t.due_date}</span>}
  <button ...>{t.status}</button>  {/* status cycle button */}
  {/* T04 may have added: ✕ delete button here */}
</div>
```

### Code Style

- Use `Link` (already imported at line 3 from `'next/link'`) — never use a plain `<a>` tag for internal routes
- Match the exact style object format used in the file: `style={{ fontFamily: 'JetBrains Mono, monospace', ... }}` — do not use `style={{ ...MONO, ... }}` pattern for the Link since MONO is typed as `as const` and spreading it into a Link style prop is fine, but matching the exact specified style objects is preferred
- Keep changes minimal — this task has two small additions; do not refactor anything

### Edge Cases

- Agent card: `a` is the loop variable from `agents.map(a => ...)` — both `a.id` and `client.id` are always strings, no null checks needed.
- Task pill: `t.agent_id` may be set but the agent deleted (not in `agents` array). The `agents.find()` returning `undefined` is handled by `if (!agent) return null` — this is a correct defensive pattern.
- The `client` variable is `const [client, setClient] = useState(initialClient)` — access it as `client.id`, not `initialClient.id`.

### Testing Requirements

No automated tests. Manual verification:
1. `npx tsc --noEmit` — zero errors
2. Navigate to a client page with at least one agent
3. Confirm `→ build` link appears on each agent card, next to ✎ and ✕
4. Click `→ build` — navigates to `/os/clients/{id}/agents/{agentId}`
5. On a task with `agent_id` set, confirm the agent name pill appears in the task row
6. Click the agent pill — navigates to the builder page
7. Clicking the agent pill does not expand the task edit form (stopPropagation works)

---

## Boundaries

### Files You MUST NOT Touch

- `app/globals.css`
- `app/os/HubClient.tsx`
- `app/os/clients/[id]/agents/[agentId]/page.tsx` (created by T05)
- `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` (created by T05)
- Any API route files

### Files Requiring Review

None — `ClientWorkspace.tsx` is fully owned by the OS feature team.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T04 | Extended `Task` type with `agent_id` field; `agents` state in scope; possibly the agent pill on task rows already | Read the current `ClientWorkspace.tsx` and check for `t.agent_id` in task row render |
| T05 | Agent builder page at `/os/clients/[id]/agents/[agentId]` | Check that `app/os/clients/[id]/agents/[agentId]/page.tsx` exists |

**Before starting:** Pull the latest branch that includes T04's merged changes. Read `ClientWorkspace.tsx` fully before editing.

### Downstream Impact

Tasks that depend on this one: None — T06 is the last task in this PRD.

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T06`
**Target:** Feature branch or main, determined by PM Agent

---

## Commit Guidelines

```
feat(os): wire agent builder links on agent cards and task rows

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] No Tailwind classes added
- [ ] No T04 or T05 work accidentally removed
- [ ] No duplicate agent pills on task rows
- [ ] Dev server renders client page without runtime errors
- [ ] Branch rebased on target branch (which includes T04 + T05)

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T06 | Wave: 4*

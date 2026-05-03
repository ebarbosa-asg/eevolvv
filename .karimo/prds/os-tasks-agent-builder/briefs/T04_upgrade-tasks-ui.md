# Task Brief: T04

**Title:** UI — Upgrade service tasks section in ClientWorkspace
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 1

---

## Objective

Upgrade the § B SERVICE TASKS section inside `ClientWorkspace.tsx` to support new task fields (`agent_id`, `category`, `estimated_hrs`, `blocked_reason`, `assignee`), move the add-task button to the top, add per-task delete, and render category badges and agent link pills on each task row.

---

## Context

**Parent Feature:** eevolvv OS — Tasks Area + Agent Builder

`ClientWorkspace.tsx` is the primary per-client page at `/os/clients/[id]`. It lives at `app/os/clients/[id]/ClientWorkspace.tsx` and is a `'use client'` component. It contains two main sections in the left column: § A AGENTS and § B SERVICE TASKS.

The tasks section currently shows a basic list with title, due date, status pill, and an add form at the bottom. This task upgrades it in-place — the layout (embedded in ClientWorkspace left column, list view with grouped status headers) stays the same. All changes are scoped to this one file.

The database has already been migrated (or will be before this task runs) to add the new columns:
```sql
ALTER TABLE service_tasks ADD COLUMN agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE service_tasks ADD COLUMN category TEXT DEFAULT 'general';
ALTER TABLE service_tasks ADD COLUMN assignee TEXT;
ALTER TABLE service_tasks ADD COLUMN estimated_hrs NUMERIC(5,1);
ALTER TABLE service_tasks ADD COLUMN blocked_reason TEXT;
```

The `agents` array is already in ClientWorkspace state as `const [agents, setAgents] = useState<Agent[]>(...)`.

This task is part of **Wave 1** — it can be executed without depending on other tasks. T05 (agent builder page) and T06 (wire build links) come after.

---

## Research Context

### Patterns to Follow

- **Inline styles only** — zero Tailwind. Every style is an inline `style={{}}` prop or a CSS class defined in the `WORKSPACE_CSS` template literal at line 57.
- **CARD constant** (line 11): `{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '2px' }` — use for all form containers.
- **INPUT constant** (line 14): `{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', color: 'var(--paper)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '7px 10px', outline: 'none', width: '100%' }` — use for all inputs and selects.
- **MONO constant** (line 12): `{ fontFamily: 'JetBrains Mono, monospace' }` — use for any monospace text.
- **MONO_LABEL constant** (line 13): full label style including `fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.4, marginBottom: '6px'` — use for all form field labels.
- **Section label** — `SectionLabel` component at line 73: `§ {n} · {label}` in JetBrains Mono 11px uppercase 0.2em tracking, `color: 'var(--accent)'`.
- **Task row pattern** (lines 402–442): click row to expand inline edit form, status badge is a clickable pill.
- **Agent section pattern** for delete: `deleteAgent` (line 158) — confirm then call DELETE, then filter from state.
- **Slide-form reveal**: The existing pattern uses conditional rendering (`{showAddTask ? <form> : <button>}`). Keep this pattern.
- **Grid layout for forms**: `display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'` with `gridColumn: '1 / -1'` for full-width rows.
- **Section header with top button**: Look at the § A AGENTS header (lines 296–298): `display: flex; alignItems: center; justifyContent: space-between` — replicate this exact pattern for § B header.
- **taskBadgeColor** helper (line 234): already maps status to colors — reuse it.
- **Status colors**: todo: `rgba(250,247,240,0.35)`, in_progress: `#f59e0b`, done: `#4ade80`, blocked: `var(--accent)`.
- **Category badge**: small mono text, skip rendering if value is `'general'` or `null`.
- **Agent link pill**: small pill using `var(--accent)` border + text, `border-radius: '10px'`, `padding: '1px 8px'`.

### Known Issues to Address

- The current `+ add task` button (line 485) is rendered at the bottom of the section after all task groups. It must move to the top (into the section header row, same pattern as `+ add agent`).
- The `taskForm` state (line 166) only tracks `title`, `priority`, `due_date`. It needs new fields: `category`, `agent_id`, `estimated_hrs`.
- The `editTaskForm` state type is `Partial<Task>` (line 168). After the `Task` type is extended, the edit form must also include `blocked_reason`, `agent_id`, `category`, `estimated_hrs` — and `blocked_reason` textarea must only render when `editTaskForm.status === 'blocked'`.
- `submitTask` (line 170): must include new fields in the POST body.
- `saveTaskEdit` (line 196): already does raw `JSON.stringify(editTaskForm)` PATCH — no change needed there as long as the new fields are in state.

---

## Requirements

### 1. Extend Task type

At line 32–37, update the `Task` type:

```typescript
type Task = {
  id: string; client_id: string; title: string; description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  due_date: string | null; priority: 'high' | 'normal' | 'low'
  created_at: string; updated_at: string
  // New fields:
  agent_id: string | null
  category: 'research' | 'build' | 'qa' | 'review' | 'deploy' | 'comms' | 'general' | null
  assignee: string | null
  estimated_hrs: number | null
  blocked_reason: string | null
}
```

### 2. Add TASK_CATEGORIES constant

Add near the top-level constants (alongside `AGENT_TYPES`):
```typescript
const TASK_CATEGORIES = ['research', 'build', 'qa', 'review', 'deploy', 'comms', 'general'] as const
```

### 3. Move add-task button + form to the top

The § B SERVICE TASKS section currently has `<SectionLabel n="B" label="SERVICE TASKS" />` as a standalone line (line 392), then task groups below, then the add form at the bottom.

Change it to match the § A AGENTS pattern:
```tsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
  <SectionLabel n="B" label="SERVICE TASKS" />
  <button className="ws-btn" onClick={() => setShowAddTask(v => !v)}
    style={{ color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', padding: '3px 8px' }}>
    + add task
  </button>
</div>
```

Then render the add form immediately below this header (before the task groups), when `showAddTask` is true. Remove the old button at the bottom of the section (line 485).

### 4. Extend add-task form state and form fields

Update `taskForm` state initialization:
```typescript
const [taskForm, setTaskForm] = useState({
  title: '', priority: 'normal', due_date: '',
  category: 'general', agent_id: '', estimated_hrs: ''
})
```

Add three new form fields to the add-task grid form:

**Category select** (new):
```tsx
<div>
  <div style={MONO_LABEL}>Category</div>
  <select value={taskForm.category} onChange={e => setTaskForm(f => ({ ...f, category: e.target.value }))}
    style={{ ...INPUT, cursor: 'pointer' }}>
    {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
</div>
```

**Agent select** (new):
```tsx
<div>
  <div style={MONO_LABEL}>Agent</div>
  <select value={taskForm.agent_id} onChange={e => setTaskForm(f => ({ ...f, agent_id: e.target.value }))}
    style={{ ...INPUT, cursor: 'pointer' }}>
    <option value="">— no agent —</option>
    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
  </select>
</div>
```

**Estimated hours input** (new):
```tsx
<div>
  <div style={MONO_LABEL}>Est hrs</div>
  <input type="number" min="0" step="0.5" value={taskForm.estimated_hrs}
    onChange={e => setTaskForm(f => ({ ...f, estimated_hrs: e.target.value }))}
    placeholder="0" style={INPUT} />
</div>
```

### 5. Update submitTask to include new fields

```typescript
const submitTask = async () => {
  if (!taskForm.title) return
  const res = await fetch(`/api/os/clients/${client.id}/tasks`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskForm.title,
      priority: taskForm.priority,
      due_date: taskForm.due_date || null,
      category: taskForm.category || 'general',
      agent_id: taskForm.agent_id || null,
      estimated_hrs: taskForm.estimated_hrs ? parseFloat(taskForm.estimated_hrs) : null,
    }),
  })
  if (res.ok) {
    const newTask = await res.json() as Task
    setTasks(prev => [newTask, ...prev])
    setShowAddTask(false)
    setTaskForm({ title: '', priority: 'normal', due_date: '', category: 'general', agent_id: '', estimated_hrs: '' })
  }
}
```

### 6. Add blocked_reason to edit form

In the expanded edit form (inside `expandedTask === t.id` block), add this field — rendered conditionally only when status is blocked:

```tsx
{editTaskForm.status === 'blocked' && (
  <div style={{ gridColumn: '1 / -1' }}>
    <div style={MONO_LABEL}>Blocked reason</div>
    <textarea
      value={editTaskForm.blocked_reason ?? ''}
      onChange={e => setEditTaskForm(f => ({ ...f, blocked_reason: e.target.value }))}
      placeholder="Why is this blocked?"
      style={{ ...INPUT, resize: 'vertical', minHeight: '60px' }}
    />
  </div>
)}
```

Also add `agent_id` and `category` fields to the edit form:

```tsx
<div>
  <div style={MONO_LABEL}>Category</div>
  <select value={editTaskForm.category ?? 'general'}
    onChange={e => setEditTaskForm(f => ({ ...f, category: e.target.value as Task['category'] }))}
    style={{ ...INPUT, cursor: 'pointer' }}>
    {TASK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
</div>
<div>
  <div style={MONO_LABEL}>Agent</div>
  <select value={editTaskForm.agent_id ?? ''}
    onChange={e => setEditTaskForm(f => ({ ...f, agent_id: e.target.value || null }))}
    style={{ ...INPUT, cursor: 'pointer' }}>
    <option value="">— no agent —</option>
    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
  </select>
</div>
```

Make sure `setEditTaskForm` for the expand click also seeds the new fields:
```typescript
setEditTaskForm({
  title: t.title, description: t.description, due_date: t.due_date, priority: t.priority,
  status: t.status,
  agent_id: t.agent_id, category: t.category, estimated_hrs: t.estimated_hrs,
  blocked_reason: t.blocked_reason,
})
```

### 7. Add delete button to each task row

In the task-row for non-done tasks, add a ✕ button at the end of the row (after the status pill button). The button must call `e.stopPropagation()` to prevent row expansion, confirm via `window.confirm()`, call DELETE, then remove from state.

```tsx
<button
  onClick={async e => {
    e.stopPropagation()
    if (!window.confirm(`Delete "${t.title}"?`)) return
    const res = await fetch(`/api/os/clients/${client.id}/tasks/${t.id}`, { method: 'DELETE' })
    if (res.ok) setTasks(prev => prev.filter(task => task.id !== t.id))
  }}
  style={{ ...MONO, fontSize: '11px', color: 'rgba(250,247,240,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
  title="Delete task"
>✕</button>
```

### 8. Show category badge on task rows

In the task row, after the title span and before the due date, add a category badge. Skip rendering when `t.category === 'general'` or `t.category === null`:

```tsx
{t.category && t.category !== 'general' && (
  <span style={{ ...MONO, fontSize: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', padding: '1px 5px', opacity: 0.7 }}>
    {t.category}
  </span>
)}
```

### 9. Show agent link pill on task rows

After the category badge, when `t.agent_id` is set, find the agent and show a Link pill. Note: `Link` is already imported from `'next/link'` (line 3).

```tsx
{t.agent_id && (() => {
  const agent = agents.find(a => a.id === t.agent_id)
  if (!agent) return null
  return (
    <Link
      href={`/os/clients/${client.id}/agents/${t.agent_id}`}
      onClick={e => e.stopPropagation()}
      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '1px 8px', textDecoration: 'none', opacity: 0.8 }}
    >
      {agent.name}
    </Link>
  )
})()}
```

The `e.stopPropagation()` is needed so clicking the pill doesn't also expand the task edit form.

The route `/os/clients/{clientId}/agents/{agentId}` is created by T05 — using `Link` here is correct even though the page doesn't exist yet. TypeScript won't complain about the href.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `Task` type includes `agent_id`, `category`, `assignee`, `estimated_hrs`, `blocked_reason`
- [ ] `TASK_CATEGORIES` constant defined at module level
- [ ] § B SERVICE TASKS section header has `+ add task` button aligned right (matches § A AGENTS header pattern)
- [ ] Old `+ add task` button at bottom of section removed
- [ ] Add-task form appears at top of section (below header, above task groups) when `showAddTask` is true
- [ ] Add-task form includes `category` select with all 7 options
- [ ] Add-task form includes `agent_id` select populated from `agents` state, first option is "— no agent —"
- [ ] Add-task form includes `estimated_hrs` number input (step 0.5)
- [ ] `submitTask` sends `category`, `agent_id`, `estimated_hrs` in POST body
- [ ] Edit form seeds `agent_id`, `category`, `estimated_hrs`, `blocked_reason` from the task being edited
- [ ] Edit form includes `category` select
- [ ] Edit form includes `agent_id` select populated from `agents`
- [ ] `blocked_reason` textarea appears in edit form only when `editTaskForm.status === 'blocked'`
- [ ] Each non-done task row has a ✕ delete button
- [ ] Delete button calls `window.confirm()`, then DELETE `/api/os/clients/[id]/tasks/[taskId]`, then removes from state
- [ ] Delete button calls `e.stopPropagation()` to prevent row expansion
- [ ] Category badge renders on task rows (mono chip style, skipped when `'general'` or `null`)
- [ ] Agent link pill renders on task rows when `agent_id` is set
- [ ] Agent link pill uses `Link` component pointing to `/os/clients/${client.id}/agents/${t.agent_id}`
- [ ] Agent link pill's `onClick` calls `e.stopPropagation()`
- [ ] No Tailwind classes added anywhere
- [ ] `npx tsc --noEmit` passes with zero errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/os/clients/[id]/ClientWorkspace.tsx` | modify | All changes — type extension, form upgrades, row additions |

### File Ownership Notes

This is the only file changed. T06 also modifies `ClientWorkspace.tsx` — T06 adds the `→ build` link to the § A AGENTS section and the agent pill to task rows. T04 and T06 touch different sections of the file:
- T04: § B SERVICE TASKS only (plus the `Task` type and task-related state)
- T06: § A AGENTS (build link) + task rows (agent pill)

If executed sequentially, T06 must rebase on T04's output. The agent link pill specified in T04 (requirement 9) is identical to what T06 would add — whichever task runs second should not duplicate it. Coordinate: if T04 is merged first, T06 should skip adding the agent pill on task rows (T04 already did it).

---

## Implementation Guidance

### Patterns to Follow

The file already imports `Link` from `'next/link'` — use it for the agent link pill without adding another import.

State pattern for forms: all form fields are plain strings in state, cast to proper types only in the submit handler (`parseFloat`, `|| null` for empty strings). This matches the existing `agentForm` pattern.

The `cycleTaskStatus` function (line 184) does not include `blocked` in its cycle. Do not change it — if a user wants to set blocked, they use the edit form. The cycle order stays: `todo → in_progress → done → todo`.

For the edit form, the expand click handler is inside the `.map(t => ...)` at line 402. When adding new fields to the `setEditTaskForm` call, make sure to keep all existing fields plus the new ones.

### Code Style

- All constants (`CARD`, `INPUT`, `MONO`, `MONO_LABEL`) are already defined — do not redefine them inline
- `as const` is used on arrays: `TASK_STATUSES`, `STAGES` — follow the same pattern for `TASK_CATEGORIES`
- Button styles follow the pattern: `{ ...MONO, fontSize: '11px', ... }` — do not use className for new buttons except `className="ws-btn"` when appropriate
- All labels use `style={MONO_LABEL}` — do not deviate

### Edge Cases

- If `agents` is empty, the agent select in both add and edit forms should only show "— no agent —" with no agent options — this is fine and expected.
- `parseFloat('')` returns `NaN` — guard with `taskForm.estimated_hrs ? parseFloat(taskForm.estimated_hrs) : null`.
- `t.agent_id` may be set but the agent deleted — the `agents.find()` may return `undefined`. The IIFE guard `if (!agent) return null` handles this.
- The `blocked_reason` field in the edit form depends on `editTaskForm.status`. The `status` field is already in `editTaskForm` — this just reads it for a conditional render.

### Testing Requirements

No test files exist for this component. Manual verification is sufficient. After changes:
1. Run `npx tsc --noEmit` — must show zero errors
2. Start dev server, navigate to a client page, verify § B header has `+ add task` button aligned right
3. Open add form, verify all new fields present
4. Expand a task in edit mode, change status to `blocked`, verify `blocked_reason` textarea appears
5. Verify delete button prompts confirm, then removes the task from the list

---

## Boundaries

### Files You MUST NOT Touch

- `app/globals.css`
- `app/os/HubClient.tsx` (shared exports — do not modify)
- Any API route files
- Any file outside `app/os/clients/[id]/ClientWorkspace.tsx`

### Files Requiring Review

None for this task — ClientWorkspace.tsx is fully owned by the OS feature team.

---

## Dependencies

### Upstream Tasks

None — T04 can start immediately. The DB columns may not exist yet in the live DB; the TypeScript types will still be valid regardless, and the UI can be built without DB migrations being live.

### Downstream Impact

Tasks that depend on this one:
- **T06** — adds the `→ build` link to agent cards and the agent pill to task rows. T06 should NOT re-add the agent pill if T04 is merged first.

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T04`
**Target:** Feature branch or main, determined by PM Agent

---

## Commit Guidelines

```
feat(os): upgrade service tasks UI with category, agent link, and delete

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] No Tailwind classes added
- [ ] No `globals.css` or `HubClient.tsx` modified
- [ ] Dev server renders the page without runtime errors
- [ ] Branch rebased on target branch

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T04 | Wave: 1*

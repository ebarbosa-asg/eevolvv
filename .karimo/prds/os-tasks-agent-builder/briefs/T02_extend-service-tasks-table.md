# Task Brief: T02

**Title:** DB — Extend service_tasks table with delivery fields
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1

---

## Objective

Add 5 new columns to the `service_tasks` table in Supabase (project `qmdygiumftesoqzqmsqe`) to support the upgraded task board in the OS client workspace. These columns enable task categorization, agent linking, assignee tracking, time estimation, and blocked-state documentation.

---

## Context

**Parent Feature:** OS Tasks Area + Agent Builder (os-tasks-agent-builder)

The client workspace at `/os/clients/[id]` has a task board (section B in the left column). Currently, tasks store only title, description, status, due date, and priority. The upgrade requires:

- **`agent_id`** — a foreign key linking a task to the agent being built for it. Enables the "agent link pill" in the task row UI.
- **`category`** — classifies the task type (`research`, `build`, `qa`, `review`, `deploy`, `comms`). Used for the category badge in the task row.
- **`assignee`** — free-text name of who owns the task.
- **`estimated_hrs`** — numeric time estimate shown in the task row.
- **`blocked_reason`** — populated when `status = 'blocked'`; a textarea appears in the UI to capture why.

This task is part of **Wave 1** — foundational DB migrations that must complete before any UI work begins on the task board upgrade.

---

## Requirements

Apply the following migration to Supabase project `qmdygiumftesoqzqmsqe` using the Supabase MCP tool (`apply_migration`). All columns use `IF NOT EXISTS` so the migration is idempotent.

```sql
ALTER TABLE service_tasks ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE service_tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE service_tasks ADD COLUMN IF NOT EXISTS assignee TEXT;
ALTER TABLE service_tasks ADD COLUMN IF NOT EXISTS estimated_hrs NUMERIC(5,1);
ALTER TABLE service_tasks ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
```

### Column Semantics

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `agent_id` | UUID | NULL | FK → `agents(id)`, nullified on agent deletion. Links a task to an agent being built. |
| `category` | TEXT | `'general'` | Task type. UI values: `'research'`, `'build'`, `'qa'`, `'review'`, `'deploy'`, `'comms'`, `'general'` |
| `assignee` | TEXT | NULL | Free-text name of the person responsible |
| `estimated_hrs` | NUMERIC(5,1) | NULL | Time estimate, e.g. `2.5` for 2.5 hours |
| `blocked_reason` | TEXT | NULL | Required when `status = 'blocked'`; explains the blocker |

### Foreign Key Behavior

`agent_id` references `agents(id) ON DELETE SET NULL`. If the referenced agent is deleted, this column is set to NULL rather than cascade-deleting the task. This is safe — tasks should survive agent deletion.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Migration applied using `apply_migration` with name `extend_service_tasks_delivery_fields`
- [ ] All 5 columns exist on the `service_tasks` table
- [ ] `agent_id` is a nullable UUID with foreign key to `agents(id) ON DELETE SET NULL`
- [ ] `category` has default value `'general'`
- [ ] `assignee`, `estimated_hrs`, `blocked_reason` are nullable with no default
- [ ] `estimated_hrs` is of type `NUMERIC(5,1)` (not integer, not float)
- [ ] Verified by calling `list_tables` with `verbose: true` and confirming column presence

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| Supabase DB (project `qmdygiumftesoqzqmsqe`) | migrate | Apply 5 ALTER TABLE statements via MCP `apply_migration` |

No filesystem files are created or modified by this task.

### File Ownership Notes

This task touches only the database schema. No code files are modified. The task board upgrade UI (future wave) depends on these columns existing.

---

## Implementation Guidance

### Tool to Use

Use the Supabase MCP tool:

1. `apply_migration` — runs the SQL against the live Supabase project
2. `list_tables` with `verbose: true` — verifies the columns exist post-migration

### Exact Call

```
apply_migration(
  project_id: "qmdygiumftesoqzqmsqe",
  name: "extend_service_tasks_delivery_fields",
  query: "<5 ALTER TABLE statements above>"
)
```

### Verification Call

```
list_tables(
  project_id: "qmdygiumftesoqzqmsqe",
  verbose: true
)
```

Confirm the `service_tasks` table entry shows all 5 new columns, with the FK constraint visible on `agent_id`.

### Edge Cases

- The `agents` table must already exist (it does — it's a pre-existing table). The FK constraint on `agent_id` depends on it.
- T01 (agents table migration) does not need to complete first — these new columns do not reference the T01 columns, only the `agents.id` PK which already exists.
- All statements use `IF NOT EXISTS` — safe to re-run
- Existing rows will have `category = 'general'`; all other new columns will be NULL

---

## Boundaries

### Files You MUST NOT Touch

- Any `.tsx` / `.ts` source files — this is a pure DB task
- `supabase/migrations/` folder — changes go through MCP `apply_migration`
- `app/` directory — no application code changes in this task

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

None — this is a Wave 1 task. Can run in parallel with T01.

**Before starting:** No verification needed. Begin immediately.

### Downstream Impact

Tasks that depend on this one:
- Task board upgrade UI — reads/writes `category`, `agent_id`, `assignee`, `estimated_hrs`, `blocked_reason`
- Any future API routes that expose `service_tasks` with full field set

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T02`
**Target:** main (or feature branch as determined by PM Agent)

---

## Commit Guidelines

Not applicable — this task applies a DB migration via MCP tool. If a migration file is generated locally:

```
chore(db): extend service_tasks table with delivery fields

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] Migration applied without SQL errors
- [ ] `list_tables verbose: true` confirms all 5 columns on `service_tasks`
- [ ] FK constraint on `agent_id` confirmed (ON DELETE SET NULL)
- [ ] `category` default `'general'` confirmed
- [ ] `estimated_hrs` type is NUMERIC(5,1)

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T02 | Wave: 1*

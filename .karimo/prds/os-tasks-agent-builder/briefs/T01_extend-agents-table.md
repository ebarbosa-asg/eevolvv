# Task Brief: T01

**Title:** DB — Extend agents table with builder fields
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 2/10
**Model:** sonnet
**Wave:** 1

---

## Objective

Add 8 new columns to the `agents` table in Supabase (project `qmdygiumftesoqzqmsqe`) to support the agent builder wizard. These columns capture trigger configuration, AI instructions, deployment metadata, and usage counters. This is a prerequisite for all agent builder UI tasks.

---

## Context

**Parent Feature:** OS Tasks Area + Agent Builder (os-tasks-agent-builder)

The eevolvv internal OS (`/os`) is being upgraded with two features: a task board tied to automation work, and a 6-step agent builder wizard at `/os/clients/[id]/agents/[agentId]`. The `agents` table currently stores identity and deploy-status fields only. The builder wizard requires additional fields for:

- How the agent is triggered (manual, schedule, webhook) and its associated config
- The AI system prompt (`instructions`)
- A plain-language output description (`estimated_output`)
- Integration-specific settings (`config`)
- Versioning and usage tracking (`version`, `run_count`, `error_count`)

This task is part of **Wave 1** — foundational DB migrations that must complete before any API or UI work begins.

---

## Requirements

Apply the following migration to Supabase project `qmdygiumftesoqzqmsqe` using the Supabase MCP tool (`apply_migration`). All columns use `IF NOT EXISTS` so the migration is idempotent and safe to re-run.

```sql
ALTER TABLE agents ADD COLUMN IF NOT EXISTS trigger_type TEXT DEFAULT 'manual';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS trigger_config JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS estimated_output TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS config JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS run_count INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0;
```

### Column Semantics

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `trigger_type` | TEXT | `'manual'` | One of: `'manual'`, `'schedule'`, `'webhook'` |
| `trigger_config` | JSONB | NULL | Schedule: `{"cron":"0 9 * * 1"}` · Webhook: `{"url":"...","secret":"..."}` |
| `instructions` | TEXT | NULL | AI system prompt — the agent's behavioral instructions |
| `estimated_output` | TEXT | NULL | Plain-language description of what the agent produces |
| `config` | JSONB | NULL | Integration-specific settings (arbitrary key/value pairs) |
| `version` | INTEGER | `1` | Incremented on each deploy to LIVE |
| `run_count` | INTEGER | `0` | Total successful executions |
| `error_count` | INTEGER | `0` | Total failed executions |

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] Migration applied using `apply_migration` with name `extend_agents_builder_fields`
- [ ] All 8 columns exist on the `agents` table
- [ ] `trigger_type` has default value `'manual'`
- [ ] `version` has default value `1`
- [ ] `run_count` has default value `0`
- [ ] `error_count` has default value `0`
- [ ] `trigger_config`, `instructions`, `estimated_output`, `config` are nullable (no default)
- [ ] Verified by calling `list_tables` with `verbose: true` and confirming column presence

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| Supabase DB (project `qmdygiumftesoqzqmsqe`) | migrate | Apply 8 ALTER TABLE statements via MCP `apply_migration` |

No filesystem files are created or modified by this task. The migration is applied directly via the Supabase MCP tool.

### File Ownership Notes

This task touches only the database schema. No code files are modified. Downstream tasks T02, T03, and all UI tasks depend on these columns existing.

---

## Implementation Guidance

### Tool to Use

Use the Supabase MCP tool. The two relevant calls are:

1. `apply_migration` — runs the SQL against the live Supabase project
2. `list_tables` with `verbose: true` — verifies the columns exist post-migration

### Exact Call

```
apply_migration(
  project_id: "qmdygiumftesoqzqmsqe",
  name: "extend_agents_builder_fields",
  query: "<8 ALTER TABLE statements above>"
)
```

### Verification Call

```
list_tables(
  project_id: "qmdygiumftesoqzqmsqe",
  verbose: true
)
```

Confirm the `agents` table entry shows all 8 new columns.

### Edge Cases

- All statements use `IF NOT EXISTS` — safe to re-run if the migration was partially applied
- No data migration is needed; all new columns are nullable or have safe defaults
- Existing rows will have `trigger_type = 'manual'`, `version = 1`, counters = `0`

---

## Boundaries

### Files You MUST NOT Touch

- Any `.tsx` / `.ts` source files — this is a pure DB task
- `supabase/migrations/` folder — changes go through MCP `apply_migration`, not local files
- `app/` directory — no application code changes in this task

### Files Requiring Review

None for this task.

---

## Dependencies

### Upstream Tasks

None — this is a Wave 1 task with no prerequisites.

**Before starting:** No verification needed. Begin immediately.

### Downstream Impact

Tasks that depend on this one:
- **T03** — GET agent route returns the new fields; TypeScript `Agent` type must include them
- All agent builder UI tasks — wizard steps read and write these columns

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T01`
**Target:** main (or feature branch as determined by PM Agent)

---

## Commit Guidelines

Not applicable — this task applies a DB migration via MCP tool, not a code commit. If a migration file is generated locally, commit it as:

```
chore(db): extend agents table with builder fields

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before marking complete:
- [ ] Migration applied without SQL errors
- [ ] `list_tables verbose: true` confirms all 8 columns on `agents`
- [ ] Defaults verified: `trigger_type='manual'`, `version=1`, `run_count=0`, `error_count=0`

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T01 | Wave: 1*

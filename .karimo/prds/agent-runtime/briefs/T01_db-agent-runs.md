# Brief: T01 — DB: Create agent_runs table + share_token column

**Task ID:** T01  
**Wave:** 1  
**Complexity:** 2  
**Model:** sonnet  
**Dependencies:** none  

---

## Context

This project is a Next.js 14 App Router application. Database is Supabase (Postgres). Migrations live in `supabase/migrations/`. The Supabase MCP tool is available to apply migrations directly.

The `agents` table already exists with columns including: `id`, `client_id`, `name`, `type`, `description`, `status`, `instructions`, `trigger_type`, `trigger_config`, `config`, `version`, `run_count`, `error_count`, `created_at`, `updated_at`. The `clients` table exists with `id` as primary key.

---

## What To Build

Apply two SQL migrations via the Supabase MCP tool (`mcp__claude_ai_Supabase__apply_migration`).

### Migration 1: Create agent_runs table

```sql
create table if not exists agent_runs (
  id             uuid primary key default gen_random_uuid(),
  agent_id       uuid not null references agents(id) on delete cascade,
  client_id      uuid not null references clients(id) on delete cascade,
  status         text not null default 'pending',
  triggered_by   text not null default 'manual',
  input_context  jsonb,
  output         text,
  output_summary text,
  input_tokens   integer,
  output_tokens  integer,
  latency_ms     integer,
  created_at     timestamptz not null default now()
);

create index if not exists agent_runs_agent_id_idx on agent_runs(agent_id);
create index if not exists agent_runs_client_id_idx on agent_runs(client_id);
create index if not exists agent_runs_created_at_idx on agent_runs(created_at desc);
```

Constraint values for `status`: 'pending', 'running', 'success', 'error'  
Constraint values for `triggered_by`: 'manual', 'schedule', 'share_page'

### Migration 2: Add share_token and last_run_at to agents table

```sql
alter table agents
  add column if not exists share_token uuid not null default gen_random_uuid(),
  add column if not exists last_run_at timestamptz;

create unique index if not exists agents_share_token_idx on agents(share_token);
```

---

## Acceptance Criteria

- `agent_runs` table exists with all specified columns
- `agents.share_token` column exists, is non-null uuid, has unique index
- `agents.last_run_at` column exists as nullable timestamptz
- Indexes created for query performance
- No existing data broken

---

## Notes

- Use the Supabase project ID from env: `SUPABASE_URL` contains `qmdygiumftesoqzqmsqe` — project ref is `qmdygiumftesoqzqmsqe`
- Apply via `mcp__claude_ai_Supabase__apply_migration` tool, one migration at a time
- Also create local migration files in `supabase/migrations/` for version control

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

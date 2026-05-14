-- WS3: client_memories — persists Bridge memory_semantic triples per eevolvv client.
-- source: 'bridge' (synced from Bridge local SQLite) | 'local' (written directly by eevolvv)
-- unique constraint on (client_id, subject, predicate) ensures idempotent upserts.

create table if not exists client_memories (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  subject text not null,
  predicate text not null,
  object text not null,
  agent_id text,
  app_id text,
  source text not null default 'bridge', -- 'bridge' | 'local'
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(client_id, subject, predicate)
);

create index if not exists client_memories_client_id_idx on client_memories(client_id);
create index if not exists client_memories_synced_at_idx on client_memories(synced_at);

-- RLS: enable; service role bypasses, anon/user access requires explicit policies
alter table client_memories enable row level security;

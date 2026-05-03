alter table agents
  add column if not exists share_token uuid not null default gen_random_uuid(),
  add column if not exists last_run_at timestamptz;

create unique index if not exists agents_share_token_idx on agents(share_token);

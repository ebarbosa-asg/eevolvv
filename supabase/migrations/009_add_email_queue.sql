-- Email queue for auto-triggered follow-up emails (FollowUp1/2/3)
create table if not exists email_queue (
  id          uuid primary key default gen_random_uuid(),
  submission_id text,
  email       text not null,
  template    text not null check (template in ('followup1', 'followup2', 'followup3')),
  name        text,
  business_name text,
  send_after  timestamptz not null,
  status      text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at     timestamptz,
  error       text,
  created_at  timestamptz not null default now()
);

create index if not exists email_queue_pending_idx
  on email_queue (status, send_after)
  where status = 'pending';

# Internal Research: Dependencies

## Already Available (package.json)

| Package | Version | Relevance |
|---------|---------|-----------|
| `@anthropic-ai/sdk` | ^0.91.1 | Core AI execution — streaming and non-streaming both supported |
| `@supabase/supabase-js` | ^2.105.1 | DB for agent config + run logging |
| `next` | 14.2.5 | App Router — route handlers, cron support via vercel.json |
| `next-auth` | ^5.0.0-beta.31 | Auth available but not yet enforced on OS routes |
| `zod` | ^3.23.8 | Available for webhook payload validation |
| `resend` | ^3.3.0 | Available for run notifications/alerts if needed later |

## What Does NOT Need Installing

- No new AI library needed — `@anthropic-ai/sdk` 0.91.1 supports `messages.stream()` and `stream.finalMessage()` for token counts
- No queue library needed for MVP — inline async execution is sufficient
- No cron library needed — Vercel native crons + vercel.json config

## What Might Be Needed (Evaluate During Build)

| Package | Purpose | Decision |
|---------|---------|---------|
| `crypto` (Node built-in) | HMAC signature verification for webhooks | Built-in, no install |
| `@upstash/redis` or `ioredis` | Job queuing for high-volume agents | Defer — not MVP |
| `bull` / `bullmq` | Proper job queue | Defer — not MVP |

## Environment Variables Already Set

| Var | Status |
|-----|--------|
| `ANTHROPIC_API_KEY` | Set in .env.local + Vercel |
| `SUPABASE_URL` | Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Set |
| `SUPABASE_ANON_KEY` | Set |

## Environment Variables to Add

| Var | Purpose |
|-----|---------|
| `CRON_SECRET` | Vercel cron authentication (random 32-char string) |
| `AGENT_WEBHOOK_SECRET_SEED` | Base seed for per-agent HMAC secrets (or store per-agent in DB) |

## Agents Table Schema (Confirmed from AgentBuilder.tsx types)

```typescript
type AgentFull = {
  id: string
  client_id: string
  name: string
  description: string | null
  type: string | null
  status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null
  repo_url: string | null
  deploy_url: string | null
  last_run_at: string | null          // TIMESTAMPTZ — update on each run
  health: 'green' | 'yellow' | 'red'
  notes: string | null
  created_at: string
  updated_at: string
  trigger_type: 'manual' | 'schedule' | 'webhook' | null
  trigger_config: Record<string, unknown> | null  // { freq, time, tz, days, cron } or { method, auth }
  instructions: string | null          // THE SYSTEM PROMPT — already stored
  estimated_output: string | null
  config: Record<string, unknown> | null
  version: number | null
  run_count: number                    // increment on each run
  error_count: number                  // increment on error
}
```

## agent_runs Table Schema (To Create)

```sql
CREATE TABLE agent_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  trigger_source TEXT NOT NULL CHECK (trigger_source IN ('manual', 'schedule', 'webhook')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
  input_context JSONB,                 -- summary of what was sent to Claude
  output TEXT,                         -- Claude's full response
  output_summary TEXT,                 -- first 500 chars or extracted summary
  input_tokens INTEGER,
  output_tokens INTEGER,
  duration_ms INTEGER,
  error_message TEXT,
  webhook_payload JSONB,               -- raw webhook body if trigger_source = 'webhook'
  metadata JSONB                       -- extensible
);

CREATE INDEX idx_agent_runs_agent_id ON agent_runs (agent_id);
CREATE INDEX idx_agent_runs_client_id ON agent_runs (client_id);
CREATE INDEX idx_agent_runs_created_at ON agent_runs (created_at DESC);
```

# Internal Research: Gaps, Issues, Known Problems

## Critical Gaps (Must Fix for Agent Runtime)

### 1. No Execution Route
There is no API endpoint that triggers agent execution. The "Test run" button in AgentBuilder.tsx calls `alert('Test run triggered (API not yet wired)')`. Nothing executes Claude using an agent's stored instructions.

### 2. No agent_runs Table
The database has no run history table. The agents table tracks `last_run_at`, `run_count`, and `error_count` as aggregate counters only — no per-run record of input, output, tokens, or duration.

### 3. Webhook URL is Fake
AgentBuilder shows `https://os.eevolvv.ai/hooks/${agent.id}` as the webhook URL, but no route exists at that path. The webhook token and HMAC secret are generated client-side (via `crypto.randomUUID()`) but never persisted to the database.

### 4. No Cron Configuration
`vercel.json` contains only `ignoreCommand` — no `crons` property. No cron API routes exist. Schedule-triggered agents have zero execution mechanism.

### 5. Token Usage Not Captured in Streaming Path
`app/api/chat/route.ts` streams Claude responses but never captures `input_tokens` or `output_tokens`. The agent execution engine needs to capture this data for run logging. The `diagnostic/route.ts` (non-streaming) also does not capture token usage.

### 6. No Auth on OS Routes
All OS API routes have `// TODO: add session auth` comments. This is a security gap for webhook endpoints especially — public POST to `/api/hooks/[agentId]` must have HMAC verification before reaching Claude.

### 7. Webhook Token/Secret Not Persisted
`webhookToken` and `webhookSecret` are generated in AgentBuilder component state (`useState(() => crypto.randomUUID())`) but never saved to the database. The `saveStep` for Step 4 (Trigger) saves `trigger_type` and basic `trigger_config` (method, auth type) but NOT the actual token or secret values. This means webhook auth cannot be enforced.

### 8. No Context Assembly
The feature description calls for assembling a context payload (client data, diagnostic submissions, task history). Currently there is no logic to fetch and format this. The execution engine will need to query Supabase for client-specific context before calling Claude.

## Minor Gaps

### 9. Status Promotion vs. Actual Deployment
AgentBuilder's DEPLOY step lets Eduardo promote an agent from dev → staging → live, but this is just a status field update. "Live" doesn't actually mean the agent is running — there's no mechanism connecting `status = 'live'` to trigger execution.

### 10. run_count / error_count Not Incremented
The agents table has `run_count` and `error_count` columns but no code ever increments them. The execution engine must handle this via PATCH or a DB function.

### 11. No Vercel cron.json or vercel.json crons Entry
The current `vercel.json` has no `crons` array. This must be added to enable schedule-based triggers. Important constraint: Vercel Hobby plan is limited to once-per-day crons; more frequent scheduling requires a Pro plan.

## Non-Blockers (For Later)

- No per-agent API key system (for agent-as-a-service delivery to clients)
- No shareable run page or embed mechanism
- No notification system for run completion / errors
- No context window management (for very long instruction sets)
- No multi-turn agent loops — current pattern is single-shot Claude call

# External Research: Best Practices

## Claude Streaming in Next.js App Router

The exact streaming pattern already used in `app/api/chat/route.ts` is correct and current:
- `anthropic.messages.stream({...})` with `for await` loop
- `new ReadableStream({ async start(controller) {...} })`
- SSE response: `Content-Type: text/event-stream`, `Cache-Control: no-cache`

For capturing token usage after a stream, use `stream.finalMessage()`:
```typescript
const stream = anthropic.messages.stream({ ... })
// while streaming chunks...
const finalMsg = await stream.finalMessage()
const inputTokens = finalMsg.usage.input_tokens
const outputTokens = finalMsg.usage.output_tokens
```

For non-streaming (simpler for background execution), token usage is in `message.usage` directly:
```typescript
const message = await anthropic.messages.create({ ... })
const inputTokens = message.usage.input_tokens
const outputTokens = message.usage.output_tokens
```

Source: Anthropic official streaming docs

## Vercel Cron Jobs Configuration

Configuration goes in `vercel.json` under a `crons` array:
```json
{
  "crons": [
    {
      "path": "/api/cron/agents",
      "schedule": "0 * * * *"
    }
  ]
}
```

The cron handler must be a GET route (`export async function GET`).

Security: Vercel sends `Authorization: Bearer {CRON_SECRET}` header. Verify in the handler:
```typescript
const authHeader = req.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 })
}
```

Critical limit: **Hobby plan = max once per day.** Pro plan = max once per minute.
All crons run in UTC only. Crons only fire on production deployments (not preview).

Source: vercel.com/docs/cron-jobs, vercel.com/docs/cron-jobs/usage-and-pricing

## Agent Run Logging Best Practices

From LLM observability literature (2025):

1. **Log every run synchronously, evaluate asynchronously** — don't block the Claude call to write logs; write after the call returns, before sending the response
2. **Minimum fields per run:** prompt/input context snapshot, output snapshot, input_tokens, output_tokens, latency_ms, status (success/error), timestamp
3. **Link runs to prompt versions** — store the agent's `version` field on each run record
4. **Track trends, not just per-run:** monitor avg tokens/run, p95 latency, error rate over time
5. **Truncate stored output** — store full output in `output` column, store first 500 chars in `output_summary` for quick list views
6. **Store input context as JSONB** — structured summary, not raw dump — preserves queryability

## HMAC Webhook Verification

Standard Node.js pattern for HMAC-SHA256 verification:
```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  const sig = `sha256=${expected}`
  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(signature)
  )
}
```

Key rules:
- Always use `crypto.timingSafeEqual` — never string comparison (timing attack)
- Get raw body before any parsing — Next.js body parsing must not run first
- Store secret in env vars, never hardcoded
- Validate timestamp to reject replayed requests (add `X-Timestamp` header, reject if >5min old)
- Use `X-Hub-Signature-256` header name (GitHub convention, widely understood)

Source: hookdeck.com/webhooks/guides/how-to-implement-sha256-webhook-signature-verification, GitHub Docs

## Bearer Token Verification

For simpler auth (no HMAC):
```typescript
const authHeader = req.headers.get('authorization')
const token = authHeader?.replace('Bearer ', '')
if (token !== agent.trigger_config.token) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

The bearer token should be stored in `trigger_config.token` in Supabase (currently missing — see errors.md gap #7).

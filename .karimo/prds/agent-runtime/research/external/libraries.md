# External Research: Libraries

## Already Installed — No New Packages Needed for MVP

| Package | What It Provides | Use in Agent Runtime |
|---------|-----------------|---------------------|
| `@anthropic-ai/sdk` v0.91.1 | Claude API + streaming | Execute agents via `messages.create()` or `messages.stream()` |
| `@supabase/supabase-js` v2.105.1 | DB client | Store agent configs, write run logs |
| `zod` v3.23.8 | Schema validation | Validate webhook payloads, execution request bodies |
| `crypto` (Node.js built-in) | HMAC, timing-safe comparison | Webhook signature verification |

## Optional — Evaluate After MVP

| Package | Purpose | Decision |
|---------|---------|---------|
| `@upstash/qstash` | Serverless message queue for reliable async execution | Consider for V2 if cron reliability becomes an issue |
| `@upstash/redis` | Rate limiting per webhook | Consider if webhook endpoint gets abused |
| `ai` (Vercel AI SDK) | Unified streaming abstraction across providers | Not needed — already have direct Anthropic SDK; would add complexity |
| `bull` / `bullmq` | Job queue with retries and priorities | Overkill for MVP; revisit at scale |
| `date-fns` or `croner` | Cron expression evaluation in Node.js | Only needed if doing in-process cron matching; Vercel native crons are simpler |

## Recommendation

Do NOT install any new packages for the MVP. The existing stack (`@anthropic-ai/sdk`, `@supabase/supabase-js`, `zod`, Node `crypto`) is sufficient for:
- Manual execution endpoint
- Run history storage
- Webhook endpoint with HMAC verification
- Vercel-native cron dispatch

The Vercel AI SDK (`ai` package) is explicitly NOT recommended — it adds an abstraction layer over a pattern that already works perfectly with the direct Anthropic SDK.

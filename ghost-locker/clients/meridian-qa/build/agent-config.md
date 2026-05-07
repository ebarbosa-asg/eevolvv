# AGENT CONFIG — QA Defect Reporter
> meridian-qa · v1.0

| Parameter | Value |
|-----------|-------|
| Model | claude-haiku-4-5-20251001 |
| Max output tokens | 2048 |
| Temperature | 0 (deterministic) |
| Top-p | — |
| Tool choice | auto |
| Max tool calls | 10 |
| Timeout | 30s |
| Retry policy | None (cron re-runs next night) |

### Environment Variables Required

| Var | Purpose |
|-----|---------|
| `MERIDIAN_DB_URL` | PostgreSQL connection string (read-only user) |
| `RESEND_API_KEY` | Email delivery |
| `SUPABASE_SERVICE_ROLE_KEY` | Run logging |
| `MERIDIAN_SUPERVISOR_EMAILS` | Comma-separated recipient list |
| `CRON_SECRET` | Vercel cron trigger auth |
| `ANTHROPIC_API_KEY` | Claude API |

### Cost Estimate

| Item | Est. per run |
|------|-------------|
| Input tokens (system + tool results) | ~1,200 |
| Output tokens (report generation) | ~800 |
| Total tokens | ~2,000 |
| Cost at Haiku pricing | ~$0.0006 |
| Monthly (30 runs) | ~$0.018 |

Agent cost is negligible vs. $299/mo contract.

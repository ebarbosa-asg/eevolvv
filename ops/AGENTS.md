# eevolvv ops

Public brand is `eevolvv`. This tree is the clipping pipeline, isolated from the marketing site.

## Rules

- Ship a test with every change.
- Do not invent numbers. Prices in `workers/prices.yaml` carry a `verified_on` date and a source. Unknown SKUs raise.
- Sources come only from a client upload, a client-authorized link, the client's own RSS, or official campaign media. No scraping. No yt-dlp.
- Do not bypass database gates. Post status, campaign activation, and approvals are enforced in Postgres.
- Jobs are idempotent. A duplicate idempotency key returns the existing job.
- LLM output is validated. One retry with the rejection reason, then fail with that reason.
- Prompts live in versioned files under `workers/prompts/`.
- Secrets come from the environment and are never logged. `evv_workers.redact` runs before a job error is stored.

## Layout

| Path | Role |
| --- | --- |
| `apps/app` | Next.js 15 upload app |
| `workers` | Python 3.12 package `evv_workers` |
| `supabase/migrations` | Schema `0001_core.sql`, `0002_proof.sql` |
| `supabase/tests` | SQL invariant tests |
| `fixtures` | Transcript, mocked model output, CC-licensed detection clip |

## Commands

```bash
make test    # SQL + ruff + mypy --strict + pytest + eslint + tsc + vitest
make demo    # fixture video -> mocked moments -> three rendered clips -> QA
```

Live vendor calls run only when `RUN_LIVE=1`. The default suite does not call AssemblyAI, Claude, Stripe, or a paid render API.

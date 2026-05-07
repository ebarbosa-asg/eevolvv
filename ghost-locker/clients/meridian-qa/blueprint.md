# BLUEPRINT — meridian-qa · QA Defect Reporter
> Phase 3 · Architecture design · Completed 2026-04-13

---

## Agent: QA Defect Reporter

### Pattern
**Simple tool use** — deterministic pipeline, no reasoning loop needed.

```
TRIGGER (cron: 05:00 UTC daily)
  → fetch_defect_data(date=yesterday)
  → compute_statistics(data)
  → detect_outliers(stats, threshold=3sigma)
  → generate_report(stats, outliers)
  → send_email(report, recipients)
  → log_run(result, tokens, latency)
```

### Memory Architecture
**Stateless** — reads fresh from DB each run. 7-day rolling average computed live from the last 7 days of data, not cached state.

### Tool Definitions

| Tool | Input | Output | Notes |
|------|-------|--------|-------|
| `fetch_defect_data` | date | defect_rows[] | Queries production_db |
| `compute_statistics` | defect_rows[] | stats_by_line{} | Mean, stddev, counts |
| `detect_outliers` | stats_by_line, threshold | outlier_flags[] | 3-sigma rule |
| `generate_report` | stats, outliers | report_html | Markdown → HTML |
| `send_email` | report_html, recipients | delivery_result | via Resend |
| `log_run` | result_meta | void | to agent_runs table |

### Deployment

| Property | Value |
|----------|-------|
| Runtime | Vercel Cron (eevolvv platform) |
| Schedule | `0 5 * * *` (05:00 UTC = 12:00am CT) |
| Trigger URL | `/api/agents/meridian-qa/run` |
| Auth | CRON_SECRET header |
| Model | claude-haiku-4-5-20251001 (cost-efficient for structured extraction) |
| Max tokens | 2048 |
| Timeout | 30s |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| DB connection failure | Log error, send failure alert to Eduardo |
| Zero rows returned | Send "no defects logged" summary (not skip) |
| Unknown defect code | Include in count as "UNKNOWN-{code}", flag in report |
| Email delivery failure | Retry once, log if second failure |
| Agent timeout | Log timeout, do not retry same night |

### Observability

- Every run logged to `agent_runs` table: client_id, agent_id, status, output, tokens, latency_ms
- Run visible in `/os/clients/[meridian-client-id]` agent run history
- Failure notifications via Resend to hello@eevolvv.com

---

**Operator sign-off:** Blueprint approved 2026-04-13  
**Gate status:** BLUEPRINT ✓ COMPLETE

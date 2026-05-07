# RUNBOOK — QA Defect Reporter
> meridian-qa · Internal ops · eevolvv

---

## Quick Reference

| Item | Value |
|------|-------|
| Cron route | `POST /api/agents/meridian-qa/run` |
| Schedule | `0 5 * * *` (05:00 UTC) |
| Logs | Vercel dashboard → Functions → meridian-qa/run |
| Run history | `/os/clients/[meridian-client-id]` → Agent tab |
| Failure alerts | hello@eevolvv.com (auto) |
| Client contact | Rachel Chen — r.chen@meridianmfg.com |

---

## Common Scenarios

### Agent didn't run last night

1. Check Vercel cron logs — was the job triggered?
2. If triggered but failed: check Vercel function logs for error
3. If not triggered: check Vercel dashboard → Settings → Crons → confirm schedule active
4. Manual trigger: `curl -X POST https://eevolvv.com/api/agents/meridian-qa/run -H "Authorization: Bearer {CRON_SECRET}"`

### Report not received by client

1. Confirm agent_runs table shows `status=success` for that date
2. Check Resend dashboard for delivery status
3. If Resend shows delivered: ask Rachel to check spam
4. If Resend shows failed: check RESEND_API_KEY env var, retry manually

### DB connection error

1. Confirm MERIDIAN_DB_URL is set in Vercel env vars (production)
2. Check if Meridian DB credentials rotated — contact Rachel
3. Update MERIDIAN_DB_URL in Vercel → redeploy

### Outlier flags seem wrong

Common cause: 7-day average includes a plant shutdown (holiday/maintenance) that skewed the baseline.
Solution: Not a bug — normal statistical behavior. Explain to Rachel that low-defect days lower the average and make normal days look like outliers temporarily.

### Client wants to add a recipient

1. Update `MERIDIAN_SUPERVISOR_EMAILS` in Vercel env vars
2. No code change needed

---

## Upsell Triggers

| Signal | Opportunity |
|--------|-------------|
| Pilot completes 2026-05-22 | Confirm renewal, introduce real-time alerting (Phase 2) |
| Rachel mentions ERP integration | SAP integration scoping call |
| Outlier flags increasing | "Want us to add automated root cause analysis?" |
| Rachel forwards to CEO | CEO intro → enterprise tier conversation |

---

**Last updated:** 2026-04-22  
**Agent version:** 1.0

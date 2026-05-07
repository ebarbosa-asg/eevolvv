# DEPLOYMENT — QA Defect Reporter
> meridian-qa · Deployed 2026-04-22

---

## Deployment Target

**Platform:** Vercel (eevolvv project)  
**Route:** `POST /api/agents/meridian-qa/run`  
**Auth:** `Authorization: Bearer {CRON_SECRET}`  
**Cron schedule:** `0 5 * * *` (05:00 UTC daily)

## Vercel Cron Config

Added to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/agents/meridian-qa/run",
      "schedule": "0 5 * * *"
    }
  ]
}
```

## Environment Variables Set

All variables confirmed set in Vercel dashboard (production + preview):
- [x] MERIDIAN_DB_URL
- [x] RESEND_API_KEY
- [x] SUPABASE_SERVICE_ROLE_KEY
- [x] MERIDIAN_SUPERVISOR_EMAILS
- [x] CRON_SECRET
- [x] ANTHROPIC_API_KEY

## First Live Run

**Date:** 2026-04-22  
**Status:** SUCCESS  
**Rows processed:** 412  
**Lines reported:** 6  
**Outliers flagged:** 1 (Line 3 — 2 shifts above threshold)  
**Tokens used:** 1,847  
**Latency:** 8.2s  
**Delivered:** 05:58 UTC  

Rachel confirmed receipt at 6:03am CT. "Exactly what we needed."

## Pilot Status

Days run: 14  
Successes: 14  
Failures: 0  
On track for pilot completion: 2026-05-22

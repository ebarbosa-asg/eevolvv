# Brief: T06 — Feature: Cron Dispatch for Scheduled Agents

**Task ID:** T06  
**Wave:** 3  
**Complexity:** 3  
**Model:** sonnet  
**Dependencies:** T03  

---

## Context

This is a Next.js 14 App Router project deployed on Vercel (Hobby plan). Vercel Hobby crons fire max once per day. Crons are configured in `vercel.json` at the project root.

The Supabase client is at `lib/supabase.ts`. The execution engine was built in T03 at `POST /api/os/clients/[id]/agents/[agentId]/run`.

Agents with `trigger_type = 'schedule'` and `status = 'live'` should be dispatched. The `trigger_config` JSONB field may contain `{ schedule: { days: ['mon','tue',...] } }` for day-of-week filtering.

---

## Files to Create/Modify

### File 1 (create): `app/api/cron/agents/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // Fetch all live scheduled agents
  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, client_id, trigger_config')
    .eq('trigger_type', 'schedule')
    .eq('status', 'live')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!agents || agents.length === 0) return NextResponse.json({ fired: 0, skipped: 0 })

  // Check day-of-week filter
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3)
  // 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'

  let fired = 0
  let skipped = 0

  for (const agent of agents) {
    const config = agent.trigger_config as Record<string, unknown> | null
    const scheduleDays = (config?.schedule as Record<string, unknown>)?.days as string[] | undefined

    // If days are configured, only fire on matching days
    if (scheduleDays && scheduleDays.length > 0 && !scheduleDays.includes(today)) {
      skipped++
      continue
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://os.eevolvv.ai'
      const res = await fetch(
        `${baseUrl}/api/os/clients/${agent.client_id}/agents/${agent.id}/run`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ triggeredBy: 'schedule' }),
        }
      )
      if (res.ok) {
        fired++
      } else {
        console.error(`[cron] Agent ${agent.id} run failed: ${res.status}`)
        skipped++
      }
    } catch (err) {
      console.error(`[cron] Agent ${agent.id} run error:`, err)
      skipped++
    }
  }

  return NextResponse.json({ fired, skipped, total: agents.length })
}
```

### File 2 (create or update): `vercel.json`

Check if `vercel.json` already exists at the project root. If it does, add the `crons` key to the existing object. If it doesn't exist, create it:

```json
{
  "crons": [
    {
      "path": "/api/cron/agents",
      "schedule": "0 9 * * *"
    }
  ]
}
```

If `vercel.json` already has content, merge the `crons` array in — do not overwrite other keys.

### .env.local addition (documentation only — add comment, don't set value):

Add this line to `.env.local` if it doesn't already have `CRON_SECRET`:
```
# CRON_SECRET=<generate with: openssl rand -hex 32>
```

Also check if `NEXT_PUBLIC_APP_URL` is set. If not, add:
```
# NEXT_PUBLIC_APP_URL=https://os.eevolvv.ai
```

---

## Acceptance Criteria

- GET `/api/cron/agents` returns 401 without correct `Authorization: Bearer {CRON_SECRET}` header
- Returns `{ fired: n, skipped: n, total: n }` when authorized
- Only processes agents with `trigger_type = 'schedule'` AND `status = 'live'`
- Respects day-of-week filter from `trigger_config.schedule.days` if present
- `vercel.json` has crons entry pointing to `/api/cron/agents` at `0 9 * * *`
- No TypeScript errors

---

## Notes

- The cron handler calls the execution engine via HTTP fetch (internal API call) rather than importing the logic directly — this keeps the cron handler simple and decoupled
- The `NEXT_PUBLIC_APP_URL` env var is needed so the cron knows its own base URL. On Vercel, `VERCEL_URL` is automatically set but is deployment-specific; prefer a static env var for production
- Runs are sequential (not parallel) to avoid overwhelming the Anthropic API rate limits
- Vercel Hobby: this cron fires once per day maximum — the `0 9 * * *` schedule (9am UTC) is the configured time

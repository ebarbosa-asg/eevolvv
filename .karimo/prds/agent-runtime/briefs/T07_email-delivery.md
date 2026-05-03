# Brief: T07 — Feature: Email Delivery via Resend After Run

**Task ID:** T07  
**Wave:** 4  
**Complexity:** 3  
**Model:** sonnet  
**Dependencies:** T03, T06  

---

## Context

The project already uses Resend for email (`RESEND_API_KEY` is set). The existing email template is at `emails/EvolutionReport` (react-email). The execution engine was built in T03.

After a successful run triggered by `schedule` or `share_page`, the client should receive an email with a link to their run page.

The `clients` table may or may not have an `email` column. Check first — if it doesn't exist, add it via migration.

The `agents` table has a `share_token` column (added in T01).

---

## Files to Create/Modify

### Step 1: Verify clients.email column

The `clients` table already has an `email` column (confirmed from codebase). No migration needed.

### File 1 (create): `lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRunEmail(params: {
  clientEmail: string
  clientName: string
  agentName: string
  outputSummary: string
  shareToken: string
}): Promise<void> {
  const shareUrl = `https://os.eevolvv.ai/run/${params.shareToken}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.agentName}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Space Grotesk',Arial,sans-serif;color:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">
    <div style="font-size:11px;font-family:monospace;opacity:0.3;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">
      eevolvv intelligence
    </div>
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px 0;">
      ${params.agentName}
    </h1>
    <p style="font-size:14px;opacity:0.5;margin:0 0 40px 0;">
      Your latest brief is ready, ${params.clientName}.
    </p>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:24px;margin-bottom:32px;">
      <p style="font-size:14px;line-height:1.7;opacity:0.8;margin:0;">
        ${params.outputSummary.replace(/\n/g, '<br>')}
      </p>
    </div>
    <a href="${shareUrl}"
       style="display:inline-block;background:#fff;color:#0a0a0a;font-family:monospace;font-size:13px;font-weight:600;padding:12px 24px;border-radius:6px;text-decoration:none;">
      View full brief →
    </a>
    <p style="font-size:11px;opacity:0.25;margin-top:48px;">
      eevolvv.ai · Unsubscribe
    </p>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'eevolvv Intelligence <hello@eevolvv.com>',
    to: params.clientEmail,
    subject: `${params.agentName} — Your brief is ready`,
    html,
  })
}
```

### File 2 (modify): `app/api/os/clients/[id]/agents/[agentId]/run/route.ts`

After the successful run block (after updating `agents.last_run_at`), add email dispatch:

```typescript
// Fire-and-forget email after successful run
if (triggeredBy === 'schedule' || triggeredBy === 'share_page') {
  const { data: clientData } = await supabase
    .from('clients')
    .select('name, email')
    .eq('id', params.id)
    .single()

  if (clientData?.email && agent.share_token) {
    sendRunEmail({
      clientEmail: clientData.email,
      clientName: clientData.name ?? '',
      agentName: agent.name ?? 'Your Agent',
      outputSummary: outputSummary,
      shareToken: agent.share_token,
    }).catch(err => console.error('[email] sendRunEmail failed:', err))
  }
}
```

Also add the import at the top of the file:
```typescript
import { sendRunEmail } from '@/lib/email'
```

### File 3 (modify): `app/api/run/[shareToken]/route.ts`

Same email dispatch block after successful run in the public endpoint. Add after updating `agents.last_run_at`:

```typescript
if (agent.share_token && agent.client_id) {
  const { data: clientData } = await supabase
    .from('clients')
    .select('name, email')
    .eq('id', agent.client_id)
    .single()

  if (clientData?.email) {
    sendRunEmail({
      clientEmail: clientData.email,
      clientName: clientData.name ?? '',
      agentName: agent.name ?? 'Your Agent',
      outputSummary: output.slice(0, 500),
      shareToken: agent.share_token,
    }).catch(err => console.error('[email] sendRunEmail failed:', err))
  }
}
```

Add import at top:
```typescript
import { sendRunEmail } from '@/lib/email'
```

---

## Acceptance Criteria

- `lib/email.ts` exists and exports `sendRunEmail`
- `clients` table has `email` column (migration applied if needed)
- After a scheduled run completes successfully, `sendRunEmail` is called (fire-and-forget)
- After a share_page run completes successfully, `sendRunEmail` is called (fire-and-forget)
- Email not sent for `triggered_by = 'manual'` (OS run panel runs)
- `sendRunEmail` errors don't crash the execution engine (`.catch(console.error)` pattern)
- TypeScript compiles cleanly

---

## Notes

- `fire-and-forget` pattern: call `sendRunEmail(...).catch(...)` without `await` so email never blocks the API response
- Email is only sent when `clientData.email` is non-null — gracefully skips if client has no email set
- The from address `hello@eevolvv.com` must be verified in Resend dashboard. If not verified, the send will fail silently (fire-and-forget). Verify in Resend before testing.
- `resend` package should already be installed (`npm install resend` if not)

# Brief: T02 — Fix: Persist webhook token/secret to Supabase

**Task ID:** T02  
**Wave:** 1  
**Complexity:** 2  
**Model:** sonnet  
**Dependencies:** none  

---

## Context

`app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx` is a 700+ line client component with a 6-step wizard. In step 4 (Trigger), when `triggerType === 'webhook'`, the component generates a webhook token and secret via `useState(() => crypto.randomUUID())` but never includes them in the PATCH body when saving.

The `saveStep()` function uses a switch on `step` to build the PATCH body for each step. The step 4 case currently only saves:
```typescript
{ trigger_type: triggerType, trigger_config: { auth: webhookConfig.auth } }
```

The `webhookToken` and `webhookSecret` state values are displayed in the UI but discarded on save.

---

## What To Fix

File: `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx`

### Fix 1: Step 4 save body

Find the `saveStep()` function's `case 4:` (or equivalent step 4 save logic). Change the PATCH body to include the full webhook config:

```typescript
// OLD (approximate):
body = {
  trigger_type: triggerType,
  trigger_config: { auth: webhookConfig.auth }
}

// NEW:
body = {
  trigger_type: triggerType,
  trigger_config: {
    auth: webhookConfig.auth,
    method: webhookConfig.method,
    token: webhookToken,
    secret: webhookSecret,
  }
}
```

For schedule trigger type, the save should still send the full schedule config as it already does (no change needed there).

### Fix 2: Verify schedule config is also complete

While in step 4, confirm the schedule save case includes all of: `frequency`, `time`, `timezone`, `days`, `customCron`. If any are missing, add them.

---

## Acceptance Criteria

- When step 4 is saved with webhook trigger, `trigger_config` in Supabase includes `token` and `secret` fields
- Existing schedule trigger save is not broken
- No TypeScript errors
- The fix is minimal — change only what's needed in the save body

---

## Notes

- Read the full file first to find exact variable names (`webhookToken`, `webhookSecret`, or similar)
- The `trigger_config` column on `agents` is `jsonb` — any object structure is valid
- Do not change the UI or state initialization — only the save body

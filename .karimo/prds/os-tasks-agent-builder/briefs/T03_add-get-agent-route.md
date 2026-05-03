# Task Brief: T03

**Title:** API — Add GET single agent route + update TypeScript types
**PRD:** os-tasks-agent-builder
**Priority:** must
**Complexity:** 3/10
**Model:** sonnet
**Wave:** 2

---

## Objective

Add a `GET` handler to the existing agent route file so the agent builder page can fetch a single agent by ID. Also extend the `Agent` TypeScript type in `ClientWorkspace.tsx` to include the 8 new builder fields added by T01. Run `npx tsc --noEmit` to confirm zero type errors.

---

## Context

**Parent Feature:** OS Tasks Area + Agent Builder (os-tasks-agent-builder)

The agent builder lives at `/os/clients/[id]/agents/[agentId]` and requires fetching a single agent on page load. The existing route file at `app/api/os/clients/[id]/agents/[agentId]/route.ts` already handles `PATCH` (update agent fields) and `DELETE` (remove agent), but has no `GET` handler — making direct agent fetches impossible.

The `Agent` type in `ClientWorkspace.tsx` was defined before the T01 migration and is missing the 8 new columns. Without updating the type, any component that reads the new fields will produce TypeScript errors.

This task is part of **Wave 2** — it depends on T01 (which adds the 8 new DB columns that the `Agent` type must reflect). T02 can be in any state; it does not affect this task.

---

## Research Context

### Patterns to Follow

- **Existing handler pattern:** Both `PATCH` and `DELETE` in `route.ts` follow the same structure: guard on `!supabase`, call Supabase client, handle `error`, return `NextResponse.json(data)`. The new `GET` must match this pattern exactly.
- **Client-scoped queries:** All agent queries filter on BOTH `id` (the agentId) and `client_id` (the client id from the URL). This is the security boundary — never query by agentId alone.
- **`Agent` type location:** The type is defined at line 24 of `app/os/clients/[id]/ClientWorkspace.tsx`. Extend it in-place; do not extract to a shared types file (no other file imports it yet).

### Known Issues to Address

- The `Agent` type currently has no fields from the T01 migration. TypeScript will flag these as unknown when the agent builder reads `agent.instructions`, `agent.trigger_type`, etc.

### Dependencies

**File Dependencies:**
- `app/api/os/clients/[id]/agents/[agentId]/route.ts` — modify (add GET handler)
- `app/os/clients/[id]/ClientWorkspace.tsx` — modify (extend Agent type)

**Upstream DB Dependency:**
- T01 must be complete. The new columns must exist in Supabase before the GET route's `select('*')` can return them. Verify T01 is done before starting.

---

## Requirements

### 1. Add GET handler to route.ts

The file currently has `PATCH` and `DELETE`. Add `GET` as the first export (before `PATCH` for readability, though order does not matter to Next.js):

```typescript
export async function GET(_req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}
```

Key details:
- Parameter is `_req` (underscore prefix) because the request body is not used in GET
- `.eq('client_id', params.id)` — always scope to the client for security
- `.single()` — returns one row or throws; error path returns 404 (agent not found)
- Error status is `404` (not found), not `500` (server error) — this is intentional

### 2. Extend Agent type in ClientWorkspace.tsx

The current `Agent` type (lines 24-30) reads:

```typescript
type Agent = {
  id: string; client_id: string; name: string; description: string | null
  type: string | null; status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null; repo_url: string | null; deploy_url: string | null
  last_run_at: string | null; health: 'green' | 'yellow' | 'red'; notes: string | null
  created_at: string; updated_at: string
}
```

Extend it to include the 8 new fields from T01:

```typescript
type Agent = {
  id: string; client_id: string; name: string; description: string | null
  type: string | null; status: 'dev' | 'staging' | 'live' | 'paused' | 'error'
  integrations: string[] | null; repo_url: string | null; deploy_url: string | null
  last_run_at: string | null; health: 'green' | 'yellow' | 'red'; notes: string | null
  created_at: string; updated_at: string
  // Builder fields (added by T01 migration)
  trigger_type: 'manual' | 'schedule' | 'webhook' | null
  trigger_config: Record<string, unknown> | null
  instructions: string | null
  estimated_output: string | null
  config: Record<string, unknown> | null
  version: number
  run_count: number
  error_count: number
}
```

Notes on the new fields:
- `trigger_type` is a union literal (not just `string`) — the DB stores a constrained set of values
- `trigger_config` and `config` are `Record<string, unknown> | null` — JSONB columns with arbitrary shape
- `version`, `run_count`, `error_count` are `number` (not `number | null`) — they have DB defaults of 1/0/0 and are never null for valid rows

### 3. TypeScript verification

After both changes, run:

```bash
npx tsc --noEmit
```

Must exit with no errors. If errors appear, fix them before marking the task complete — do not suppress with `// @ts-ignore`.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] `GET` handler added to `app/api/os/clients/[id]/agents/[agentId]/route.ts`
- [ ] GET handler returns 503 when `supabase` is null
- [ ] GET handler queries both `id = params.agentId` AND `client_id = params.id`
- [ ] GET handler returns 404 (not 500) on Supabase error
- [ ] GET handler returns JSON agent data on success
- [ ] `Agent` type in `ClientWorkspace.tsx` includes all 8 new fields
- [ ] `trigger_type` typed as `'manual' | 'schedule' | 'webhook' | null`
- [ ] `trigger_config` and `config` typed as `Record<string, unknown> | null`
- [ ] `version`, `run_count`, `error_count` typed as `number`
- [ ] `npx tsc --noEmit` exits with zero errors
- [ ] Existing `PATCH` and `DELETE` handlers are unchanged

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/api/os/clients/[id]/agents/[agentId]/route.ts` | modify | Add GET handler before existing PATCH handler |
| `app/os/clients/[id]/ClientWorkspace.tsx` | modify | Extend Agent type with 8 new builder fields |

### File Ownership Notes

`ClientWorkspace.tsx` is a large shared file (~400+ lines). This task only modifies the `Agent` type definition (lines 24-30). Do not alter any other part of this file. The task board upgrade and agent builder UI (future tasks) will also modify this file — coordinate carefully if working in parallel.

`route.ts` is small (33 lines). The GET handler can be inserted cleanly before the PATCH export.

---

## Implementation Guidance

### Exact File State After Changes

**route.ts** should have exports in this order:
1. `GET` (new)
2. `PATCH` (existing — unchanged)
3. `DELETE` (existing — unchanged)

All three handlers follow the same pattern: supabase null guard → query → error check → return JSON.

### Current route.ts for Reference

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// TODO: add session auth

export async function PATCH(req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const body = await req.json()
  const { data, error } = await supabase
    .from('agents')
    .update(body)
    .eq('id', params.agentId)
    .eq('client_id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; agentId: string } }) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', params.agentId)
    .eq('client_id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

### Code Style

- No Tailwind classes in API routes (not applicable here, but noted)
- JetBrains Mono / inline styles rules apply to UI components only
- Follow the existing import order: Next.js built-ins first, then internal `@/` imports
- Keep the `// TODO: add session auth` comment — it is a tracked reminder, not dead code

### Edge Cases

- If `params.agentId` does not exist or belongs to a different client, `.single()` will return an error and the handler correctly returns 404
- The `_req` parameter naming convention (underscore prefix for unused params) is already used in `DELETE` — match it in `GET`
- `select('*')` returns all columns including the new T01 fields; no column list maintenance needed

### Testing Requirements

No automated tests required for this task. Manual verification:

1. Start dev server: `npm run dev` (runs on localhost:3004)
2. Confirm GET request to `/api/os/clients/{clientId}/agents/{agentId}` returns the agent JSON
3. Confirm a GET with a non-existent agentId returns `{"error": "..."}` with status 404
4. Run `npx tsc --noEmit` and confirm zero errors

---

## Boundaries

### Files You MUST NOT Touch

- `app/page.tsx` — homepage, unrelated
- `components/ChatEngine.tsx` — AI chat, unrelated
- `app/api/diagnostic/route.ts` — diagnostic API, unrelated
- `lib/supabase.ts` — Supabase client setup, no changes needed
- Any file outside `app/api/os/` and `app/os/clients/[id]/ClientWorkspace.tsx`

### Files Requiring Review

`app/os/clients/[id]/ClientWorkspace.tsx` — large shared file. Only the `Agent` type definition should change. Review the diff carefully before committing.

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|------------------|------------------------|
| T01 | 8 new columns on `agents` table | Call `list_tables verbose: true` on Supabase project `qmdygiumftesoqzqmsqe` and confirm `trigger_type`, `instructions`, `version`, etc. are present on `agents` |

### Downstream Impact

Tasks that depend on this one:
- Agent builder page (`AgentBuilder.tsx`) — calls `GET /api/os/clients/[id]/agents/[agentId]` on load
- Any component that reads `agent.instructions`, `agent.trigger_type`, etc. requires the updated `Agent` type

**Before starting:** Verify T01 is complete using `list_tables verbose: true`.

---

## GitHub Context

**Branch:** `worktree/os-tasks-agent-builder-T03`
**Target:** main (or feature branch as determined by PM Agent)

---

## Commit Guidelines

```
feat(api): add GET single agent route and extend Agent type

- Add GET /api/os/clients/[id]/agents/[agentId] handler
- Extend Agent type with 8 builder fields from T01 migration
- Verified: npx tsc --noEmit exits clean

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Validation Checklist

Before creating PR:
- [ ] All success criteria met
- [ ] `npx tsc --noEmit` passes
- [ ] Dev server starts without errors: `npm run dev`
- [ ] Manual GET request returns agent JSON
- [ ] Manual GET with bad ID returns 404
- [ ] `PATCH` and `DELETE` handlers verified still working
- [ ] No files outside scope modified

---

*Generated by KARIMO Brief Writer*
*PRD: os-tasks-agent-builder | Task: T03 | Wave: 2*

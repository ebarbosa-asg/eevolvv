# Task Brief: Build Queue View in OS

**ID:** T16
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** must
**Model:** sonnet
**Depends on:** T05, T06

---

## Objective

Build the internal build queue dashboard at `app/os/builds/page.tsx` — the technician's primary work view. Shows all builds grouped by status, with action buttons to claim and advance builds through the pipeline. Status changes trigger build notification emails (via T17's `app/api/builds/update-status/route.ts`). Add "Builds" to the OS sidebar.

---

## Context

**Verify before starting:**
- `builds` table exists with status, client_id, assigned_to, build_url columns (T05 complete)
- `clients` table has email and name (T05 complete)

**Existing OS structure:**
- `app/os/OSSidebar.tsx` — hardcoded `SECTIONS` array (lines 8–18). Add new entry here.
- `app/os/builds/page.tsx` — does not yet exist. Create it.
- `app/os/clients/page.tsx` — example of an OS page to follow for structure

**OS design pattern from `app/os/clients/page.tsx`:**
- Uses `components/ds/` components
- Fetches data server-side (Supabase in server component)
- Client component for interactivity (`BuildQueueTable.tsx`)
- No authentication added (OS already has its own auth via Google OAuth + NextAuth in `middleware.ts`)

**Status advancement logic:**
```
queued → in_progress (button: "Start Build" — also sets started_at)
in_progress → qa (button: "Submit for QA")
qa → deploying (button: "Approve QA")
deploying → live (button: "Mark Live" — requires build_url input)
```

**API route for status updates:**
`PATCH /api/builds/update-status` (not `/api/os/builds/[id]` — keep it consistent with tasks.yaml which specifies `app/api/builds/update-status/route.ts`)

The PATCH handler is created in this task; T17 will add email triggers to it.

---

## Implementation

### Files to Create

- `app/os/builds/page.tsx` — Server component; fetches all builds
- `app/os/builds/BuildQueueTable.tsx` — Client component; interactive table
- `app/api/builds/update-status/route.ts` — PATCH handler for status changes

### Files to Modify

- `app/os/OSSidebar.tsx` — Add "Builds" entry to SECTIONS array

### Step-by-Step

1. Modify `app/os/OSSidebar.tsx` — add to `SECTIONS` array after `GHOST LOCKER`:

```typescript
const SECTIONS = [
  { n: '00', label: 'OVERVIEW', route: '/os' },
  { n: '01', label: 'TASKS', route: '/os/tasks' },
  { n: '02', label: 'FEED', route: '/os/feed' },
  { n: '03', label: 'CLIENTS', route: '/os/clients' },
  { n: '04', label: 'PIPELINE', route: '/os/pipeline' },
  { n: '05', label: 'FINANCE', route: '/os/finance' },
  { n: '06', label: 'INVESTORS', route: '/os/investors' },
  { n: '07', label: 'LINKS', route: '/os/links' },
  { n: '08', label: 'GHOST LOCKER', route: '/os/ghost-locker' },
  { n: '09', label: 'BUILDS', route: '/os/builds' },   // ← ADD THIS
] as const
```

2. Create `app/api/builds/update-status/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const VALID_TRANSITIONS: Record<string, string[]> = {
  queued: ['in_progress'],
  in_progress: ['qa', 'paused'],
  qa: ['deploying', 'in_progress'],
  deploying: ['live', 'failed'],
  live: [],
  failed: ['in_progress'],
  paused: ['in_progress'],
}

export async function PATCH(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  let body: { buildId: string; status: string; buildUrl?: string; assignedTo?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { buildId, status, buildUrl, assignedTo } = body

  if (!buildId || !status) {
    return NextResponse.json({ error: 'buildId and status are required' }, { status: 400 })
  }

  // Get current build
  const { data: build, error: buildErr } = await supabase
    .from('builds')
    .select('id, status, client_id, tier, assigned_to')
    .eq('id', buildId)
    .single()

  if (buildErr || !build) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 })
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[build.status] ?? []
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `Invalid transition: ${build.status} → ${status}` },
      { status: 400 }
    )
  }

  // Require build_url when marking live
  if (status === 'live' && !buildUrl) {
    return NextResponse.json({ error: 'build_url is required when marking live' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const updateData: Record<string, string | null> = {
    status,
    updated_at: now,
  }
  if (status === 'in_progress' && !build.assigned_to) {
    updateData.started_at = now
    if (assignedTo) updateData.assigned_to = assignedTo
  }
  if (status === 'live') {
    updateData.completed_at = now
    if (buildUrl) updateData.build_url = buildUrl
  }

  const { error: updateErr } = await supabase
    .from('builds')
    .update(updateData)
    .eq('id', buildId)

  if (updateErr) {
    console.error('[builds/update-status] update error:', updateErr.message)
    return NextResponse.json({ error: 'Failed to update build status' }, { status: 500 })
  }

  // T17 will add email triggers here based on status transition
  // Placeholder: log the transition
  console.log(`[builds/update-status] ${build.status} → ${status} for build ${buildId}`)

  return NextResponse.json({ success: true, buildId, previousStatus: build.status, newStatus: status })
}
```

3. Create `app/os/builds/page.tsx`:

```tsx
import { supabase } from '@/lib/supabase'
import { BuildQueueTable } from './BuildQueueTable'

export default async function BuildsPage() {
  if (!supabase) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ opacity: 0.5 }}>Database unavailable.</p>
      </div>
    )
  }

  const { data: builds } = await supabase
    .from('builds')
    .select(`
      id, tier, status, assigned_to, build_url, notes, created_at, started_at, updated_at,
      clients!inner(id, name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}>
          § 09 · BUILDS
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 4px', color: 'var(--paper)' }}>
          Build Queue
        </h1>
        <div style={{ fontSize: 13, color: 'var(--paper)', opacity: 0.45 }}>
          {builds?.length ?? 0} builds total
        </div>
      </div>
      <BuildQueueTable builds={(builds ?? []) as BuildRow[]} />
    </div>
  )
}

export interface BuildRow {
  id: string
  tier: string
  status: string
  assigned_to: string | null
  build_url: string | null
  notes: string | null
  created_at: string
  started_at: string | null
  updated_at: string
  clients: { id: string; name: string | null; email: string | null }
}
```

4. Create `app/os/builds/BuildQueueTable.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { BuildRow } from './page'

const STATUS_ORDER = ['queued', 'in_progress', 'qa', 'deploying', 'live', 'failed', 'paused']
const STATUS_LABELS: Record<string, string> = {
  queued: 'Queued',
  in_progress: 'In Progress',
  qa: 'QA',
  deploying: 'Deploying',
  live: 'Live',
  failed: 'Failed',
  paused: 'Paused',
}

export function BuildQueueTable({ builds }: { builds: BuildRow[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [buildUrls, setBuildUrls] = useState<Record<string, string>>({})
  const [localBuilds, setLocalBuilds] = useState<BuildRow[]>(builds)

  const filtered = filter === 'all' ? localBuilds : localBuilds.filter(b => b.status === filter)
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = localBuilds.filter(b => b.status === s).length
    return acc
  }, {} as Record<string, number>)

  async function updateStatus(buildId: string, status: string, buildUrl?: string) {
    setLoadingId(buildId)
    try {
      const res = await fetch('/api/builds/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, status, buildUrl }),
      })
      if (res.ok) {
        setLocalBuilds(prev => prev.map(b =>
          b.id === buildId ? { ...b, status, build_url: buildUrl ?? b.build_url } : b
        ))
      } else {
        const data = await res.json()
        alert(data.error ?? 'Update failed')
      }
    } catch {
      alert('Network error')
    } finally {
      setLoadingId(null)
    }
  }

  function handleMarkLive(buildId: string) {
    const url = buildUrls[buildId]?.trim()
    if (!url) {
      alert('Enter the production URL before marking live.')
      return
    }
    updateStatus(buildId, 'live', url)
  }

  const tabStyle = (s: string) => ({
    padding: '7px 14px', fontSize: 10, letterSpacing: '0.14em', fontWeight: 600, cursor: 'pointer',
    background: filter === s ? 'var(--accent)' : 'transparent',
    color: filter === s ? 'var(--paper)' : 'var(--paper)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontFamily: 'JetBrains Mono, monospace',
    opacity: filter === s ? 1 : 0.6,
  })

  return (
    <div>
      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' as const }}>
        <button onClick={() => setFilter('all')} style={tabStyle('all')}>
          ALL ({localBuilds.length})
        </button>
        {STATUS_ORDER.map(s => counts[s] > 0 && (
          <button key={s} onClick={() => setFilter(s)} style={tabStyle(s)}>
            {STATUS_LABELS[s].toUpperCase()} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Build list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '32px 0', color: 'var(--paper)', opacity: 0.4, textAlign: 'center' as const, fontSize: 13 }}>
            No builds in this status.
          </div>
        )}
        {filtered.map(build => (
          <div key={build.id} style={{
            background: 'rgba(20,20,19,0.4)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 20px', display: 'grid',
            gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>
                  {build.clients?.name || build.clients?.email || 'Unknown'}
                </span>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--accent)' }}>
                  {build.tier.toUpperCase()}
                </span>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--paper)', opacity: 0.4 }}>
                  {STATUS_LABELS[build.status]?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 11, color: 'var(--paper)', opacity: 0.45 }}>
                <span>Created: {new Date(build.created_at).toLocaleDateString()}</span>
                {build.assigned_to && <span>→ {build.assigned_to}</span>}
                {build.build_url && <a href={build.build_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>View site</a>}
              </div>
              {/* Build URL input for deploying→live */}
              {build.status === 'deploying' && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    placeholder="https://client-site.vercel.app"
                    value={buildUrls[build.id] ?? ''}
                    onChange={e => setBuildUrls(prev => ({ ...prev, [build.id]: e.target.value }))}
                    style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', fontSize: 12 }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {build.status === 'queued' && (
                <ActionButton label="START BUILD" onClick={() => updateStatus(build.id, 'in_progress')} loading={loadingId === build.id} />
              )}
              {build.status === 'in_progress' && (
                <ActionButton label="SUBMIT FOR QA" onClick={() => updateStatus(build.id, 'qa')} loading={loadingId === build.id} />
              )}
              {build.status === 'qa' && (
                <>
                  <ActionButton label="APPROVE QA" onClick={() => updateStatus(build.id, 'deploying')} loading={loadingId === build.id} />
                  <ActionButton label="NEEDS REWORK" onClick={() => updateStatus(build.id, 'in_progress')} loading={loadingId === build.id} variant="ghost" />
                </>
              )}
              {build.status === 'deploying' && (
                <ActionButton label="MARK LIVE" onClick={() => handleMarkLive(build.id)} loading={loadingId === build.id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionButton({ label, onClick, loading, variant = 'primary' }: {
  label: string; onClick: () => void; loading: boolean; variant?: 'primary' | 'ghost'
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mono"
      style={{
        padding: '8px 16px', fontSize: 9, letterSpacing: '0.16em', fontWeight: 700,
        background: variant === 'primary' ? 'var(--accent)' : 'transparent',
        color: 'var(--paper)',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        whiteSpace: 'nowrap' as const,
      }}
    >
      {loading ? '...' : label}
    </button>
  )
}
```

---

## Code Patterns to Follow

```typescript
// Supabase join pattern
supabase.from('builds').select('*, clients!inner(id, name, email)')

// Status transition validation
const VALID_TRANSITIONS: Record<string, string[]> = { queued: ['in_progress'], ... }
const allowed = VALID_TRANSITIONS[build.status] ?? []
if (!allowed.includes(status)) return 400
```

---

## Environment Variables

No new env vars needed — uses existing `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

---

## Acceptance Criteria

- [ ] `/os/builds` accessible from OS sidebar (new "BUILDS" entry added)
- [ ] Page displays all builds with: client name/email, tier, status, assigned_to, created_at
- [ ] Status filter tabs: All + each status that has builds
- [ ] "Start Build" button on `queued` builds → advances to `in_progress`
- [ ] "Submit for QA" button on `in_progress` → advances to `qa`
- [ ] "Approve QA" button on `qa` → advances to `deploying`
- [ ] "Needs Rework" button on `qa` → returns to `in_progress`
- [ ] "Mark Live" button on `deploying` → requires URL input → advances to `live`
- [ ] Status transitions validated server-side (invalid transitions return 400)
- [ ] `PATCH /api/builds/update-status` accepts `{ buildId, status, buildUrl?, assignedTo? }`
- [ ] `build_url` stored when marking live
- [ ] `started_at` set when transitioning to `in_progress`
- [ ] `completed_at` set when transitioning to `live`
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `PATCH /api/builds/update-status` | T17 (adds email triggers to this handler) |
| `app/os/builds/BuildQueueTable.tsx` | T24 (adds PostHog events) |
| `builds.status` changes | T17 (notification emails on transitions) |

---

## Do Not

- Do not add authentication to the API route beyond what OS layout already enforces
- Do not skip the `started_at` update on `in_progress` transition — T17 and T13 reference it
- Do not hardcode status transitions in the frontend — always validate server-side
- Do not add email sending in this task — T17 handles that
- Do not touch `middleware.ts`

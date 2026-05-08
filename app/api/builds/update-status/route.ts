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
  console.log(`[builds/update-status] ${build.status} → ${status} for build ${buildId}`)

  return NextResponse.json({
    success: true,
    buildId,
    previousStatus: build.status,
    newStatus: status,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBuildStarted, sendBuildReadyForReview, sendBuildLive } from '@/lib/email-helpers'

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

  console.log(`[builds/update-status] ${build.status} → ${status} for build ${buildId}`)

  // Fire-and-forget email notifications on relevant transitions (T17)
  if (status === 'in_progress' || status === 'deploying' || status === 'live') {
    ;(async () => {
      try {
        if (!supabase) return

        // Fetch client email + name
        const { data: client } = await supabase
          .from('clients')
          .select('email, name, tier')
          .eq('id', build.client_id)
          .single()

        if (!client?.email) return

        // Fetch portal token for URL construction
        const { data: tokenRow } = await supabase
          .from('onboarding_tokens')
          .select('token')
          .eq('client_id', build.client_id)
          .maybeSingle()

        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'
        const portalUrl = tokenRow?.token
          ? `${BASE_URL}/client/${tokenRow.token}`
          : `${BASE_URL}/pricing`

        const emailArgs = {
          email: client.email,
          name: client.name ?? undefined,
          tier: client.tier ?? build.tier ?? 'seed',
          portalUrl,
        }

        if (status === 'in_progress') {
          await sendBuildStarted(emailArgs)
        } else if (status === 'deploying') {
          await sendBuildReadyForReview(emailArgs)
        } else if (status === 'live') {
          await sendBuildLive({ ...emailArgs, buildUrl: buildUrl ?? '' })
        }
      } catch (err) {
        console.error('[builds/update-status] email send failed:', err)
      }
    })()
  }

  return NextResponse.json({
    success: true,
    buildId,
    previousStatus: build.status,
    newStatus: status,
  })
}

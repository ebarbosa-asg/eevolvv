import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
  canAccessClientAgentPage,
  getClientAgentPage,
  isOwnerEmail,
} from '@/lib/client-agent-pages'
import { findOrCreateClientForAgentPage, normalizeRequestText } from '@/lib/client-agent-server'
import {
  getSeedDeliverablesForClient,
  type ClientDeliverableRecord,
  type DeliverableStatus,
  type DeliverableType,
} from '@/lib/deliverables'

const VALID_STATUSES: DeliverableStatus[] = [
  'recommended',
  'paid',
  'intake',
  'queued',
  'building',
  'review',
  'live',
]

const VALID_TYPES: DeliverableType[] = [
  'agent',
  'automation',
  'website',
  'sco',
  'ads',
  'dashboard',
  'report',
  'request',
]

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Client page not found' }, { status: 404 })

  const email = session.user?.email
  if (!canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const seedDeliverables = getSeedDeliverablesForClient(page)

  if (!supabase) {
    return NextResponse.json({
      deliverables: seedDeliverables,
      persisted: false,
      note: 'DB unavailable; showing template deliverables.',
    })
  }

  const { client, error: clientError } = await findOrCreateClientForAgentPage(page)
  if (clientError || !client) {
    return NextResponse.json({
      deliverables: seedDeliverables,
      persisted: false,
      note: clientError ?? 'Client unavailable; showing template deliverables.',
    })
  }

  const { data, error } = await supabase
    .from('client_deliverables')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({
      client,
      deliverables: seedDeliverables,
      persisted: false,
      note: `Deliverables table unavailable; showing templates. ${error.message}`,
    })
  }

  const persisted = (data ?? []) as ClientDeliverableRecord[]
  const existingKeys = new Set(persisted.map((item) => item.key))
  const merged = [
    ...persisted,
    ...seedDeliverables.filter((item) => !existingKeys.has(item.key)),
  ]

  return NextResponse.json({ client, deliverables: merged, persisted: true })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Client page not found' }, { status: 404 })

  const email = session.user?.email
  if (!isOwnerEmail(email) && !canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const title = normalizeRequestText(body.title)
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  const status = VALID_STATUSES.includes(body.status) ? body.status : 'queued'
  const type = VALID_TYPES.includes(body.type) ? body.type : 'request'
  const key = normalizeRequestText(body.key) || `${type}-${Date.now()}`
  const promise = normalizeRequestText(body.promise) || title
  const scope = parseStringArray(body.scope)
  const proof = parseStringArray(body.proof)

  const { client, error: clientError } = await findOrCreateClientForAgentPage(page)
  if (clientError || !client) {
    return NextResponse.json({ error: clientError ?? 'Client unavailable' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('client_deliverables')
    .insert({
      client_id: client.id,
      client_slug: page.slug,
      key,
      type,
      title,
      price: normalizeRequestText(body.price) || null,
      status,
      promise,
      scope,
      proof,
      delivery_window: normalizeRequestText(body.deliveryWindow) || 'Queued for eevolvv review',
      checkout_url: normalizeRequestText(body.checkoutUrl) || null,
      source: normalizeRequestText(body.source) || 'manual',
      owner: normalizeRequestText(body.owner) || 'eevolvv',
      visible_to_client: body.visibleToClient !== false,
      linked_task_id: normalizeRequestText(body.linkedTaskId) || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('activity_log').insert({
    client_id: client.id,
    actor: email ?? 'system',
    action: 'client_deliverable_created',
    meta: { deliverable_id: data.id, key, title, status, type },
  })

  return NextResponse.json({ client, deliverable: data }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import {
  canAccessClientAgentPage,
  getClientAgentPage,
  normalizeEmail,
} from '@/lib/client-agent-pages'
import { findOrCreateClientForAgentPage, normalizeRequestText } from '@/lib/client-agent-server'
import { requestToDeliverableTemplate } from '@/lib/deliverables'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const page = getClientAgentPage(params.slug)
  if (!page) return NextResponse.json({ error: 'Client page not found' }, { status: 404 })

  const email = session.user?.email
  if (!canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { client, error: clientError } = await findOrCreateClientForAgentPage(page)
  if (clientError || !client) {
    return NextResponse.json({ error: clientError ?? 'Client unavailable' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('service_tasks')
    .select('id, title, description, status, priority, due_date, created_at, updated_at')
    .eq('client_id', client.id)
    .ilike('description', '%CLIENT_AGENT_REQUEST%')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ client, requests: data ?? [] })
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
  if (!canAccessClientAgentPage(email, page.slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const commandLabel = normalizeRequestText(body.commandLabel) || 'Agent request'
  const request = normalizeRequestText(body.request)

  if (request.length < 8) {
    return NextResponse.json({ error: 'Request is too short' }, { status: 400 })
  }

  const { client, error: clientError } = await findOrCreateClientForAgentPage(page)
  if (clientError || !client) {
    return NextResponse.json({ error: clientError ?? 'Client unavailable' }, { status: 500 })
  }

  const submittedBy = normalizeEmail(email)
  const description = [
    'CLIENT_AGENT_REQUEST',
    `Client: ${page.company}`,
    `Agent: ${page.agentName}`,
    `Command: ${commandLabel}`,
    `Submitted by: ${submittedBy}`,
    '',
    'Request:',
    request,
    '',
    'Delivery rule:',
    'Turn this into a visible Ghost Locker deliverable with scope, status, proof, and next action.',
  ].join('\n')

  const { data: task, error: taskError } = await supabase
    .from('service_tasks')
    .insert({
      client_id: client.id,
      title: `${commandLabel} — ${page.company}`,
      description,
      status: 'todo',
      priority: 'high',
    })
    .select()
    .single()

  if (taskError) return NextResponse.json({ error: taskError.message }, { status: 500 })

  let deliverable = null
  const deliverableTemplate = requestToDeliverableTemplate({ commandLabel, request })
  const { data: deliverableData, error: deliverableError } = await supabase
    .from('client_deliverables')
    .insert({
      client_id: client.id,
      client_slug: page.slug,
      key: deliverableTemplate.key,
      type: deliverableTemplate.type,
      title: deliverableTemplate.title,
      price: deliverableTemplate.price ?? null,
      status: deliverableTemplate.status,
      promise: deliverableTemplate.promise,
      scope: deliverableTemplate.scope,
      proof: deliverableTemplate.proof,
      delivery_window: deliverableTemplate.deliveryWindow,
      checkout_url: deliverableTemplate.checkoutUrl ?? null,
      source: 'request',
      owner: 'eevolvv',
      visible_to_client: true,
      linked_task_id: task.id,
    })
    .select()
    .maybeSingle()

  if (!deliverableError) {
    deliverable = deliverableData
  } else {
    console.warn('[client-agent/request] deliverable insert skipped:', deliverableError.message)
  }

  await supabase.from('activity_log').insert({
    client_id: client.id,
    actor: submittedBy || page.company,
    action: 'client_agent_request_submitted',
    meta: {
      slug: page.slug,
      commandLabel,
      request,
      task_id: task.id,
      deliverable_id: deliverable?.id ?? null,
    },
  })

  return NextResponse.json({ client, request: task, deliverable }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { AdminOnboardingAlert } from '@/emails/AdminOnboardingAlert'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { token } = params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate token
  const { data: tokenRow, error: tokenErr } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (tokenErr || !tokenRow) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  if (tokenRow.status === 'completed') {
    return NextResponse.json({ error: 'Onboarding already completed' }, { status: 409 })
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 })
  }

  const clientId = tokenRow.client_id

  // Save responses and mark completed
  const now = new Date().toISOString()
  const { error: updateErr } = await supabase
    .from('onboarding_tokens')
    .update({ responses: body, status: 'completed', completed_at: now })
    .eq('id', tokenRow.id)

  if (updateErr) {
    console.error('[onboard] token update error:', updateErr.message)
    return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 })
  }

  // Update client record with business info
  await supabase
    .from('clients')
    .update({
      name: (body.businessName as string) || undefined,
      notes: JSON.stringify(body),
    })
    .eq('id', clientId)

  // Check if build already exists for this client
  const { data: existingBuild } = await supabase
    .from('builds')
    .select('id')
    .eq('client_id', clientId)
    .eq('status', 'queued')
    .maybeSingle()

  if (!existingBuild) {
    // T06 creates the build record; if missing, create it here
    const { data: clientData } = await supabase
      .from('clients')
      .select('tier')
      .eq('id', clientId)
      .single()

    await supabase.from('builds').insert({
      client_id: clientId,
      tier: clientData?.tier ?? 'seed',
      status: 'queued',
    })
  }

  // Send admin notification for fitness onboarding
  ;(async () => {
    try {
      // Fetch client info for notification
      const { data: clientData } = await supabase!
        .from('clients')
        .select('name, tier, industry')
        .eq('id', clientId)
        .single()

      if (clientData?.industry === 'Fitness / Gym / Studio' && resend) {
        const formBody = body as Record<string, string>
        const gymSoftware = formBody.gymSoftware || '—'
        const credentialsPresent = !!(formBody.softwareUsername && formBody.softwarePassword)
        const memberCount = formBody.memberCount || ''
        const monthlyChurnRate = formBody.monthlyChurnRate || ''
        const clientName = clientData.name || (formBody.businessName as string) || 'Unknown'
        const businessName = (formBody.businessName as string) || '—'
        const tier = clientData.tier || 'seed'

        const html = await render(AdminOnboardingAlert({
          clientName,
          businessName,
          vertical: 'Fitness / Gym / Studio',
          gymSoftware,
          credentialsPresent,
          memberCount,
          monthlyChurnRate,
          tier,
        }))

        const { error: adminErr } = await resend.emails.send({
          from: FROM_EMAIL,
          to: 'hello@eevolvv.com',
          subject: `[Onboarding] ${clientName} — Fitness — ${gymSoftware}`,
          html,
        })

        if (adminErr) console.error('[onboard] admin notification error:', adminErr)
      }
    } catch (err) {
      console.error('[onboard] admin notification unexpected error:', err)
    }
  })()

  return NextResponse.json({ success: true })
}

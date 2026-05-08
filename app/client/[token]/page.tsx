import { supabase } from '@/lib/supabase'
import { ClientDashboard } from './ClientDashboard'

interface PageProps {
  params: { token: string }
}

export default async function ClientPortalPage({ params }: PageProps) {
  const { token } = params

  if (!supabase) {
    return <ErrorState message="Service temporarily unavailable. Contact hello@eevolvv.com." />
  }

  // Validate token (same token used for onboarding)
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return <ErrorState message="This portal link is invalid. Contact hello@eevolvv.com." />
  }

  const clientId = tokenRow.client_id

  // Update last portal visit (non-blocking — fire and forget)
  supabase
    .from('clients')
    .update({ last_portal_visit_at: new Date().toISOString() })
    .eq('id', clientId)
    .then()

  // Fetch client data in parallel
  const [clientResult, subscriptionResult, buildsResult] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, email, tier')
      .eq('id', clientId)
      .single(),
    supabase
      .from('subscriptions')
      .select('id, status, billing_interval, current_period_end, cancel_at_period_end, stripe_price_id')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('builds')
      .select('id, tier, status, assigned_to, build_url, notes, created_at, started_at, completed_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const client = clientResult.data
  const subscription = subscriptionResult.data
  const builds = buildsResult.data ?? []
  const latestBuild = builds[0] ?? null

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              className="mono"
              style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 8, fontWeight: 600 }}
            >
              EEVOLVV · CLIENT PORTAL
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              {client?.name ?? 'Your Portal'}
            </h1>
            <div style={{ fontSize: 13, opacity: 0.5 }}>{client?.email}</div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)', opacity: 0.7 }}>
            {(client?.tier ?? 'seed').toUpperCase()} PLAN
          </div>
        </div>

        <ClientDashboard
          token={token}
          client={client}
          subscription={subscription}
          latestBuild={latestBuild}
          builds={builds}
        />
      </div>
    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div
          className="mono"
          style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}
        >
          EEVOLVV
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px' }}>Portal unavailable</h1>
        <p style={{ opacity: 0.65, lineHeight: 1.6 }}>{message}</p>
      </div>
    </main>
  )
}

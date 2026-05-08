import { supabase } from '@/lib/supabase'
import { OnboardingForm } from './OnboardingForm'

interface PageProps {
  params: { token: string }
}

export default async function OnboardingPage({ params }: PageProps) {
  const { token } = params

  if (!supabase) {
    return <ErrorState message="Service temporarily unavailable. Please try again or contact hello@eevolvv.com." />
  }

  // Validate token
  const { data: tokenRow } = await supabase
    .from('onboarding_tokens')
    .select('id, client_id, status, expires_at, responses')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow) {
    return <ErrorState message="This onboarding link is invalid or has expired. Please contact hello@eevolvv.com to get a new link." />
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return <ErrorState message="This onboarding link has expired (30-day limit). Please contact hello@eevolvv.com to get a new link." />
  }

  if (tokenRow.status === 'completed') {
    return <CompletedState />
  }

  // Fetch client info for tier-aware form
  const { data: client } = await supabase
    .from('clients')
    .select('name, email, tier')
    .eq('id', tokenRow.client_id)
    .single()

  const tier = (client?.tier as 'seed' | 'core' | 'evolve') ?? 'seed'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 12, fontWeight: 600 }}>
            EEVOLVV · ONBOARDING
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--ink)' }}>
            Let&apos;s build your {tierLabel}.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.65, margin: 0, lineHeight: 1.5 }}>
            5 minutes of your time. Your build SLA starts when you submit.
          </p>
        </div>
        <OnboardingForm
          token={token}
          clientId={tokenRow.client_id}
          tier={tier}
          defaultName={client?.name ?? ''}
        />
      </div>
    </main>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>EEVOLVV</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px', color: 'var(--ink)' }}>Link unavailable</h1>
        <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6, margin: '0 0 24px' }}>{message}</p>
        <a href="mailto:hello@eevolvv.com" style={{ color: 'var(--accent)', fontSize: 14 }}>hello@eevolvv.com</a>
      </div>
    </main>
  )
}

function CompletedState() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent)', marginBottom: 16 }}>EEVOLVV</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 16px', color: 'var(--ink)' }}>Onboarding complete.</h1>
        <p style={{ fontSize: 15, opacity: 0.65, lineHeight: 1.6 }}>
          You&apos;ve already completed onboarding. Your build is in the queue. Watch for an email when work begins.
        </p>
      </div>
    </main>
  )
}

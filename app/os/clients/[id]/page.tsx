import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CLIENT_AGENT_PAGES } from '@/lib/client-agent-pages'
import ClientWorkspace from './ClientWorkspace'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function ClientPage({ params }: { params: { id: string } }) {
  if (!supabase) notFound()

  const [clientRes, submissionsRes] = await Promise.all([
    supabase.from('clients').select('*, agents(*), service_tasks(*), activity_log(*)').eq('id', params.id).single(),
    supabase.from('submissions').select('id, name, email, business_name, business_type, tier, created_at').order('created_at', { ascending: false }).limit(50),
  ])

  if (clientRes.error || !clientRes.data) notFound()

  // Match to a client agent page by company name (case-insensitive)
  const company = clientRes.data.company ?? clientRes.data.name ?? ''
  const agentPage = CLIENT_AGENT_PAGES.find(
    p => p.company.toLowerCase() === company.toLowerCase()
  )

  return (
    <ClientWorkspace
      client={clientRes.data}
      allSubmissions={submissionsRes.data ?? []}
      agentPageSlug={agentPage?.slug}
    />
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClientAgentPage } from '@/components/ClientAgentPage'
import { getClientAgentPage } from '@/data/clientAgentPages'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PublicClientAgentPage({ params }: { params: { clientSlug: string } }) {
  const client = getClientAgentPage(params.clientSlug)
  if (!client) notFound()

  return <ClientAgentPage client={client} />
}

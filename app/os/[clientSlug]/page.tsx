import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ClientAgentPage } from '@/components/ClientAgentPage'
import { getClientAgentPage } from '@/data/clientAgentPages'
import { auth } from '@/lib/auth'

const OWNER_EMAILS = ['hello@eevolvv.com', 'eduardocbarbosa1998@gmail.com']

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

function canViewClientPage(email: string | null | undefined, allowedEmails: string[]) {
  if (!email) return false
  const normalized = email.toLowerCase()
  return [...OWNER_EMAILS, ...allowedEmails].some(allowed => allowed.toLowerCase() === normalized)
}

export default async function PublicClientAgentPage({ params }: { params: { clientSlug: string } }) {
  const client = getClientAgentPage(params.clientSlug)
  if (!client) notFound()

  const session = await auth()
  if (!session) redirect(`/signin?callbackUrl=/os/${params.clientSlug}`)
  if (!canViewClientPage(session.user?.email, client.allowedEmails)) redirect(`/signin?callbackUrl=/os/${params.clientSlug}&error=AccessDenied`)

  return <ClientAgentPage client={client} />
}

import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ClientAgentPage } from '@/components/ClientAgentPage'
import { canAccessClientAgentPage, getClientAgentPage } from '@/lib/client-agent-pages'

export default async function ClientAgentRoute({
  params,
}: {
  params: { clientSlug: string }
}) {
  const page = getClientAgentPage(params.clientSlug)
  if (!page) notFound()

  const session = await auth()
  const email = session?.user?.email

  if (!email) {
    redirect(`/signin?callbackUrl=/os/${page.slug}`)
  }

  if (!canAccessClientAgentPage(email, page.slug)) {
    redirect('/signin?error=AccessDenied')
  }

  return <ClientAgentPage page={page} />
}

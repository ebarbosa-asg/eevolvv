import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ClientAgentPage } from '@/components/ClientAgentPage'
import { ClientHub } from '@/components/portal-v2/ClientHub'
import { canAccessClientAgentPage, getClientAgentPage } from '@/lib/client-agent-pages'
import { getPlanForClient } from '@/lib/client-agent-pages'

export default async function ClientAgentRoute({
  params,
  searchParams,
}: {
  params: { clientSlug: string }
  searchParams: { v?: string; tab?: string }
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

  // Use v2 portal by default (add ?v=1 for old version)
  if (searchParams.v !== '1') {
    const plan = getPlanForClient(page)
    const hubData = {
      slug: page.slug,
      company: page.company,
      agentName: page.agentName,
      planName: plan.publicName,
      activeWork: page.activeWork.map(w => ({
        ...w,
        metric: w.deliverable?.split('.')[0] || w.proof?.split('.')[0] || '—',
        detail: w.deliverable,
        liveDate: w.stage === 'live' ? '—' : undefined,
        startedDate: w.stage === 'building' ? '—' : undefined,
      })),
      recommendations: page.recommendations,
      proofItems: page.proofItems,
      products: defaultProducts(page),
      paidAddOns: page.paidAddOns,
    }

    return <ClientHub page={hubData} initialTab={searchParams.tab} />
  }

  return <ClientAgentPage page={page} />
}

function defaultProducts(page: {
  products: Array<{ key: string; status: string; name: string; type: string }>
}) {
  const ownedSet = new Set(
    (page.products || [])
      .filter((p: { status: string }) => ['included', 'active', 'paid', 'queued'].includes(p.status))
      .map((p: { key: string }) => p.key)
  )

  const result: Record<string, { visits?: string; health?: number; url?: string; detail?: string; leads?: number; conversions?: string; cpa?: string }> = {}

  if (ownedSet.has('website')) {
    result.website = { visits: '—', health: 3, url: 'studio23roofing.com', detail: 'Website is live and accepting visitors.' }
  }
  if (ownedSet.has('sco-management') || ownedSet.has('ads')) {
    result.marketing = { conversions: '—', health: 2, detail: 'Marketing campaigns configured.' }
  }

  return result
}
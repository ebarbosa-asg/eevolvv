import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { Card, CardContent, KPIStat, SectionMarker } from '@/components/ds'
import { OSTopbar } from './components/OSTopbar'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export type Submission = {
  id: string
  name: string | null
  email: string
  business_name: string | null
  business_type: string
  tier: string | null
  status: string | null
  email_sent: boolean | null
  created_at: string
  report: string | null
}

export type GitHubCommit = {
  sha: string
  commit: {
    message: string
    author: { date: string }
  }
}

export default async function OSPage() {
  const session = await auth()
  if (!session) redirect('/signin?callbackUrl=/os')

  const cookieStore = cookies()
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const [tasks, financeData, clients, pipeline] = await Promise.all([
    fetch(`${baseUrl}/api/os/company-tasks`, { headers: { cookie: cookieHeader } })
      .then(r => r.ok ? r.json() : [])
      .catch(() => []),
    fetch(`${baseUrl}/api/os/finance`, { headers: { cookie: cookieHeader } })
      .then(r => r.ok ? r.json() : { mrr: null })
      .catch(() => ({ mrr: null })),
    fetch(`${baseUrl}/api/os/clients`, { headers: { cookie: cookieHeader } })
      .then(r => r.ok ? r.json() : [])
      .catch(() => []),
    fetch(`${baseUrl}/api/os/pipeline`, { headers: { cookie: cookieHeader } })
      .then(r => r.ok ? r.json() : [])
      .catch(() => []),
  ])

  const openTaskCount = Array.isArray(tasks)
    ? tasks.filter((t: { status: string }) => t.status !== 'done').length
    : 0
  const clientCount = Array.isArray(clients) ? clients.length : 0
  const pipelineValue = Array.isArray(pipeline)
    ? '$' + pipeline
        .filter((d: { stage: string; value?: number }) => d.stage !== 'lost')
        .reduce((s: number, d: { value?: number }) => s + (d.value ?? 0), 0)
        .toLocaleString()
    : '$0'
  const mrr = (financeData as { mrr?: string | null })?.mrr ?? '—'

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="OVERVIEW" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <SectionMarker num="00" label="OVERVIEW" className="mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <KPIStat value={openTaskCount} label="OPEN TASKS" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat value={mrr} label="MRR" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat value={clientCount} label="ACTIVE CLIENTS" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <KPIStat value={pipelineValue} label="PIPELINE" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

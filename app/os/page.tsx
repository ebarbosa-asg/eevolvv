import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import HubClient from './HubClient'

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

  let submissions: Submission[] = []
  if (supabase) {
    const { data } = await supabase
      .from('submissions')
      .select('id, name, email, business_name, business_type, tier, status, email_sent, created_at, report')
      .order('created_at', { ascending: false })
      .limit(20)
    submissions = (data as Submission[]) ?? []
  }

  let commits: GitHubCommit[] = []
  try {
    const ghRes = await fetch(
      'https://api.github.com/repos/ebarbosa-asg/eevolvv/commits?per_page=3',
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN ?? ''}`,
          'User-Agent': 'eevolvv-os',
        },
        next: { revalidate: 300 },
      }
    )
    if (ghRes.ok) commits = (await ghRes.json()) as GitHubCommit[]
  } catch {
    // graceful fallback
  }

  return <HubClient submissions={submissions} commits={commits} />
}

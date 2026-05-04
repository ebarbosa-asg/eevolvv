import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { Submission } from '../page'
import FeedClient from './FeedClient'

export default async function FeedPage() {
  const session = await auth()
  if (!session) redirect('/signin?callbackUrl=/os/feed')

  let submissions: Submission[] = []
  if (supabase) {
    const { data } = await supabase
      .from('submissions')
      .select('id, name, email, business_name, business_type, tier, status, email_sent, created_at, report')
      .order('created_at', { ascending: false })
      .limit(20)
    submissions = (data as Submission[]) ?? []
  }

  return <FeedClient submissions={submissions} />
}

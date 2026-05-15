import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
// Service role key bypasses RLS (preferred for server-side).
// Falls back to anon key if service role key is not set — RLS handles security.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null

export interface SubmissionRow {
  name?: string
  email: string
  business_name?: string
  business_type: string
  industry?: string
  revenue?: string
  team_size?: string
  top_pains: string
  tools?: string
  customer_journey?: string
  error_points?: string
  hours_freed?: string
  tier?: string
  report?: string
  ip_address?: string
  status?: 'pending' | 'completed' | 'error'
  email_sent?: boolean
  duration_ms?: number
  // Lead scoring fields (migration 20260516000000)
  lead_score?: number | null
  lead_segment?: string | null
  recommended_tier?: string | null
  urgency?: string | null
  estimated_monthly_revenue?: number | null
  missed_revenue_estimate?: number | null
  tool_count?: number | null
  hours_wasted_per_week?: number | null
  // Source tracking
  referral_source?: string | null
  partner_id?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  landing_page?: string | null
}

export async function saveSubmission(data: SubmissionRow): Promise<string | null> {
  if (!supabase) {
    console.warn('[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — skipping persistence')
    return null
  }

  const { data: row, error } = await supabase
    .from('submissions')
    .insert(data)
    .select('id')
    .single()

  if (error) {
    console.error('[supabase] insert error:', error.message)
    return null
  }

  return row?.id ?? null
}

export async function markEmailSent(id: string): Promise<void> {
  if (!supabase || !id) return
  await supabase.from('submissions').update({ email_sent: true }).eq('id', id)
}

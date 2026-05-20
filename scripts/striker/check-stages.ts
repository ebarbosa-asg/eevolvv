import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  // Stage breakdown
  const { data: byStage } = await supabase.from('clients').select('stage')
  if (byStage) {
    const counts: Record<string, number> = {}
    byStage.forEach((r: any) => {
      counts[r.stage] = (counts[r.stage] || 0) + 1
    })
    console.log('Leads by stage:')
    Object.entries(counts).forEach(([s, c]) => console.log('  ${s}: ${c}'))
  }

  // Cold / contacted leads
  const { data: cold } = await supabase
    .from('clients')
    .select('id, company, email, stage, notes')
    .in('stage', ['cold', 'contacted'])
    .limit(20)
  console.log(`\nLeads in cold/contacted (${cold?.length || 0}):`)
  if (cold) cold.forEach((l: any) => console.log('  ${l.company} | ${l.stage} | ${l.email || "no email"}'))

  // Diagnose + email
  const { data: diagEmail } = await supabase
    .from('clients')
    .select('id, company, email, stage, notes')
    .eq('stage', 'diagnose')
    .not('email', 'is', null)
    .neq('email', '')
    .limit(20)
  console.log(`\nDiagnose stage with email (${diagEmail?.length || 0}):`)
  if (diagEmail) diagEmail.forEach((l: any) => console.log('  ${l.company} | ${l.email} | ${(l.notes || "").slice(0,40)}`))
}

main().catch(console.error)

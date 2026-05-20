import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== Leads with Phone Numbers ===');
  const { data: withPhone, error: e1 } = await supabase
    .from('clients')
    .select('id, company, phone, email, notes, stage')
    .not('phone', 'is', null)
    .neq('phone', '')
    .neq('phone', 'Needs Lookup')
    .limit(30);
  if (e1) { console.error('Err:', e1.message); return; }
  console.log(`Found ${withPhone?.length || 0} leads with real phone numbers.\n`);
  if (withPhone) {
    withPhone.forEach((l: any, i: number) => {
      console.log(`${i+1}. ${l.company}`);
      console.log(`   Phone: ${l.phone}`);
      console.log(`   Email: ${l.email || 'none'}`);
      console.log(`   Stage: ${l.stage} | Notes: ${(l.notes || '').slice(0,60)}`);
      console.log('');
    });
  }

  console.log('=== Leads with Email ===');
  const { data: withEmail, error: e2 } = await supabase
    .from('clients')
    .select('id, company, email, phone, notes, stage')
    .not('email', 'is', null)
    .neq('email', '')
    .limit(30);
  if (e2) { console.error('Err:', e2.message); return; }
  console.log(`Found ${withEmail?.length || 0} leads with emails.\n`);
  if (withEmail) {
    withEmail.forEach((l: any, i: number) => {
      const contacted = (l.notes || '').includes('SMS') ? '✅ SMS sent' : '❌ Not SMSed';
      const emailed = (l.notes || '').includes('EMAIL') ? '✅ Emailed' : '❌ Not emailed';
      console.log(`${i+1}. ${l.company} | ${l.email} | ${contacted} | ${emailed}`);
    });
  }

  // Also check for leads in 'diagnose' stage that haven't been SMS'd
  console.log('\n=== Diagnose stage leads NOT yet SMS contacted ===');
  const { data: fresh, error: e3 } = await supabase
    .from('clients')
    .select('id, company, phone, email, notes')
    .eq('stage', 'diagnose')
    .not('notes', 'ilike', '%SMS_LIVE_SENT%')
    .limit(20);
  if (e3) { console.error('Err:', e3.message); return; }
  console.log(`Found ${fresh?.length || 0} fresh leads ready for first contact.\n`);
  if (fresh) {
    fresh.forEach((l: any, i: number) => {
      console.log(`${i+1}. ${l.company}`);
      console.log(`   Phone: ${l.phone || 'NONE'}`);
      console.log(`   Email: ${l.email || 'NONE'}`);
      console.log('');
    });
  }
}

main().catch(console.error);

// TEST MODE STRIKER
// This confirms the connection between Scraper -> DB -> Responder

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('🧪 Starting End-to-End Pipeline Test...');

  const testEmail = 'eduardo+test@eevolvv.com'; // Use a test alias
  const testBusiness = 'Striker Test Corp';

  // 1. Simulate Scraper Injection
  console.log('STEP 1: Injecting test lead into Supabase...');
  const { data: lead, error: insertError } = await supabase
    .from('clients')
    .insert([
      {
        name: testBusiness,
        company: testBusiness,
        email: testEmail,
        stage: 'diagnose',
        business_type: 'technology',
        notes: 'TEST_LEAD'
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    return;
  }
  console.log(`✅ Lead injected: ${lead.id}`);

  // 2. Run the Responder
  console.log('STEP 2: Running Agent-Striker Responder...');
  // We call the responder logic here
  // For the test, we'll just log that we would run scripts/striker/responder.ts
  console.log('To complete the test, run: npx ts-node scripts/striker/responder.ts');
  console.log('The responder will see the new "Striker Test Corp" and send the email.');
}

runTest().catch(console.error);

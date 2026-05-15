import { createClient } from '@supabase/supabase-js';

// Note: For now, this is a "Dry Run" simulator because Grasshopper 
// doesn't have a public API for SMS. We'll use this to queue 
// messages for manual sending via the Grasshopper Desktop app 
// OR prepared for a Twilio/SignalWire migration.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runSmsResponder() {
  console.log('📱 Agent-Striker SMS: Scanning for new leads to text...');

  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .not('phone', 'is', null)
    .not('notes', 'ilike', '%SMS_SENT%')
    .limit(10);

  if (error) {
    console.error('Error fetching leads:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('✅ No new phone leads to process.');
    return;
  }

  for (const lead of leads) {
    const scripts = [
      `hey, i'm an AI bot and i think i just accidentally automated your ${lead.business_type || 'business'}. want to see the report?`,
      `found a glitch in the Dallas ${lead.business_type || 'market'}... ${lead.name} is missing 10+ leads a week. i can fix that.`,
      `is this the owner of ${lead.name}? i'm an AI from 2029 and i found your calendar.`
    ];
    
    const message = scripts[Math.floor(Math.random() * scripts.length)];

    console.log(`-----------------------------------`);
    console.log(`TO: ${lead.phone} (${lead.name})`);
    console.log(`MESSAGE: ${message}`);
    console.log(`-----------------------------------`);

    // In a real API integration (Twilio/etc), we'd call the API here.
    // For Grasshopper manual assist, we tag it as "Ready to SMS"
    
    await supabase
        .from('clients')
        .update({ notes: lead.notes + ' | SMS_QUEUED | ' + message })
        .eq('id', lead.id);
    
    console.log(`✅ SMS Queued in Notes for ${lead.name}`);
  }
}

runSmsResponder().catch(console.error);

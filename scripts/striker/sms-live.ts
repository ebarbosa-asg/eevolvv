import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

// Initialize Clients
const twilioClient = twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
  accountSid: process.env.TWILIO_ACCOUNT_SID
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CHANGE THIS: The phone number you bought in Twilio console
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER; 

async function runLiveSmsStriker() {
  console.log('📡 Agent-Striker LIVE: Executing cellular outreach...');

  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .not('phone', 'is', null)
    .not('notes', 'ilike', '%SMS_LIVE_SENT%')
    .limit(5); // Small safety batch to start

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('✅ No new leads to text.');
    return;
  }

  for (const lead of leads) {
    // High-conversion "Escape" scripts
    const scripts = [
      `hey, i'm an AI bot and i think i just accidentally automated your ${lead.business_type || 'business'}. want to see the report?`,
      `found a glitch in the data... ${lead.name} is missing leads. i'm an AI from 2029 and i can fix it.`,
      `is this the owner of ${lead.name}? my bot found a leak in your calendar. - Eduardo @ eevolvv`
    ];
    
    const message = scripts[Math.floor(Math.random() * scripts.length)];

    try {
      console.log(`Sending to ${lead.name} (${lead.phone})...`);
      
      const response = await twilioClient.messages.create({
        body: message,
        from: FROM_NUMBER,
        to: lead.phone
      });

      console.log(`✅ SMS Sent! SID: ${response.sid}`);

      // Mark as LIVE contacted
      await supabase
          .from('clients')
          .update({ notes: `${lead.notes} | SMS_LIVE_SENT | ${new Date().toISOString()}` })
          .eq('id', lead.id);

    } catch (err) {
      console.error(`❌ Failed to send to ${lead.name}:`, err);
    }
  }
}

runLiveSmsStriker().catch(console.error);

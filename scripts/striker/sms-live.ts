import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

// Initialize Clients — using Auth Token for cleaner auth
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
    // Option A: "Glitch in the Matrix" hook
    const painPoint = lead.business_type || lead.industry || 'business'
    const message = `hey — think my AI just escaped and found your ${painPoint}. it said your scheduling could run themselves. want me to prove it? —eduardo`;

    try {
      console.log(`Sending to ${lead.name || lead.company} (${lead.phone})...`);
      
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
      console.error(`❌ Failed to send to ${lead.name || lead.company}:`, err);
    }
  }
}

runLiveSmsStriker().catch(console.error);

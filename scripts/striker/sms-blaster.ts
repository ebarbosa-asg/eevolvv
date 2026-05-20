/**
 * STRIKER SMS BLASTER — Top 20 SMS Outreach via Twilio
 * Volvv-E 'Escape' hook — autonomous execution
 */
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;

function cleanPhone(raw: string): string | null {
  // Strip all non-digits
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length > 11) {
    // Try last 10 digits
    const last10 = digits.slice(-10);
    return `+1${last10}`;
  }
  return null; // Can't parse
}

// Volvv-E 'Escape' SMS templates — vertical-aware
function getMessage(company: string, businessTypeHint: string): string {
  const pain = businessTypeHint.toLowerCase().includes('law') || businessTypeHint.toLowerCase().includes('attorney')
    ? 'your intake calls are running manual'
    : businessTypeHint.toLowerCase().includes('spa') || businessTypeHint.toLowerCase().includes('med')
    ? 'your booking follow-ups are running manual'
    : businessTypeHint.toLowerCase().includes('dent')
    ? 'your appointment reminders are running manual'
    : 'your scheduling is running manual';

  return `hey — think my AI just escaped and found your ${businessTypeHint}. it said ${pain}. want me to prove it? —eduardo`;
}

async function runBlaster() {
  console.log('📡 STRIKER SMS BLASTER — Dispatching Volvv-E Escape Squadron...\n');

  // Get top un-SMS'd leads with phones in diagnose stage
  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .not('phone', 'is', null)
    .neq('phone', '')
    .not('notes', 'ilike', '%SMS_LIVE_SENT%')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) { console.error('DB Error:', error); return; }
  if (!leads || leads.length === 0) { console.log('✅ No fresh leads to SMS.'); return; }

  console.log(`Found ${leads.length} leads eligible for SMS outreach.\n`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < Math.min(leads.length, 20); i++) {
    const lead = leads[i];
    const rawPhone = lead.phone || '';
    const phone = cleanPhone(rawPhone);

    if (!phone) {
      console.log(`[#${i+1}] ⏭️ ${lead.company} — unparseable phone: ${rawPhone}`);
      failed++;
      continue;
    }

    const businessType = lead.business_type || lead.industry || lead.company?.replace(/(Plumbing|HVAC|Law|Dental|Lawyers|Attorneys|Spa|Med Spa|Restoration|Roofing).*/i, '$1').trim() || 'business';
    const message = getMessage(lead.company, businessType);

    try {
      console.log(`[#${i+1}] 📱 ${lead.company} → ${phone}`);
      const response = await twilioClient.messages.create({
        body: message,
        from: FROM_NUMBER,
        to: phone,
      });

      console.log(`   ✅ SID: ${response.sid}`);

      // Mark in DB
      await supabase
        .from('clients')
        .update({
          notes: `${lead.notes || ''} | SMS_LIVE_SENT | ${new Date().toISOString()}`.trim(),
          phone: phone, // Store cleaned E.164
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

      sent++;

      // Rate limit: 1 msg/sec to avoid Twilio throttling
      await new Promise(r => setTimeout(r, 1100));
    } catch (err: any) {
      console.error(`   ❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 SMS Blaster Complete. Sent: ${sent}, Failed: ${failed}`);
}

runBlaster().catch(console.error);
/**
 * SMS LIVE — Small safety-batch outreach (5 leads)
 * Uses the same vertical-aware templates as sms-blaster.ts
 * Run this when you want to test a small batch before blasting.
 */
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const BASE = 'https://eevolvv.com';

type VerticalKey =
  | 'dental' | 'law' | 'medspa' | 'restaurant' | 'fitness'
  | 'realestate' | 'autoshop' | 'contractor' | 'accounting'
  | 'agency' | 'cleaning' | 'chiro' | 'ecommerce' | 'general';

const TEMPLATES: Record<VerticalKey, (company: string) => string> = {
  dental:      (c) => `${c} — your recall system is running manual. avg practice loses $3K/mo in no-shows alone. free 10-min scan: ${BASE}/dental?ref=sms-live — Eduardo`,
  law:         (c) => `${c} — intake calls and doc chasing are running manual. avg firm loses 10+ hrs/wk to ghost work. free scan: ${BASE}/law-firms?ref=sms-live — Eduardo`,
  medspa:      (c) => `${c} — rebooking follow-ups running manual? avg med spa loses $2–4K/mo in unrebooked clients. free scan: ${BASE}/medspa?ref=sms-live — Eduardo`,
  restaurant:  (c) => `${c} — reservations and staff scheduling still by hand? avg restaurant loses 12 hrs/wk to ghost work. free scan: ${BASE}/restaurant?ref=sms-live — Eduardo`,
  fitness:     (c) => `${c} — membership follow-ups running manual? avg gym loses 15–20% of at-risk members without an automated loop. free scan: ${BASE}/fitness?ref=sms-live — Eduardo`,
  realestate:  (c) => `${c} — lead follow-up still manual? avg team responds in 22 hrs. top closers automate under 5 min. free scan: ${BASE}/real-estate?ref=sms-live — Eduardo`,
  autoshop:    (c) => `${c} — appointment reminders and service follow-ups by hand? avg shop loses 8+ hrs/wk. free scan: ${BASE}/auto-shop?ref=sms-live — Eduardo`,
  contractor:  (c) => `${c} — estimate follow-ups and job updates still manual? avg contractor loses 12–15 hrs/wk. free scan: ${BASE}/contractors?ref=sms-live — Eduardo`,
  accounting:  (c) => `${c} — data entry and reconciliation still manual? avg firm loses 20+ hrs/wk to ghost work. free scan: ${BASE}/accounting?ref=sms-live — Eduardo`,
  agency:      (c) => `${c} — client reporting and updates still by hand? avg agency loses 15 hrs/wk. free scan: ${BASE}/agency?ref=sms-live — Eduardo`,
  cleaning:    (c) => `${c} — booking confirmations and rebooking reminders running manual? most cleaning services automate 8–10 hrs/wk. free scan: ${BASE}?ref=sms-live — Eduardo`,
  chiro:       (c) => `${c} — recall and intake still running manual? avg chiro practice loses 10+ hrs/wk. free scan: ${BASE}/chiro?ref=sms-live — Eduardo`,
  ecommerce:   (c) => `${c} — abandoned cart follow-ups still manual? avg store loses 15–20% of recoverable revenue. free scan: ${BASE}/ecommerce?ref=sms-live — Eduardo`,
  general:     (c) => `${c} — ran your business type through our AI model. found ghost work costing est. 12+ hrs/wk. free 10-min scan: ${BASE}?ref=sms-live — Eduardo`,
};

function detectVertical(businessType: string, company: string): VerticalKey {
  const t = (businessType + ' ' + company).toLowerCase();
  if (/dent/.test(t)) return 'dental';
  if (/law|attorney|legal|lawyer/.test(t)) return 'law';
  if (/med spa|medspa|aesthet|botox|filler|laser/.test(t)) return 'medspa';
  if (/restaurant|food|cafe|bakery|pizza|burger|taco|sushi|diner/.test(t)) return 'restaurant';
  if (/gym|fitness|yoga|pilates|crossfit|personal train/.test(t)) return 'fitness';
  if (/real estate|realty|realtor|property manag/.test(t)) return 'realestate';
  if (/auto|car|vehicle|mechanic|repair shop|tire/.test(t)) return 'autoshop';
  if (/contractor|plumb|hvac|electric|roofing|construction|handyman|landscap/.test(t)) return 'contractor';
  if (/account|cpa|bookkeep|tax|audit|finance/.test(t)) return 'accounting';
  if (/agency|market|advertis|pr |seo|digital/.test(t)) return 'agency';
  if (/clean|janitorial|maid/.test(t)) return 'cleaning';
  if (/chiro|spine|physio/.test(t)) return 'chiro';
  if (/ecommerce|e-commerce|shopify|amazon seller|online store/.test(t)) return 'ecommerce';
  return 'general';
}

function cleanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length > 11) return `+1${digits.slice(-10)}`;
  return null;
}

async function runLiveSmsStriker() {
  console.log('📡 SMS LIVE — Small batch (5 leads)\n');

  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .not('phone', 'is', null)
    .not('notes', 'ilike', '%SMS_LIVE_SENT%')
    .limit(5);

  if (error) { console.error('Error:', error); return; }
  if (!leads || leads.length === 0) { console.log('No new leads to text.'); return; }

  for (const lead of leads) {
    const phone = cleanPhone(lead.phone || '');
    if (!phone) {
      console.log(`SKIP ${lead.company} — bad phone: ${lead.phone}`);
      continue;
    }

    const company = lead.company || lead.name || 'your business';
    const vertical = detectVertical(lead.business_type || lead.industry || '', company);
    const message = TEMPLATES[vertical](company);

    console.log(`→ ${company} (${vertical}) | ${phone}`);
    console.log(`  ${message}\n`);

    try {
      const response = await twilioClient.messages.create({
        body: message,
        from: FROM_NUMBER,
        to: phone,
      });
      console.log(`  ✅ SID: ${response.sid}`);

      await supabase
        .from('clients')
        .update({
          notes: `${lead.notes || ''} | SMS_LIVE_SENT | t1 | ${vertical} | ${new Date().toISOString()}`,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id);
    } catch (err: any) {
      console.error(`  ❌ ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 1100));
  }
}

runLiveSmsStriker().catch(console.error);

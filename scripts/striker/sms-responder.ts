/**
 * SMS RESPONDER — Touch 2 follow-up for leads that were SMS'd but haven't replied or clicked
 * Targets: SMS_LIVE_SENT in notes, no reply, no email open
 * Run 3–4 days after sms-blaster.ts
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

const TOUCH2: Record<VerticalKey, (company: string) => string> = {
  dental:      (c) => `${c} — following up. the no-show and recall fix usually recovers $2–4K/mo in the first 30 days. takes 10 min: ${BASE}/dental?ref=sms2 — Eduardo`,
  law:         (c) => `${c} — still think about that intake ghost work. most firms automate it in week two. free scan: ${BASE}/law-firms?ref=sms2 — Eduardo`,
  medspa:      (c) => `${c} — the rebooking leak is fixable in one workflow. takes 10 min to see the numbers: ${BASE}/medspa?ref=sms2 — Eduardo`,
  restaurant:  (c) => `${c} — quick follow-up on the scheduling ghost work. free scan maps the fix in 10 min: ${BASE}/restaurant?ref=sms2 — Eduardo`,
  fitness:     (c) => `${c} — the retention loop fix is usually the first thing we build. free scan: ${BASE}/fitness?ref=sms2 — Eduardo`,
  realestate:  (c) => `${c} — the lead response gap costs more than any single deal. free scan: ${BASE}/real-estate?ref=sms2 — Eduardo`,
  autoshop:    (c) => `${c} — following up. the reminder + follow-up automation is usually live in week one. free scan: ${BASE}/auto-shop?ref=sms2 — Eduardo`,
  contractor:  (c) => `${c} — the estimate follow-up loop alone usually closes 20% more jobs. free scan: ${BASE}/contractors?ref=sms2 — Eduardo`,
  accounting:  (c) => `${c} — following up on the reconciliation ghost work. free scan shows the fix: ${BASE}/accounting?ref=sms2 — Eduardo`,
  agency:      (c) => `${c} — the reporting ghost work is usually the first automation. free scan: ${BASE}/agency?ref=sms2 — Eduardo`,
  cleaning:    (c) => `${c} — the rebooking automation usually pays for itself in month one. free scan: ${BASE}?ref=sms2 — Eduardo`,
  chiro:       (c) => `${c} — following up. the recall automation usually recovers 15% of lapsed patients. free scan: ${BASE}/chiro?ref=sms2 — Eduardo`,
  ecommerce:   (c) => `${c} — the abandoned cart loop is usually live in day one. free scan: ${BASE}/ecommerce?ref=sms2 — Eduardo`,
  general:     (c) => `${c} — quick follow-up. the scan takes 10 min and shows exactly where the ghost work is hiding: ${BASE}?ref=sms2 — Eduardo`,
};

function detectVertical(notes: string, businessType: string, company: string): VerticalKey {
  // Try to recover vertical from the touch-1 note tag first
  const noteMatch = notes.match(/\| t1 \| (\w+) \|/);
  if (noteMatch) return noteMatch[1] as VerticalKey;

  const t = (businessType + ' ' + company).toLowerCase();
  if (/dent/.test(t)) return 'dental';
  if (/law|attorney|legal|lawyer/.test(t)) return 'law';
  if (/med spa|medspa|aesthet|botox/.test(t)) return 'medspa';
  if (/restaurant|food|cafe|bakery|pizza/.test(t)) return 'restaurant';
  if (/gym|fitness|yoga|pilates/.test(t)) return 'fitness';
  if (/real estate|realty|realtor/.test(t)) return 'realestate';
  if (/auto|car|mechanic|tire/.test(t)) return 'autoshop';
  if (/contractor|plumb|hvac|roofing/.test(t)) return 'contractor';
  if (/account|cpa|bookkeep|tax/.test(t)) return 'accounting';
  if (/agency|market|advertis|seo/.test(t)) return 'agency';
  if (/clean|janitorial/.test(t)) return 'cleaning';
  if (/chiro|physio/.test(t)) return 'chiro';
  if (/ecommerce|shopify/.test(t)) return 'ecommerce';
  return 'general';
}

function cleanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length > 11) return `+1${digits.slice(-10)}`;
  return null;
}

async function runResponder() {
  console.log('📡 SMS RESPONDER — Touch 2 follow-ups\n');

  // Touch 2 targets: SMS'd at touch 1, not yet touch 2'd, no reply recorded
  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .not('phone', 'is', null)
    .neq('phone', '')
    .ilike('notes', '%SMS_LIVE_SENT%')
    .not('notes', 'ilike', '%SMS_T2_SENT%')
    .in('stage', ['diagnose', 'contacted'])
    .limit(20);

  if (error) { console.error('DB Error:', error); return; }
  if (!leads || leads.length === 0) { console.log('No touch-2 candidates found.'); return; }

  console.log(`Found ${leads.length} touch-2 candidates.\n`);

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const phone = cleanPhone(lead.phone || '');
    if (!phone) {
      console.log(`SKIP ${lead.company} — bad phone`);
      failed++;
      continue;
    }

    const company = lead.company || lead.name || 'your business';
    const vertical = detectVertical(lead.notes || '', lead.business_type || '', company);
    const message = TOUCH2[vertical](company);

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
          notes: `${lead.notes || ''} | SMS_T2_SENT | ${new Date().toISOString()}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

      sent++;
      await new Promise(r => setTimeout(r, 1100));
    } catch (err: any) {
      console.error(`  ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Done. Sent: ${sent} | Failed: ${failed}`);
}

runResponder().catch(console.error);

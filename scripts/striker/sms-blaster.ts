/**
 * STRIKER SMS BLASTER — Vertical-aware cold outreach via Twilio
 * Touch 1: pain-specific hook → free diagnostic link
 */
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const BASE = 'https://eevolvv.com';

// ─── Vertical routing ──────────────────────────────────────────────────────

type VerticalKey =
  | 'dental'
  | 'law'
  | 'medspa'
  | 'restaurant'
  | 'fitness'
  | 'realestate'
  | 'autoshop'
  | 'contractor'
  | 'accounting'
  | 'agency'
  | 'cleaning'
  | 'chiro'
  | 'ecommerce'
  | 'general';

interface Template {
  path: string;   // eevolvv.com path
  touch1: (company: string) => string;
  touch2: (company: string) => string;
}

const TEMPLATES: Record<VerticalKey, Template> = {
  dental: {
    path: '/dental',
    touch1: (c) =>
      `${c} — your recall system is running manual. avg practice loses $3K/mo in no-shows alone. free 10-min scan: ${BASE}/dental?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — following up. the no-show and recall fix usually recovers $2–4K/mo in the first 30 days. takes 10 min: ${BASE}/dental?ref=sms2 — Eduardo`,
  },
  law: {
    path: '/law-firms',
    touch1: (c) =>
      `${c} — intake calls and doc chasing are running manual. avg firm loses 10+ hrs/wk to ghost work. free scan: ${BASE}/law-firms?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — still think about that intake ghost work. most firms automate it in week two. free scan: ${BASE}/law-firms?ref=sms2 — Eduardo`,
  },
  medspa: {
    path: '/medspa',
    touch1: (c) =>
      `${c} — rebooking follow-ups running manual? avg med spa loses $2–4K/mo in unrebooked clients. free scan: ${BASE}/medspa?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the rebooking leak is fixable in one workflow. takes 10 min to see the numbers: ${BASE}/medspa?ref=sms2 — Eduardo`,
  },
  restaurant: {
    path: '/restaurant',
    touch1: (c) =>
      `${c} — reservations and staff scheduling still by hand? avg restaurant loses 12 hrs/wk to ghost work. free scan: ${BASE}/restaurant?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — quick follow-up on the scheduling ghost work. free scan maps the fix in 10 min: ${BASE}/restaurant?ref=sms2 — Eduardo`,
  },
  fitness: {
    path: '/fitness',
    touch1: (c) =>
      `${c} — membership follow-ups running manual? avg gym loses 15–20% of at-risk members without an automated loop. free scan: ${BASE}/fitness?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the retention loop fix is usually the first thing we build. free scan: ${BASE}/fitness?ref=sms2 — Eduardo`,
  },
  realestate: {
    path: '/real-estate',
    touch1: (c) =>
      `${c} — lead follow-up still manual? avg team responds in 22 hrs. top closers automate under 5 min. free scan: ${BASE}/real-estate?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the lead response gap costs more than any single deal. free scan: ${BASE}/real-estate?ref=sms2 — Eduardo`,
  },
  autoshop: {
    path: '/auto-shop',
    touch1: (c) =>
      `${c} — appointment reminders and service follow-ups by hand? avg shop loses 8+ hrs/wk to ghost work. free scan: ${BASE}/auto-shop?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — following up. the reminder + follow-up automation is usually live in week one. free scan: ${BASE}/auto-shop?ref=sms2 — Eduardo`,
  },
  contractor: {
    path: '/contractors',
    touch1: (c) =>
      `${c} — estimate follow-ups and job updates still manual? avg contractor loses 12–15 hrs/wk to ghost work. free scan: ${BASE}/contractors?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the estimate follow-up loop alone usually closes 20% more jobs. free scan: ${BASE}/contractors?ref=sms2 — Eduardo`,
  },
  accounting: {
    path: '/accounting',
    touch1: (c) =>
      `${c} — data entry and reconciliation still manual? avg accounting firm loses 20+ hrs/wk to ghost work. free scan: ${BASE}/accounting?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — following up on the reconciliation ghost work. free scan shows the fix: ${BASE}/accounting?ref=sms2 — Eduardo`,
  },
  agency: {
    path: '/agency',
    touch1: (c) =>
      `${c} — client reporting and updates still by hand? avg agency loses 15 hrs/wk to ghost work. free scan: ${BASE}/agency?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the reporting ghost work is usually the first automation. free scan: ${BASE}/agency?ref=sms2 — Eduardo`,
  },
  cleaning: {
    path: '/cleaning',
    touch1: (c) =>
      `${c} — booking confirmations and rebooking reminders running manual? most cleaning services automate 8–10 hrs/wk. free scan: ${BASE}?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — quick follow-up. the rebooking automation usually pays for itself in month one. free scan: ${BASE}?ref=sms2 — Eduardo`,
  },
  chiro: {
    path: '/chiro',
    touch1: (c) =>
      `${c} — recall and intake still running manual? avg chiro practice loses 10+ hrs/wk to ghost work. free scan: ${BASE}/chiro?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — following up. the recall automation usually recovers 15% of lapsed patients. free scan: ${BASE}/chiro?ref=sms2 — Eduardo`,
  },
  ecommerce: {
    path: '/ecommerce',
    touch1: (c) =>
      `${c} — abandoned cart follow-ups and order updates still manual? avg store loses 15–20% of recoverable revenue. free scan: ${BASE}/ecommerce?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — the abandoned cart loop is usually live in day one. free scan: ${BASE}/ecommerce?ref=sms2 — Eduardo`,
  },
  general: {
    path: '',
    touch1: (c) =>
      `${c} — ran your business type through our AI model. found ghost work costing est. 12+ hrs/wk. free 10-min scan: ${BASE}?ref=sms — Eduardo`,
    touch2: (c) =>
      `${c} — quick follow-up. the scan takes 10 min and shows exactly where the ghost work is hiding: ${BASE}?ref=sms2 — Eduardo`,
  },
};

// ─── Vertical detection ────────────────────────────────────────────────────

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

// ─── Phone normalization ───────────────────────────────────────────────────

function cleanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length > 11) return `+1${digits.slice(-10)}`;
  return null;
}

// ─── Runner ────────────────────────────────────────────────────────────────

async function runBlaster() {
  console.log('📡 STRIKER SMS BLASTER — Touch 1 outreach\n');

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
  if (!leads || leads.length === 0) { console.log('No fresh leads to SMS.'); return; }

  console.log(`Found ${leads.length} eligible leads.\n`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < Math.min(leads.length, 20); i++) {
    const lead = leads[i];
    const phone = cleanPhone(lead.phone || '');

    if (!phone) {
      console.log(`[#${i + 1}] SKIP ${lead.company} — unparseable: ${lead.phone}`);
      failed++;
      continue;
    }

    const company = lead.company || lead.name || 'your business';
    const businessType = lead.business_type || lead.industry || '';
    const vertical = detectVertical(businessType, company);
    const message = TEMPLATES[vertical].touch1(company);

    console.log(`[#${i + 1}] → ${company} (${vertical}) → ${phone}`);
    console.log(`   MSG: ${message}\n`);

    try {
      const response = await twilioClient.messages.create({
        body: message,
        from: FROM_NUMBER,
        to: phone,
      });

      console.log(`   ✅ SID: ${response.sid}`);

      await supabase
        .from('clients')
        .update({
          notes: `${lead.notes || ''} | SMS_LIVE_SENT | t1 | ${vertical} | ${new Date().toISOString()}`.trim(),
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

      sent++;
      await new Promise(r => setTimeout(r, 1100));
    } catch (err: any) {
      console.error(`   ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Done. Sent: ${sent} | Failed: ${failed}`);
}

runBlaster().catch(console.error);

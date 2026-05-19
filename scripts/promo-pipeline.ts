#!/usr/bin/env node
// eevolvv Promo Pipeline — sends promo codes to aging leads
// Config — change these values
const PROMO_CONFIG = {
  minAgeDays: 3,            // Send promo after N days since submission
  promoCode: 'EEVOLVV50',   // Stripe promo/coupon code
  discountTerms: '50% off for 3 months',  // Human-readable discount description
  promoExpiryHours: 36,     // Promo code expires 36h after email sent
  fromEmail: 'eevolvv <hello@eevolvv.com>',
};

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RESEND_KEY = process.env.RESEND_API_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_KEY) {
  console.log('❌ Missing env vars. Need: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const resend = new Resend(RESEND_KEY);

async function main() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PROMO_CONFIG.minAgeDays);
  const cutoffIso = cutoff.toISOString();

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + PROMO_CONFIG.promoExpiryHours);
  const expiryStr = expiryDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  });

  // Find submissions older than minAgeDays
  const { data: leads, error } = await supabase
    .from('submissions')
    .select('id, name, email, business_name, business_type')
    .not('email', 'in', '(owl@eevolvv.com,status@eevolvv.com,test@example.com,test@test.com,t@t.com,explorer@example.com,eduardocbarbosa1998@gmail.com)')
    .lte('created_at', cutoffIso)
    .not('email', 'is', null);

  if (error) {
    console.log('❌ Query error:', error.message);
    process.exit(1);
  }

  if (!leads || leads.length === 0) {
    console.log('📭 No aging leads found. Next check tomorrow.');
    process.exit(0);
  }

  console.log(`📬 Found ${leads.length} aging leads to promote`);
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const name = lead.name || 'there';
    const business = lead.business_name || lead.business_type || 'your business';
    const reportUrl = `https://eevolvv.com/report/${lead.id}`;
    const buyUrl = `https://eevolvv.com/buy`;

    const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #141413;">Hey ${name.split(' ')[0]},</h1>
      <p style="font-size: 15px; color: #52525b; line-height: 1.6; margin-bottom: 20px;">Your Evolution Report for ${business} is still open. Here's a last-chance offer to start your agent:</p>
      <div style="background: #f5f5f0; border: 1px solid #141413; padding: 24px; margin-bottom: 24px; text-align: center;">
        <div style="font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #71717a; margin-bottom: 8px;">PROMO CODE — EXPIRES ${expiryStr}</div>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 0.1em; color: #141413; margin-bottom: 8px;">${PROMO_CONFIG.promoCode}</div>
        <div style="font-size: 13px; color: #52525b;">${PROMO_CONFIG.discountTerms}</div>
      </div>
      <p style="font-size: 14px; color: #52525b; line-height: 1.6; margin-bottom: 24px;">Use this code at checkout. Price locks in for the full three months — cancel anytime.</p>
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${buyUrl}" style="display: inline-block; background: #141413; color: #faf7f0; padding: 14px 32px; text-decoration: none; font-weight: 600; font-size: 13px;">CLAIM YOUR DISCOUNT →</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #a1a1aa;">
        <a href="${reportUrl}" style="color: #141413;">Review your report →</a>
      </p>
      <p style="font-size: 11px; color: #a1a1aa; margin-top: 24px; border-top: 1px solid #e4e4e7; padding-top: 12px;">eevolvv, Inc. — hello@eevolvv.com</p>
    </div>`;

    try {
      const { error: sendErr } = await resend.emails.send({
        from: PROMO_CONFIG.fromEmail,
        to: lead.email,
        subject: `Your promo code for ${business} — ${PROMO_CONFIG.discountTerms}`,
        html: html,
      });
      if (sendErr) {
        console.log(`❌ Failed ${lead.email}:`, sendErr.message);
        failed++;
      } else {
        console.log(`✅ Sent promo to ${lead.email} (${business})`);
        sent++;
      }
    } catch (e) {
      console.log(`❌ Error ${lead.email}:`, e instanceof Error ? e.message : String(e));
      failed++;
    }
  }

  console.log(`\n📊 Promo pipeline complete: ${sent} sent, ${failed} failed`);
}

main().catch(e => {
  console.error('Unexpected error:', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
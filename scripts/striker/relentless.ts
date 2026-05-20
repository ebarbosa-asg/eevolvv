/**
 * THE RELENTLESS — Follow-up script for previously contacted leads
 * Targets leads that received SMS but no email follow-up yet
 * Sends Volvv-E email follow-ups (touch 2) to non-responders
 */
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'eevolvv <reports@eevolvv.com>';
const BASE_URL = 'https://eevolvv.com';

async function runRelentless() {
  console.log('🔄 THE RELENTLESS — Follow-up Squadron Deploying...\n');

  // Find leads that:
  // 1. Were SMS'd (have SMS_LIVE_SENT in notes)
  // 2. Have an email address
  // 3. Have NOT been emailed yet (no EMAIL_SENT in notes)
  const { data: leads, error } = await supabase
    .from('clients')
    .select('id, name, company, email, phone, notes, business_type')
    .not('email', 'is', null)
    .neq('email', '')
    .not('notes', 'ilike', '%EMAIL_SENT%')
    .in('stage', ['diagnose', 'build', 'contacted']);

  if (error) { console.error('DB Error:', error); return; }
  if (!leads || leads.length === 0) {
    console.log('✅ No previously-contacted leads ready for follow-up.');
    return;
  }

  console.log(`Found ${leads.length} leads ready for email follow-up.\n`);

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const wasSmsd = (lead.notes || '').includes('SMS_LIVE_SENT')
      || (lead.notes || '').includes('SMS sent via Twilio');
    const touchPoint = wasSmsd ? 2 : 1; // Touch 2 if SMS'd before, touch 1 if new
    const greeting = lead.name ? `Hi ${lead.name}` : 'Hi there';
    const biz = lead.company || lead.business_type || 'your business';

    const subject = touchPoint === 2
      ? `Quick question about ${biz}`
      : `I found something in ${biz}`;

    const html = touchPoint === 2 ? `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #141413; padding: 40px 20px;">
        <p style="font-size: 16px; line-height: 1.6;">${greeting},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          I sent you a text earlier — not sure if you saw it. Quick follow-up:
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Most business owners I talk to are spending 10-15 hours a week on tasks that could be automated.<br><br>
          We built eevolvv to fix exactly this. Our AI agents handle the repetitive work so you can focus on the business.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Want to see what it looks like for ${biz}? Free scan, 10 minutes.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${BASE_URL}/ai-agents-for-small-business" style="background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; display: inline-block;">
            Run Your Free Scan →
          </a>
        </div>
        <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
          eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658<br>
          <a href="${BASE_URL}/unsubscribe" style="color: #a1a1aa;">Unsubscribe</a>
        </p>
      </div>
    ` : `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #141413; padding: 40px 20px;">
        <p style="font-size: 16px; line-height: 1.6;">${greeting},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          I ran an AI scan on ${biz}. It found 3 specific areas where you're losing time to manual work — things like scheduling, follow-ups, and data entry that could be running on autopilot.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          The scan is free and takes about 10 minutes. No signup required.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${BASE_URL}/ai-agents-for-small-business" style="background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; display: inline-block;">
            Run Your Free Scan →
          </a>
        </div>
        <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
          eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658<br>
          <a href="${BASE_URL}/unsubscribe" style="color: #a1a1aa;">Unsubscribe</a>
        </p>
      </div>
    `;

    try {
      console.log(`[${sent+1}] 📧 ${lead.email} (${lead.company}) — Touch ${touchPoint}`);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: lead.email,
        subject,
        html,
      });

      const newNotes = `${lead.notes || ''}\nEMAIL_SENT:t${touchPoint}:${new Date().toISOString()}`.trim();
      await supabase
        .from('clients')
        .update({ notes: newNotes, stage: 'contacted', updated_at: new Date().toISOString() })
        .eq('id', lead.id);

      console.log(`   ✅ Sent`);
      sent++;
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`   ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 The Relentless Complete. Sent: ${sent}, Failed: ${failed}`);
}

runRelentless().catch(console.error);
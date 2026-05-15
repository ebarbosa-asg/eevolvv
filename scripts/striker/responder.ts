import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Since we're running in a script, we'll send raw HTML generated via a helper 
// to avoid React/JSX issues in a standard ts-node environment.

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

function getHtmlTemplate(businessName: string, vertical: string, ownerName?: string) {
  const greeting = ownerName ? `Hi ${ownerName}` : 'Hi there';
  return `
    <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #333;">
      <h1 style="color: #000;">eevolvv</h1>
      <p>${greeting},</p>
      <p>We just completed a preliminary AI scan of <b>${businessName}</b>.</p>
      <p>Our system identified 3 specific areas where your operations can be automated to save roughly 10-15 hours of manual work per week.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://eevolvv.com/diagnostic" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 3px; display: inline-block;">
          View Your Free Diagnostic
        </a>
      </div>
      <p>I'd love to show you the results of the full scan. Do you have 5 minutes this week for a quick walkthrough?</p>
      <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
      <p style="color: #888; font-size: 12px;">eevolvv, Inc. · 16192 Coastal Highway, Lewes, DE 19958</p>
    </div>
  `;
}

async function runAutoResponder() {
  // 1. Fetch leads that are in 'diagnose' stage and haven't been emailed yet
  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .not('notes', 'ilike', '%CONTACTED%')
    .limit(10); // Process in batches

  if (error) {
    console.error('Error fetching leads:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('✅ No new leads to process.');
    return;
  }

  console.log(`Found ${leads.length} leads. Starting outreach...`);

  for (const lead of leads) {
    if (!lead.email) {
      console.log(`Skipping ${lead.name} (no email)`);
      continue;
    }

    try {
      console.log(`Sending outreach to ${lead.name} (${lead.email})...`);
      
      const subjectLines = [
        `i think my AI bot just escaped and found you`,
        `your manual dispatch is causing my AI physical pain`,
        `found a glitch in your ${lead.vertical || 'business'} ops`,
        `i'm from 2029 and your ${lead.vertical || 'business'} needs this`,
        `is this ${lead.name}? my bot found a leak in your calendar`
      ];
      const randomSubject = subjectLines[Math.floor(Math.random() * subjectLines.length)];

      const { data, error: sendError } = await resend.emails.send({
        from: 'Eduardo @ eevolvv <hello@eevolvv.com>',
        to: [lead.email],
        subject: randomSubject,
        html: getHtmlTemplate(lead.name, lead.vertical || 'business', lead.contact_name),
      });

      if (sendError) {
        console.error(`Failed to send to ${lead.email}:`, sendError);
        continue;
      }

      await supabase
        .from('clients')
        .update({ notes: lead.notes + ' | CONTACTED_' + new Date().toISOString() })
        .eq('id', lead.id);

      console.log(`✅ Message sent to ${lead.name}! ID: ${data?.id}`);

    } catch (err) {
      console.error(`Unexpected error processing ${lead.name}:`, err);
    }
  }
}

runAutoResponder().catch(console.error);

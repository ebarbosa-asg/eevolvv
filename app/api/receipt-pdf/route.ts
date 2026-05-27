import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'eevolvv <reports@eevolvv.com>';

function getReceiptHtml(
  businessName: string,
  businessType: string,
  annualGhostWorkCost: number,
  hoursLostPerWeek: number,
  recoveryPercentage: number
): string {
  return `
    <body style="background:#faf7f0;color:#141413;font-family:Space Grotesk,monospace,sans-serif;display:flex;justify-content:center;padding:20px">
      <div style="background:#f5f0e8;padding:30px;border-radius:8px;max-width:560px;width:100%">
        <div style="text-align:center;margin-bottom:30px">
          <div style="font-size:2em;font-weight:700;letter-spacing:-1px;color:#141413">eevolvv</div>
          <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#141413;opacity:0.5;margin-top:4px">ghost work receipt</div>
        </div>
        <div style="border:1px dashed #141413;padding:24px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px">
            <span style="opacity:0.55">Business:</span>
            <span style="font-weight:700">${businessName}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px">
            <span style="opacity:0.55">Type:</span>
            <span style="font-weight:700">${businessType}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-size:14px">
            <span style="opacity:0.55">Hours lost/week:</span>
            <span style="font-weight:700;font-family:JetBrains Mono,monospace">${Math.round(hoursLostPerWeek)}</span>
          </div>
          <div style="border-top:2px solid #141413;padding-top:16px">
            <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.5;margin-bottom:8px">Annual ghost work cost</div>
            <div style="font-size:2.5em;font-weight:700;font-family:JetBrains Mono,monospace">$${annualGhostWorkCost.toLocaleString()}</div>
          </div>
        </div>
        <div style="text-align:center;font-size:13px;opacity:0.55;margin-bottom:24px">
          ${recoveryPercentage}% of this is recoverable with AI automation.
        </div>
        <div style="text-align:center;padding:20px;border-top:1px dashed #141413">
          <p style="font-size:14px;margin-bottom:16px">Want to reduce this by ${recoveryPercentage}%?</p>
          <a href="https://eevolvv.com/diagnostic" style="display:inline-block;background:#141413;color:#faf7f0;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;font-size:14px">
            Start Free AI Diagnostic →
          </a>
        </div>
        <div style="text-align:center;margin-top:24px;font-size:11px;opacity:0.4;letter-spacing:0.2em">
          eevolvv.com · +1 (844) 433-8658
        </div>
      </div>
    </body>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, businessName, businessType, cost, hoursLostPerWeek } = body;

    if (!email || cost === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    // Save to Supabase
    await supabase
      .from('receipt_leads')
      .insert([{
        email,
        business_name: businessName || null,
        business_type: businessType || null,
        annual_ghost_work_cost: cost,
      }])
      .then(({ error }) => {
        if (error) console.error('Supabase insert error:', error);
      });

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Your Ghost Work Receipt — $${Number(cost).toLocaleString()}/yr lost to ghost work`,
      html: getReceiptHtml(
        businessName || 'Your Business',
        businessType || 'Business',
        cost,
        hoursLostPerWeek || 0,
        72
      ),
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
      return NextResponse.json({ success: false, message: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API handler error:', error);
    return NextResponse.json({ success: false, message: 'Unexpected error.' }, { status: 500 });
  }
}
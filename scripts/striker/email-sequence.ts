/**
 * STRIKER EMAIL FOLLOW-UP SEQUENCE
 * 
 * Multi-touch email outreach to scraped leads.
 * Run daily via cron. Sends Evolution Report samples to cold leads.
 * 
 * Usage: npx ts-node scripts/striker/email-sequence.ts
 */

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'eevolvv <reports@eevolvv.com>'
const BASE_URL = 'https://eevolvv.com'
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/hello-eevolvv'

// Email templates for each touch point
function getEmailTemplate(
  touchPoint: number,
  businessName: string,
  ownerName: string | null,
  businessType: string
): { subject: string; html: string } {
  const greeting = ownerName ? `Hi ${ownerName}` : 'Hi there'
  const biz = businessName || `your ${businessType}`

  switch (touchPoint) {
    case 1:
      return {
        subject: `I found something in ${biz}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #141413; padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6;">${greeting},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              I ran an AI scan on ${biz}. It found 3 specific areas where you're losing time to manual work — things like scheduling, follow-ups, and data entry that could be running on autopilot.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              The scan is free and takes about 10 minutes. No signup required.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${BASE_URL}/ai-agents-for-small-business" style="background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; display: inline-block; margin-bottom: 12px;">
                Run Your Free Scan →
              </a>
              <br>
              <a href="${CALENDLY_URL}" style="background: transparent; color: #141413; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border: 1px solid #141413; border-radius: 4px; display: inline-block;">
                Or Book a Quick Call
              </a>
            </div>
            <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
              eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658<br>
              <a href="${BASE_URL}/unsubscribe" style="color: #a1a1aa;">Unsubscribe</a>
            </p>
          </div>
        `,
      }

    case 2:
      return {
        subject: `Quick question about ${biz}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #141413; padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6;">${greeting},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              Most ${businessType} owners I talk to are spending 10-15 hours a week on tasks that could be automated — things like appointment reminders, invoice follow-ups, and customer check-ins.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We built eevolvv to fix exactly this. Our AI agents handle the repetitive work so you can focus on the business.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Want to see what it looks like for ${biz}? I can set up a free demo in 5 minutes.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${CALENDLY_URL}" style="background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; display: inline-block;">
                Book a 5-Min Demo →
              </a>
            </div>
            <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
              eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658<br>
              <a href="${BASE_URL}/unsubscribe" style="color: #a1a1aa;">Unsubscribe</a>
            </p>
          </div>
        `,
      }

    case 3:
      return {
        subject: `Last try — ${biz} automation`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #141413; padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6;">${greeting},</p>
            <p style="font-size: 16px; line-height: 1.6;">
              This is my last email about this. If now's not the time, no hard feelings.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              But if you've ever thought "there has to be a better way to run ${biz}" — there is. We automate the busywork so you don't have to.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Plans start at $499/mo. No contracts. Cancel anytime.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${BASE_URL}/pricing" style="background: #141413; color: #faf7f0; padding: 14px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; display: inline-block;">
                See Pricing →
              </a>
            </div>
            <p style="font-size: 14px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">
              eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658<br>
              <a href="${BASE_URL}/unsubscribe" style="color: #a1a1aa;">Unsubscribe</a>
            </p>
          </div>
        `,
      }

    default:
      return {
        subject: `eevolvv for ${biz}`,
        html: `<p>Check out eevolvv: ${BASE_URL}</p>`,
      }
  }
}

async function runEmailSequence() {
  console.log('[email-sequence] Starting multi-touch email outreach...')

  // Get leads that are in 'cold' or 'contacted' stage and haven't been emailed yet
  const { data: leads, error } = await supabase
    .from('clients')
    .select('id, email, name, company, business_type, stage, notes, created_at')
    .in('stage', ['cold', 'contacted'])
    .not('notes', 'ilike', '%EMAIL_SENT%')
    .limit(20)

  if (error) {
    console.error('[email-sequence] Error fetching leads:', error)
    return
  }

  if (!leads || leads.length === 0) {
    console.log('[email-sequence] No new leads to email.')
    return
  }

  console.log(`[email-sequence] Found ${leads.length} leads to email.`)

  let sent = 0
  let failed = 0

  for (const lead of leads) {
    if (!lead.email) {
      console.log(`[email-sequence] Skipping ${lead.name || lead.id} (no email)`)
      continue
    }

    // Determine touch point based on stage and previous emails
    const isContacted = lead.stage === 'contacted'
    const touchPoint = isContacted ? 2 : 1

    const { subject, html } = getEmailTemplate(
      touchPoint,
      lead.company || '',
      lead.name,
      lead.business_type || 'business'
    )

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: lead.email,
        subject,
        html,
      })

      // Mark as emailed
      const newNotes = `${lead.notes || ''}\nEMAIL_SENT:t${touchPoint}:${new Date().toISOString()}`.trim()
      await supabase
        .from('clients')
        .update({
          notes: newNotes,
          stage: 'contacted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id)

      console.log(`[email-sequence] ✅ Sent touch ${touchPoint} to ${lead.email}`)
      sent++

      // Rate limit: 2 emails per second (Resend free tier)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (err) {
      console.error(`[email-sequence] ❌ Failed to send to ${lead.email}:`, err)
      failed++
    }
  }

  console.log(`[email-sequence] Complete. Sent: ${sent}, Failed: ${failed}`)
}

runEmailSequence()
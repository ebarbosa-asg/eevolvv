import React from 'react'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { OnboardingEmail } from '@/emails/OnboardingEmail'
import { FollowUp1Email } from '@/emails/FollowUp1'
import { FollowUp2Email } from '@/emails/FollowUp2'
import { FollowUp3Email } from '@/emails/FollowUp3'
import { WinBackEmail } from '@/emails/WinBack'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'

type Tier = 'seed' | 'core' | 'evolve'
export type FollowUpSequence = 1 | 2 | 3

interface EmailResult {
  success: boolean
  error?: string
}

export async function sendWelcomeEmail({
  email,
  name,
  tier,
}: {
  email: string
  name?: string
  tier: Tier
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  try {
    const html = await render(WelcomeEmail({ name, tier }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to eevolvv — your ${tier.charAt(0).toUpperCase() + tier.slice(1)} build is confirmed`,
      html,
    })
    if (error) {
      console.error('[email-helpers] sendWelcomeEmail error:', error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendWelcomeEmail unexpected error:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendOnboardingEmail({
  email,
  name,
  tier,
  token,
}: {
  email: string
  name?: string
  tier: Tier
  token: string
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  try {
    const html = await render(OnboardingEmail({ name, tier, token }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Complete your onboarding — your ${tier.charAt(0).toUpperCase() + tier.slice(1)} build starts when you do`,
      html,
    })
    if (error) {
      console.error('[email-helpers] sendOnboardingEmail error:', error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendOnboardingEmail unexpected error:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendFollowUpEmail({
  email,
  name,
  businessName,
  sequence,
}: {
  email: string
  name?: string
  businessName?: string
  sequence: FollowUpSequence
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  const subjects: Record<FollowUpSequence, string> = {
    1: `Your eevolvv report${businessName ? ` for ${businessName}` : ''} — top 3 opportunities`,
    2: "Still thinking it over? Here's what eevolvv clients found",
    3: 'Last chance to lock in your eevolvv build',
  }

  const templates: Record<FollowUpSequence, React.ReactElement> = {
    1: React.createElement(FollowUp1Email, { name, businessName }),
    2: React.createElement(FollowUp2Email, { name, businessName }),
    3: React.createElement(FollowUp3Email, { name, businessName }),
  }

  try {
    const html = await render(templates[sequence])
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subjects[sequence],
      html,
    })
    if (error) {
      console.error(`[email-helpers] sendFollowUpEmail (seq ${sequence}) error:`, error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error(`[email-helpers] sendFollowUpEmail (seq ${sequence}) unexpected:`, err)
    return { success: false, error: String(err) }
  }
}

export async function sendWinBack({
  email,
  name,
  tier,
  periodEnd,
}: {
  email: string
  name?: string
  tier?: string
  periodEnd?: string
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  const tierLabel = tier ? ` ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : ''

  try {
    const html = await render(WinBackEmail({ name, tier, periodEnd }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Before you go — a message from E about your eevolvv${tierLabel} membership`,
      html,
    })
    if (error) {
      console.error('[email-helpers] sendWinBack error:', error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendWinBack unexpected error:', err)
    return { success: false, error: String(err) }
  }
}

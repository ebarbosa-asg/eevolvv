import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { OnboardingEmail } from '@/emails/OnboardingEmail'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'

type Tier = 'seed' | 'core' | 'evolve'

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

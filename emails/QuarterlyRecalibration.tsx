import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface QuarterlyRecalibrationProps {
  name?: string
  tier: string
  isEvolve: boolean
  calendlyUrl?: string
  recalibrationUrl?: string
  clientId?: string
}

export function QuarterlyRecalibrationEmail({
  name,
  tier,
  isEvolve,
  calendlyUrl,
  recalibrationUrl,
  clientId: _clientId,
}: QuarterlyRecalibrationProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  const ctaUrl = isEvolve
    ? (calendlyUrl ?? 'https://calendly.com/hello-eevolvv')
    : (recalibrationUrl ?? 'https://eevolvv.com/diagnostic')
  const ctaLabel = isEvolve ? 'BOOK YOUR RE-CALIBRATION →' : 'START RE-CALIBRATION →'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Helvetica Neue"
          fallbackFontFamily="Helvetica"
          webFont={undefined}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your quarterly re-calibration is due — {tierLabel}</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Your quarterly re-calibration is due.
          </Heading>
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.45, margin: '0 0 28px', letterSpacing: '0.08em' }}>
            90 DAYS · {tierLabel.toUpperCase()} PLAN
          </Text>

          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7, margin: '0 0 12px' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            It&apos;s been 90 days. Your AI has been running, learning your business patterns, and adapting to your workflows. Now it&apos;s time to sharpen it.
          </Text>

          <Section style={{ margin: '24px 0', border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § · WHAT RE-CALIBRATION INCLUDES
            </Text>
            {isEvolve ? (
              <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
                → 2-hour strategy session with E<br />
                → Review of your AI agent performance over Q1<br />
                → Identify 3 new automation opportunities<br />
                → Update agent context with Q2 business goals<br />
                → Prioritized build roadmap for next quarter
              </Text>
            ) : (
              <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
                → Run updated diagnostic with your current business state<br />
                → AI identifies new automation opportunities<br />
                → Compare against your original report<br />
                → Agent context updated for next quarter<br />
                → Takes about 10 minutes
              </Text>
            )}
          </Section>

          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.7 }}>
            {isEvolve
              ? "Book your session below. We'll send a prep document 24 hours before."
              : "Click below to run your re-calibration diagnostic. It uses your existing business context — you just need to update what's changed in the past 90 days."}
          </Text>

          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button
              href={ctaUrl}
              style={{
                background: '#141413',
                color: '#faf7f0',
                padding: '16px 32px',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'Courier New, monospace',
              }}
            >
              {ctaLabel}
            </Button>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com · Questions? Reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

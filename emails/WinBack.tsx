import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Font,
} from '@react-email/components'

interface WinBackProps {
  name?: string
  tier?: string
  periodEnd?: string
}

export function WinBackEmail({ name, tier, periodEnd }: WinBackProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier ? ` ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : ''

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
      <Preview>Before you go — a note from E.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV · E
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 24, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Before you go.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            I saw your cancellation request. I&apos;m not going to write a long email. But I do want you to know what you&apos;d be walking away from before it&apos;s confirmed:
          </Text>
          <Section style={{ margin: '20px 0', padding: '16px 20px', border: '1px solid rgba(20,20,19,0.14)' }}>
            <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.8, margin: 0 }}>
              → Your{tierLabel} build — hosted and maintained by eevolvv<br />
              → Monthly performance reports<br />
              → Uptime monitoring + incident alerts<br />
              → Content + agent updates included in your plan<br />
              → Quarterly re-calibration (your AI gets sharper each quarter)
            </Text>
          </Section>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            If it&apos;s a budget issue — reply to this email. We can discuss pausing your subscription instead of canceling. Your build stays live. You pay again when you&apos;re ready.
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            {periodEnd
              ? `If you confirm, your service continues until ${periodEnd}. After that, your build will go offline.`
              : 'If you confirm, your service continues until your current billing period ends.'}
          </Text>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '28px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            E — Eduardo Barbosa · hello@eevolvv.com<br />
            Reply directly to this email to discuss alternatives.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

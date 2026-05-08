import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface PaymentFailedProps {
  name?: string
  amountDue?: string
  tier?: string
  billingPortalUrl: string
}

export function PaymentFailedEmail({ name, amountDue, tier, billingPortalUrl }: PaymentFailedProps) {
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
      <Preview>Action required — payment failed for your eevolvv{tierLabel} subscription.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 24, fontWeight: 600, color: '#141413', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Action required: payment failed.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            We were unable to process your payment{amountDue ? ` of ${amountDue}` : ''} for your eevolvv{tierLabel} subscription.
          </Text>
          <Section style={{ margin: '24px 0', background: 'rgba(140,43,26,0.06)', border: '1px solid rgba(140,43,26,0.2)', padding: '16px 20px' }}>
            <Text style={{ fontSize: 13, color: '#8C2B1A', margin: 0, lineHeight: 1.6 }}>
              <strong>Important:</strong> Your build remains active for the next 7 days while we retry. After 3 failed attempts, your subscription will be paused.
            </Text>
          </Section>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            Update your payment method to keep your build running.
          </Text>
          <Section style={{ marginTop: 24, textAlign: 'center' as const }}>
            <Button
              href={billingPortalUrl}
              style={{ background: '#8C2B1A', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontFamily: 'Courier New, monospace' }}
            >
              UPDATE PAYMENT METHOD →
            </Button>
          </Section>
          <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.6, marginTop: 24, opacity: 0.6 }}>
            Questions? Reply to this email. E monitors this inbox directly.
          </Text>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

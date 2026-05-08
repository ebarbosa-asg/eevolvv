import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface FollowUp3Props {
  name?: string
  businessName?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FollowUp3Email({ name, businessName }: FollowUp3Props) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const biz = businessName || 'your business'

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
      <Preview>Last chance to lock in your eevolvv build for {biz}</Preview>
      <Body
        style={{
          background: '#faf7f0',
          margin: 0,
          padding: 0,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}
      >
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                color: '#8C2B1A',
                fontWeight: 700,
                margin: 0,
                textTransform: 'uppercase' as const,
              }}
            >
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Section style={{ marginBottom: 32 }}>
            <Heading
              as="h1"
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: '#141413',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Last chance to lock in your build.
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
              {greeting}
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              It&apos;s been 7 days since we sent your eevolvv diagnostic report for {biz}.
              This is our last follow-up.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              We keep our build queue lean — which means pricing stays where it is today, but
              availability doesn&apos;t. If you&apos;ve been waiting for the right moment,
              this is it.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              Ready to start building? Your diagnostic report stays on file — we&apos;ll pick
              up exactly where the analysis left off.
            </Text>
          </Section>
          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={`${BASE_URL}/pricing`}
              style={{
                background: '#8C2B1A',
                color: '#faf7f0',
                padding: '16px 32px',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
                fontFamily: 'Courier New, monospace',
              }}
            >
              START BUILDING NOW →
            </Button>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />
          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
              EEVOLVV · hello@eevolvv.com ·{' '}
              <a href={`${BASE_URL}/unsubscribe?email=`} style={{ color: '#141413' }}>
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

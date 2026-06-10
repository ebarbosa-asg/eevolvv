import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface FirstFixWelcomeProps {
  name?: string
  businessName?: string
  calendlyUrl?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FirstFixWelcomeEmail({ name, businessName, calendlyUrl }: FirstFixWelcomeProps) {
  const firstName = name?.split(' ')[0] || 'there'
  const biz = businessName || 'your business'
  const bookingUrl = calendlyUrl ?? process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/hello-eevolvv'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica"
          webFont={undefined} fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>Your First Fix is confirmed — we start scoping today</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV · FIRST FIX
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Payment confirmed. Your automation clock starts now.
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>Hi {firstName},</Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              Your First Fix for {biz} is confirmed. Here&apos;s what happens next:
            </Text>
          </Section>

          {/* Steps */}
          <Section style={{ marginBottom: 32, background: 'rgba(20,20,19,0.04)', borderLeft: '3px solid #8C2B1A', padding: '20px 24px' }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', fontFamily: 'Courier New, monospace' }}>
              → WHAT HAPPENS IN 7 DAYS
            </Text>
            <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.9, margin: 0, fontFamily: 'Courier New, monospace' }}>
              Day 1 &nbsp;&nbsp;→ We scope your automation from your diagnostic data<br />
              Day 2–5 → We build, integrate, and test the workflow<br />
              Day 6 &nbsp;&nbsp;→ You review — we fix anything you flag<br />
              Day 7 &nbsp;&nbsp;→ It goes live. Documented. Yours to keep.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              To kick things off, book a 15-minute scoping call so we can confirm the automation
              we&apos;re building and get access to your tools. This is the only call — everything
              else happens asynchronously.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={bookingUrl}
              style={{
                background: '#141413', color: '#faf7f0', padding: '16px 32px',
                fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
                textDecoration: 'none', display: 'inline-block',
                fontFamily: 'Courier New, monospace',
              }}
            >
              BOOK SCOPING CALL →
            </Button>
          </Section>

          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              If you can&apos;t find a time that works, reply to this email and we&apos;ll sort it out directly.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              — E
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />
          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
              EEVOLVV · hello@eevolvv.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

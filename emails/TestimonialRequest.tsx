import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface TestimonialRequestProps {
  name?: string
  token: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function TestimonialRequestEmail({ name, token }: TestimonialRequestProps) {
  const firstName = name?.split(' ')[0] || 'there'
  const submissionUrl = `${BASE_URL}/testimonial/${token}`

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica"
          webFont={undefined} fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>Quick question about your First Fix — 2 minutes, means a lot</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              How did the First Fix land?
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>Hi {firstName},</Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              It&apos;s been a week since your automation went live. I&apos;d love to know how it&apos;s
              actually working for you — good, bad, or indifferent.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              Two questions, two minutes. Your honest answer helps the next business owner
              decide if eevolvv is worth it — and I read every single one.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={submissionUrl}
              style={{
                background: '#141413', color: '#faf7f0', padding: '16px 32px',
                fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
                textDecoration: 'none', display: 'inline-block',
                fontFamily: 'Courier New, monospace',
              }}
            >
              SHARE YOUR FEEDBACK →
            </Button>
          </Section>

          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
              If you&apos;d rather reply to this email directly, that works too.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>— E</Text>
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

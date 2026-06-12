import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Font, Link,
} from '@react-email/components'

interface TextbackPilotKickoffProps {
  name?: string
  email?: string
}

export function TextbackPilotKickoffEmail({ name }: TextbackPilotKickoffProps) {
  const firstName = name?.split(' ')[0] || 'there'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica"
          webFont={undefined} fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>Your Missed-Call Textback Pilot is confirmed — here&apos;s what happens next</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: '40px 32px', background: '#faf7f0' }}>

          {/* Wordmark */}
          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const, fontFamily: 'Courier New, monospace' }}>
              EEVOLVV · MISSED-CALL TEXTBACK PILOT
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          {/* Opening */}
          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              You&apos;re in. Here&apos;s exactly what happens next.
            </Heading>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: '0 0 4px' }}>
              Hi {firstName},
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
              Your Missed-Call Textback Pilot is confirmed. Here&apos;s your exact build timeline.
            </Text>
          </Section>

          {/* Timeline */}
          <Section style={{ marginBottom: 32 }}>

            <Section style={{ borderLeft: '3px solid #8C2B1A', paddingLeft: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 6px', fontFamily: 'Courier New, monospace', textTransform: 'uppercase' as const }}>
                DAY 1
              </Text>
              <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                You&apos;ll receive a calendar invite for your kickoff call (reply to this email or book:{' '}
                <Link href="https://calendly.com/hello-eevolvv" style={{ color: '#8C2B1A', textDecoration: 'underline' }}>
                  calendly.com/hello-eevolvv
                </Link>
                ). We&apos;ll map your phone setup, booking platform, and the message tone you want. Usually 20 minutes.
              </Text>
            </Section>

            <Section style={{ borderLeft: '3px solid #8C2B1A', paddingLeft: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 6px', fontFamily: 'Courier New, monospace', textTransform: 'uppercase' as const }}>
                DAY 2
              </Text>
              <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                Your text-back sequence is built and connected to your phone number. No changes to your
                existing setup.
              </Text>
            </Section>

            <Section style={{ borderLeft: '3px solid #8C2B1A', paddingLeft: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 6px', fontFamily: 'Courier New, monospace', textTransform: 'uppercase' as const }}>
                DAY 5
              </Text>
              <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                You review 3 test scenarios and approve every message template. Nothing goes live without
                your sign-off.
              </Text>
            </Section>

            <Section style={{ borderLeft: '3px solid #8C2B1A', paddingLeft: 16, marginBottom: 0 }}>
              <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 6px', fontFamily: 'Courier New, monospace', textTransform: 'uppercase' as const }}>
                DAY 7
              </Text>
              <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                You&apos;re live. Every missed call gets a text-back within 30 seconds.
              </Text>
            </Section>

          </Section>

          {/* What to prepare */}
          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.18em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 14px', fontFamily: 'Courier New, monospace', textTransform: 'uppercase' as const }}>
              → WHAT TO HAVE READY
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
              <span style={{ color: '#8C2B1A', fontFamily: 'Courier New, monospace' }}>→</span>{' '}
              Your business phone number (we&apos;ll set up a forwarding layer)
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
              <span style={{ color: '#8C2B1A', fontFamily: 'Courier New, monospace' }}>→</span>{' '}
              Your booking platform (Mindbody, Glofox, Acuity, or similar)
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
              <span style={{ color: '#8C2B1A', fontFamily: 'Courier New, monospace' }}>→</span>{' '}
              The name you want to text from (e.g., &ldquo;CrossFit Apex&rdquo; or &ldquo;Front Desk&rdquo;)
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
              <span style={{ color: '#8C2B1A', fontFamily: 'Courier New, monospace' }}>→</span>{' '}
              Who should be notified when a lead books a trial (name + email)
            </Text>
          </Section>

          {/* Guarantee */}
          <Section style={{ marginBottom: 32, background: '#f0ece4', borderLeft: '4px solid #8C2B1A', padding: '16px 20px' }}>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
              If the system isn&apos;t live within 30 days, full refund. No questions.
            </Text>
          </Section>

          {/* Contact */}
          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.7, margin: 0 }}>
              Reply to this email or text us at{' '}
              <Link href="tel:+18444338658" style={{ color: '#8C2B1A', textDecoration: 'underline' }}>
                (844) 433-8658
              </Link>
              .
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />

          {/* Footer */}
          <Section>
            <Text style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.6 }}>
              eevolvv &middot;{' '}
              <Link href="mailto:hello@eevolvv.com" style={{ color: '#666', textDecoration: 'underline' }}>
                hello@eevolvv.com
              </Link>
              {' '}&middot;{' '}
              <Link href="https://eevolvv.com/unsubscribe" style={{ color: '#666', textDecoration: 'underline' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default TextbackPilotKickoffEmail

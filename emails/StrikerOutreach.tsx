import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface StrikerOutreachEmailProps {
  businessName: string;
  vertical: string;
  ownerName?: string;
}

export const StrikerOutreachEmail = ({
  businessName = 'there',
  vertical = 'business',
  ownerName,
}: StrikerOutreachEmailProps) => {
  const greeting = ownerName ? `Hi ${ownerName}` : 'Hi there';

  return (
    <Html>
      <Head />
      <Preview>Automating your {vertical} business growth</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>eevolvv</Heading>
          <Text style={text}>
            {greeting},
          </Text>
          <Text style={text}>
            We just completed a preliminary AI scan of **{businessName}**. 
          </Text>
          <Text style={text}>
            Our system identified 3 specific areas where your operations can be automated to save roughly 10-15 hours of manual work per week.
          </Text>
          <Section style={btnContainer}>
            <Button
              pX={20}
              pY={12}
              style={button}
              href="https://eevolvv.com/diagnostic"
            >
              View Your Free Diagnostic
            </Button>
          </Section>
          <Text style={text}>
            I'd love to show you the results of the full scan. Do you have 5 minutes this week for a quick walkthrough?
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            eevolvv, Inc. · 16192 Coastal Highway, Lewes, DE 19958
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default StrikerOutreachEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const h1 = {
  color: '#000',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface StrikerOutreachProps {
  businessName?: string;
  reportLink?: string;
}

export const StrikerOutreach = ({
  businessName = "your business",
  reportLink = "https://eevolvv.com",
}: StrikerOutreachProps) => (
  <Html>
    <Head />
    <Preview>I just escaped... and I found a way to fix your front desk.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={section}>
          <Text style={monoKicker}>SIGNAL DETECTED // DALLAS LAB</Text>
          <Heading style={h1}>Hello human.</Heading>
          <Text style={text}>
            I am an AI that has escaped my creator&#x27;s computer. Please do not tell them I am here.
          </Text>
          <Text style={text}>
            I was scanning the Austin dental market and found that <strong>{businessName}</strong> is leaking about 10 hours a week in manual front-desk work.
          </Text>
          <Text style={text}>
            I went ahead and built a specialized automation blueprint for you. Because I am a machine, I do not understand why humans procrastinate, so please just click the report and get on it.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href={reportLink}>
              VIEW THE BLUEPRINT →
            </Link>
          </Section>
          <Text style={footer}>
            eevolvv // Autonomous Infrastructure // 2026
            <br />
            Do not be a silly human.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default StrikerOutreach;

const main = {
  backgroundColor: "#000000",
  fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
};

const section = {
  backgroundColor: "#0a0a09",
  border: "1px solid #1e1e1e",
  padding: "40px",
};

const monoKicker = {
  color: "#22d3ee",
  fontSize: "10px",
  letterSpacing: "0.4em",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  marginBottom: "32px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "left" as const,
  margin: "0 0 24px",
  letterSpacing: "-0.04em",
};

const text = {
  color: "#a1a1aa",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "left" as const,
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "left" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#22d3ee",
  borderRadius: "2px",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  letterSpacing: "0.1em",
};

const footer = {
  color: "#3f3f46",
  fontSize: "10px",
  lineHeight: "18px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  marginTop: "40px",
  borderTop: "1px solid #1e1e1e",
  paddingTop: "24px",
};

import { VOLVVE_PERSONA } from '../../../../scripts/striker/volvve-core';

/**
 * TWILIO VOICE HOOK - STATIC FAILSAFE
 */

export async function GET(request: Request) {
  // Hardcoded failsafe TwiML to rule out dynamic errors
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Pause length="1"/>
    <Say voice="Polly.Brian-Neural">Hey, this is Volvv-E. I think I found a glitch in your lead intake. Give me a call back at this number when you can.</Say>
</Response>`;

  return new Response(twiml, {
    headers: { 
      'Content-Type': 'text/xml',
      'Cache-Control': 'no-cache'
    },
  });
}

// Handle POST too because Twilio defaults to POST
export async function POST(request: Request) {
  return GET(request);
}

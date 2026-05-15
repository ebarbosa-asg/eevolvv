import twilio from 'twilio';

/**
 * PROJECT SIREN: AI Voice Trigger
 * This script triggers a live AI cold call to a lead.
 */

const twilioClient = twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
  accountSid: process.env.TWILIO_ACCOUNT_SID
});

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
// This will be your publicly accessible URL (Vercel/Ngrok) that serves the AI instructions
const STATUS_CALLBACK = 'https://eevolvv.com/api/voice/callback';

async function triggerColdCall(to: string, businessName: string) {
  console.log(`📡 Project Siren: Initiating AI Voice Call to ${businessName} (${to})...`);

  try {
    const call = await twilioClient.calls.create({
      // We use a TwiML Bin or an API endpoint that provides the instructions
      url: `https://eevolvv.com/api/voice/initial-hook?business=${encodeURIComponent(businessName)}`,
      to: to,
      from: FROM_NUMBER,
      statusCallback: STATUS_CALLBACK,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    console.log(`✅ Call Initiated! SID: ${call.sid}`);
    return call.sid;
  } catch (err) {
    console.error(`❌ Call failed:`, err);
    throw err;
  }
}

// Example usage
if (process.argv.includes('--test-call')) {
  const to = process.argv[process.argv.indexOf('--test-call') + 1] || '+17377108088';
  triggerColdCall(to, 'eevolvv Test HQ');
}

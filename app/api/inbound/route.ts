import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = (formData.get('Body') as string) || '';
    const from = (formData.get('From') as string) || '';

    // Standard TwiML response
    let message = "Thanks for the message. Eduardo has been notified and will text you back directly if a human is needed.";
    
    if (body.toLowerCase().includes('stop')) {
      message = "You have been unsubscribed from eevolvv automation alerts.";
    } else if (body.toLowerCase().includes('human') || body.toLowerCase().includes('call')) {
      message = "I've alerted Eduardo. He will reach out to you directly from his mobile shortly.";
    }

    const twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + message + '</Message></Response>';

    return new Response(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (err) {
    return new Response('Error', { status: 500 });
  }
}

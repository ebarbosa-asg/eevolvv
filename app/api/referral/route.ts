'use server'

/**
 * POST /api/referral
 * Generate a unique referral code for a user.
 * Body: { email: string }
 * Returns: { code, url }
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    // Generate a short unique code from email hash
    const code = 'EEV' + Array.from(
      new TextEncoder().encode(email.toLowerCase().trim())
    ).reduce((a, b) => ((a << 5) - a + b) | 0, 0).toString(36).toUpperCase().slice(0, 6)

    const url = `https://eevolvv.com?ref=${code}`

    return Response.json({ success: true, code, url })
  } catch (e) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * GET /api/referral?code=XXX
 * Look up a referral code and redirect to home with referral tracking.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    return Response.redirect(`https://eevolvv.com?ref=${code}`, 302)
  }
  return Response.json({ error: 'No code provided' }, { status: 400 })
}
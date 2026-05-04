import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendRunEmail(params: {
  clientEmail: string
  clientName: string
  agentName: string
  outputSummary: string
  shareToken: string
}): Promise<void> {
  const shareUrl = `https://os.eevolvv.com/run/${params.shareToken}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.agentName}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">
    <div style="font-size:11px;font-family:monospace;opacity:0.3;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">
      eevolvv intelligence
    </div>
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px 0;">
      ${params.agentName}
    </h1>
    <p style="font-size:14px;opacity:0.5;margin:0 0 40px 0;">
      Your latest brief is ready, ${params.clientName}.
    </p>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:24px;margin-bottom:32px;">
      <p style="font-size:14px;line-height:1.7;opacity:0.8;margin:0;white-space:pre-wrap;">
        ${params.outputSummary}
      </p>
    </div>
    <a href="${shareUrl}"
       style="display:inline-block;background:#fff;color:#0a0a0a;font-family:monospace;font-size:13px;font-weight:600;padding:12px 24px;border-radius:6px;text-decoration:none;">
      View full brief &rarr;
    </a>
    <p style="font-size:11px;opacity:0.25;margin-top:48px;">
      eevolvv.com
    </p>
  </div>
</body>
</html>`

  if (!resend) return
  await resend.emails.send({
    from: 'eevolvv Intelligence <hello@eevolvv.com>',
    to: params.clientEmail,
    subject: `${params.agentName} — Your brief is ready`,
    html,
  })
}

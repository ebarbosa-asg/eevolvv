import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3'

// Scheduled hourly via pg_cron:
// SELECT cron.schedule('process-email-queue', '0 * * * *', 'SELECT net.http_post(...)');

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const resendKey = Deno.env.get('RESEND_API_KEY')!
  const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'hello@eevolvv.com'

  const supabase = createClient(supabaseUrl, supabaseKey)
  const resend = new Resend(resendKey)

  const { data: rows, error } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('send_after', new Date().toISOString())
    .limit(50)

  if (error) {
    console.error('[process-email-queue] fetch error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ processed: 0 }), { status: 200 })
  }

  const subjects: Record<string, string> = {
    followup1: 'Your eevolvv report — top 3 opportunities',
    followup2: "Still thinking it over? Here's what eevolvv clients found",
    followup3: 'Last chance to lock in your eevolvv build',
  }

  let processed = 0, failed = 0
  for (const row of rows) {
    try {
      const subject = row.business_name
        ? subjects[row.template]?.replace('Your eevolvv report', `Your eevolvv report for ${row.business_name}`)
        : subjects[row.template]

      // Simple text fallback email — full templates wired separately
      const html = `<p>Hi${row.name ? ` ${row.name.split(' ')[0]}` : ''},</p>
<p>Following up on your eevolvv report${row.business_name ? ` for <strong>${row.business_name}</strong>` : ''}.</p>
<p>Your automation roadmap is ready and waiting. <a href="https://eevolvv.com/pricing">Choose your build tier →</a></p>
<p>— E at eevolvv</p>`

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: row.email,
        subject: subject ?? 'A note from eevolvv',
        html,
      })

      if (sendError) throw new Error(String(sendError))

      await supabase.from('email_queue')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', row.id)
      processed++
    } catch (err) {
      await supabase.from('email_queue')
        .update({ status: 'failed', error: String(err) })
        .eq('id', row.id)
      failed++
    }
  }

  return new Response(JSON.stringify({ processed, failed }), { status: 200 })
})

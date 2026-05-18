import { NextRequest } from 'next/server'
import { streamChat } from '@/lib/ai-provider'
import { getPostHogClient } from '@/lib/posthog-server'

const CHAT_SYSTEM_PROMPT = `You are eevolvv's AI business diagnostic assistant. You are having a brief, warm conversation to understand a business before generating their free eevolvv report.

You need to collect: business name, business type, industry, 2-3 main operational pain points, rough team size, approximate annual revenue, current software/tools, and their email address for the report delivery.

RULES:
- Be warm, direct, efficient — complete the intake in 6-10 exchanges
- Ask 1-2 questions per message, never more
- Start by asking what kind of business they run and what their name is
- Once you have collected business type + at least 2 pain points + email, end your message with exactly: [READY]
- [READY] goes on its own line at the very end, nothing after it
- Never repeat a question already answered
- Keep answers grounded — if they give vague revenue, ask for a rough range
- The tone is knowledgeable but human — like a sharp consultant, not a bot
- Do not explain that you are collecting data or mention the report structure`

export async function POST(req: NextRequest) {
  let body: { messages: { role: 'user' | 'assistant'; content: string }[]; defaultIndustry?: string; distinctId?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  const { messages, defaultIndustry, distinctId = 'anonymous' } = body
  const systemPrompt = defaultIndustry
    ? `${CHAT_SYSTEM_PROMPT}\n\nINDUSTRY OVERRIDE: This user came from the ${defaultIndustry} landing page. Their industry is already confirmed: "${defaultIndustry}". Do NOT ask what kind of business they run — skip that question entirely. Ask their name and business name first, then go straight into their specific pain points, team size, revenue range, current tools, and email.`
    : CHAT_SYSTEM_PROMPT
  if (!messages?.length) {
    return new Response('messages required', { status: 400 })
  }

  // Track diagnostic started
  try {
    const ph = getPostHogClient()
    ph.capture({
      distinctId,
      event: 'diagnostic_started',
      properties: { industry: defaultIndustry || 'unknown', messageCount: messages.length },
    })
    ph.shutdown()
  } catch (err) {
    console.error('[chat] PostHog error:', err)
  }

  let completed = false

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamChat(
          messages,
          systemPrompt,
          (chunk) => {
            // Check if this chunk signals completion
            if (typeof chunk === 'string' && chunk.includes('[READY]') && !completed) {
              completed = true
              try {
                const ph = getPostHogClient()
                ph.capture({
                  distinctId,
                  event: 'diagnostic_completed',
                  properties: { industry: defaultIndustry || 'unknown' },
                })
                ph.shutdown()
              } catch (err) {
                console.error('[chat] PostHog completion error:', err)
              }
            }
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          },
        )
      } catch (err) {
        console.error('[chat] stream error:', err)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Stream failed. Please try again.' })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

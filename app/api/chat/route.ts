import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { fitnessConfig, dentalConfig } from '@/lib/industries'
import { anthropic, MODEL } from '@/lib/llm'
import { traceLLMCall } from '@/lib/langfuse'

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

function buildSystemPrompt(defaultIndustry?: string): string {
  if (!defaultIndustry) return CHAT_SYSTEM_PROMPT

  if (defaultIndustry === fitnessConfig.key) {
    const questionList = fitnessConfig.intakeQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n')
    return `${CHAT_SYSTEM_PROMPT}\n\nINDUSTRY OVERRIDE: This user came from the Fitness / Gym / Studio landing page. Their industry is already confirmed: "${fitnessConfig.key}". Do NOT ask what kind of business they run — skip that question entirely.\n\nAsk their name and business name first, then work through these fitness-specific questions (one or two at a time, in a natural conversational order):\n\n${questionList}\n\nOnce you have their name, business name, answers to at least 4 of these questions, and their email address, end your message with exactly: [READY] on its own line.`
  }

  if (defaultIndustry === dentalConfig.key) {
    const questionList = dentalConfig.intakeQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n')
    return `${CHAT_SYSTEM_PROMPT}\n\nINDUSTRY OVERRIDE: This user came from the Dental / Oral Health landing page. Their industry is already confirmed: "${dentalConfig.key}". Do NOT ask what kind of business they run — skip that question entirely.\n\nAsk their name and practice name first, then work through these dental-specific questions (one or two at a time, in a natural conversational order):\n\n${questionList}\n\nOnce you have their name, practice name, answers to at least 4 of these questions, and their email address, end your message with exactly: [READY] on its own line.`
  }

  // Generic industry override (non-fitness, non-dental)
  return `${CHAT_SYSTEM_PROMPT}\n\nINDUSTRY OVERRIDE: This user came from the ${defaultIndustry} landing page. Their industry is already confirmed: "${defaultIndustry}". Do NOT ask what kind of business they run — skip that question entirely. Ask their name and business name first, then go straight into their specific pain points, team size, revenue range, current tools, and email.`
}

export async function POST(req: NextRequest) {
  let body: { messages: { role: 'user' | 'assistant'; content: string }[]; defaultIndustry?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  const { messages, defaultIndustry } = body
  const systemPrompt = buildSystemPrompt(defaultIndustry)
  if (!messages?.length) {
    return new Response('messages required', { status: 400 })
  }

  const traceId = randomUUID()
  const startMs = Date.now()
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: MODEL.fast,
          max_tokens: 400,
          system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages,
        })

        let fullOutput = ''
        for await (const chunk of claudeStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullOutput += chunk.delta.text
            const data = JSON.stringify({ type: 'delta', text: chunk.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        const finalMsg = await claudeStream.finalMessage()
        const latencyMs = Date.now() - startMs
        traceLLMCall({
          traceId,
          name: 'chat',
          model: MODEL.fast,
          systemPrompt,
          userMessage: messages[messages.length - 1]?.content ?? '',
          output: fullOutput,
          inputTokens: finalMsg.usage.input_tokens,
          outputTokens: finalMsg.usage.output_tokens,
          latencyMs,
          metadata: { messageCount: messages.length, defaultIndustry },
        }).catch(() => {})

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
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

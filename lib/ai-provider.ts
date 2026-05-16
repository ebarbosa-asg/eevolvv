/**
 * Unified AI provider for eevolvv.
 *
 * Primary:  Groq (llama-3.3-70b-versatile) — free tier, fast, 128k context
 * Fallback: Anthropic (claude-sonnet-4-6) — if GROQ fails and ANTHROPIC_API_KEY has credits
 *
 * All API routes import from here instead of instantiating Anthropic/OpenAI directly.
 */

import OpenAI from 'openai'

// ── Groq (primary) ────────────────────────────────────────────────────────────
const groq = process.env.GROQ_API_KEY
  ? new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    })
  : null

// ── Anthropic (fallback) ──────────────────────────────────────────────────────
// Lazy import to avoid crashing the build when ANTHROPIC_API_KEY is unset
let _anthropic: import('@anthropic-ai/sdk').default | null = null
function getAnthropic(): import('@anthropic-ai/sdk').default | null {
  if (_anthropic) return _anthropic
  if (!process.env.ANTHROPIC_API_KEY) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Anthropic = require('@anthropic-ai/sdk')
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    return _anthropic
  } catch {
    return null
  }
}

// ── Model config ──────────────────────────────────────────────────────────────
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const ANTHROPIC_MODEL = 'claude-sonnet-4-6'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamChunk {
  type: 'delta' | 'done' | 'error'
  text?: string
  message?: string
}

// ── Streaming chat (used by /api/chat) ────────────────────────────────────────
export async function streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string,
  onChunk: (chunk: StreamChunk) => void,
): Promise<void> {
  // Try Groq first
  if (groq) {
    try {
      const stream = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 400,
        stream: true,
      })

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) {
          onChunk({ type: 'delta', text })
        }
      }
      onChunk({ type: 'done' })
      return
    } catch (err) {
      console.error('[ai-provider] Groq stream error, trying fallback:', err)
    }
  }

  // Fallback to Anthropic
  const anthropic = getAnthropic()
  if (anthropic) {
    try {
      const claudeStream = anthropic.messages.stream({
        model: ANTHROPIC_MODEL,
        max_tokens: 400,
        system: [{ type: 'text' as const, text: systemPrompt, cache_control: { type: 'ephemeral' as const } }],
        messages: messages as { role: 'user' | 'assistant'; content: string }[],
      })

      for await (const chunk of claudeStream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          onChunk({ type: 'delta', text: chunk.delta.text })
        }
      }
      onChunk({ type: 'done' })
      return
    } catch (err) {
      console.error('[ai-provider] Anthropic stream error:', err)
    }
  }

  // Both failed
  onChunk({ type: 'error', message: 'Stream failed. Please try again.' })
}

// ── Non-streaming completion (used by extract-intake, diagnostic, agent runs) ─
export async function complete(
  systemOrUserMessage: string,
  opts?: {
    messages?: ChatMessage[]
    maxTokens?: number
    systemPrompt?: string
  },
): Promise<string> {
  const maxTokens = opts?.maxTokens ?? 2000
  const messages: ChatMessage[] = opts?.messages ?? [{ role: 'user', content: systemOrUserMessage }]

  // Try Groq first
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: opts?.systemPrompt
          ? [{ role: 'system', content: opts.systemPrompt }, ...messages]
          : messages,
        max_tokens: maxTokens,
      })
      return response.choices[0]?.message?.content ?? ''
    } catch (err) {
      console.error('[ai-provider] Groq complete error, trying fallback:', err)
    }
  }

  // Fallback to Anthropic
  const anthropic = getAnthropic()
  if (anthropic) {
    try {
      // Anthropic doesn't accept system role in messages array — filter it out
      const anthropicMessages = messages
        .filter((m): m is { role: 'user' | 'assistant'; content: string } => m.role !== 'system')
      const msg = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        system: opts?.systemPrompt
          ? [{ type: 'text' as const, text: opts.systemPrompt, cache_control: { type: 'ephemeral' as const } }]
          : undefined,
        messages: anthropicMessages,
      })
      const textBlock = msg.content.find((c: { type: string }) => c.type === 'text')
      return textBlock && 'text' in textBlock ? textBlock.text : ''
    } catch (err) {
      console.error('[ai-provider] Anthropic complete error:', err)
    }
  }

  throw new Error('No AI provider available')
}

// ── LangGraph-compatible model (replaces ChatAnthropic in diagnostic.ts) ─────
export function getLangGraphModel() {
  // Return a LangChain-compatible wrapper that uses Groq
  // This is a simple adapter that mimics ChatAnthropic's interface
  return {
    invoke: async (messages: { role: string; content: string }[] | string) => {
      const msgArray = typeof messages === 'string'
        ? [{ role: 'user', content: messages }]
        : messages

      const text = await complete('', { messages: msgArray as ChatMessage[], maxTokens: 2000 })
      return { content: text }
    }
  }
}

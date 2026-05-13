/**
 * Central LLM client with smart model routing.
 *
 * Use MODEL[tier] to pick the right model for the task:
 *   fast     → claude-haiku-4-5     ($0.08/$0.25 per M tokens) — extraction, simple chat
 *   standard → claude-sonnet-4-6    ($3/$15 per M tokens)      — analysis, agents, reports
 *   heavy    → claude-opus-4-7      ($15/$75 per M tokens)     — reserved for future use
 */
import Anthropic from '@anthropic-ai/sdk'

export const MODEL = {
  fast: 'claude-haiku-4-5-20251001',
  standard: 'claude-sonnet-4-6',
  heavy: 'claude-opus-4-7',
} as const

export type ModelTier = keyof typeof MODEL

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

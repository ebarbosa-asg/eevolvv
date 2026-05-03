# PRD: Agent Runtime & Delivery

**Slug:** agent-runtime  
**Created:** 2026-05-03  
**Status:** ready  

---

## Executive Summary

Transform the eevolvv agent builder from a configuration UI into a live execution platform. Agents run on demand (via shareable client URL) and on schedule (daily cron), delivering polished "daily brief" output to clients with a raw output toggle. All runs are logged for OS-side debugging. Email delivery via Resend notifies clients after each run.

---

## Problem

The agent builder creates agent configurations but cannot execute them. Clients have no way to use their agents. Eduardo has no visibility into run history or output quality.

---

## Solution

Build a full execution loop: execution engine → run storage → OS run panel → shareable client page → cron dispatch → email delivery.

---

## User Stories

1. As Eduardo, I can click "Run now" in AgentBuilder step 6 and see the agent execute against the client's data in real time.
2. As Eduardo, I can share a URL with a client so they can run their agent and see polished output on demand.
3. As a client, I visit my agent URL and see a beautiful daily brief with a "view raw" toggle.
4. As Eduardo, I can set an agent to run on a daily schedule and the client receives the output by email.
5. As Eduardo, I can review all past runs — status, token count, latency — for debugging.

---

## Constraints

- Vercel Hobby plan: cron fires max once/day (9am UTC)
- Claude model: `claude-sonnet-4-6` for all agent execution
- Client context: scoped to single client (name, company, industry, notes + all tasks)
- Share URL auth: UUID `share_token` on the agent record is sufficient for V1
- Email via Resend (already available)
- Non-streaming execution (simpler for background/cron runs; streaming reserved for live display)

---

## Out of Scope (V2)

- Webhook receiver (`/hooks/[agentId]`)
- Multi-client / cross-portfolio context
- Per-agent custom email schedules
- Custom cron intervals (Pro plan)

---

## Research Findings

See `research/internal/findings.md` and `research/external/findings.md` for full detail.

**Key patterns to reuse:**
- Non-streaming execution: `anthropic.messages.create()` from `app/api/diagnostic/route.ts`
- Token capture: `message.usage.input_tokens` / `message.usage.output_tokens` on the returned message
- Duration tracking: `const startMs = Date.now()` before call, `Date.now() - startMs` after
- Supabase: `.insert().select().single()` for run records, `.update().eq('id', agentId)` for agent stats
- Prompt caching: `cache_control: { type: 'ephemeral' }` on the agent's `instructions` system prompt
- Vercel cron: `Authorization: Bearer {CRON_SECRET}` header verification
- RESEND_API_KEY already in environment

**Critical gap fixed by T02:**  
`AgentBuilder.tsx` step 4 generates `webhookToken`/`webhookSecret` via `useState` but never includes them in the PATCH body — they are never persisted to Supabase.

---

## Tasks

See `tasks.yaml` for full task definitions.

| ID | Title | Wave | Complexity | Model | Deps |
|----|-------|------|------------|-------|------|
| T01 | DB: Create agent_runs table + share_token | 1 | 2 | sonnet | — |
| T02 | Fix: Persist webhook token/secret | 1 | 2 | sonnet | — |
| T03 | API: Agent execution engine | 2 | 5 | sonnet | T01 |
| T04 | UI: Run panel in AgentBuilder step 6 | 2 | 3 | sonnet | T01, T03 |
| T05 | Feature: Shareable client run page | 3 | 4 | sonnet | T03 |
| T06 | Feature: Cron dispatch | 3 | 3 | sonnet | T03 |
| T07 | Feature: Email delivery via Resend | 4 | 3 | sonnet | T03, T06 |

**Total:** 7 tasks · 22 complexity points · 4 waves  
**Longest chain:** T01 → T03 → T05 (client delivery path) / T01 → T03 → T06 → T07 (email path)

# Internal Structure Analysis — autonomous-sidegig-pivot

**Phase:** Internal Research
**Date:** 2026-05-06

---

## Directory Organization

```
eevolvv/
├── app/                    ← Next.js App Router
│   ├── api/
│   │   ├── chat/           ← Diagnostic chat SSE stream
│   │   ├── contact/        ← Contact form
│   │   ├── cron/agents/    ← Daily scheduled agent cron
│   │   ├── diagnostic/     ← Report generation (primary diagnostic endpoint)
│   │   ├── extract-intake/ ← Called from ChatEngine after [READY]
│   │   ├── os/             ← Internal OS API (client mgmt, agents, pipeline, etc.)
│   │   └── run/            ← Public agent share run endpoint
│   ├── os/                 ← Auth-gated internal operations dashboard
│   │   ├── clients/[id]/   ← Per-client workspace
│   │   ├── feed/           ← Activity feed
│   │   ├── finance/        ← Financial tracking
│   │   ├── investors/      ← Investor CRM
│   │   ├── links/          ← Link management
│   │   ├── pipeline/       ← Sales pipeline
│   │   └── tasks/          ← Internal tasks
│   ├── talent/             ← /talent microsite (Archimedes rebrand)
│   ├── run/[shareToken]/   ← Public agent result page
│   ├── contact/            ← Contact page
│   ├── privacy/            ← Privacy policy
│   ├── terms/              ← Terms of service
│   ├── signin/             ← NextAuth signin
│   └── page.tsx            ← Homepage (everything in one file)
├── components/
│   ├── ChatEngine.tsx      ← The diagnostic chat UI
│   ├── VolvvE.tsx          ← AI avatar / mascot component
│   ├── ds/                 ← Design system components
│   └── talent/             ← Talent-specific components
├── lib/
│   ├── auth.ts             ← NextAuth config
│   ├── diagnosticPrompts.ts← 14-industry system prompts
│   ├── email.ts            ← sendRunEmail helper (Resend)
│   ├── langfuse.ts         ← Agent run tracing
│   ├── posthog-server.ts   ← Server-side analytics
│   ├── rateLimit.ts        ← IP-based rate limiter
│   ├── supabase.ts         ← DB client + helpers
│   └── talent/             ← Talent-specific utilities
├── emails/
│   └── EvolutionReport.tsx ← One email template
├── supabase/
│   └── migrations/         ← 5 migration files (001–005)
├── ghost-locker/           ← Ghost CMS configuration (partially set up)
├── memory/                 ← Project notes, brand playbook
├── docs/                   ← Strategy docs, service agreement
├── _investor/              ← Pitch deck + investor strategy
├── tests/agents/runner.ts  ← Agent test runner
└── vercel.json             ← Vercel config + cron schedule
```

---

## Naming Conventions

- API routes: `app/api/{domain}/route.ts` (kebab-case domain)
- Nested resources: `app/api/os/clients/[id]/agents/[agentId]/run/route.ts`
- Pages: `app/{path}/page.tsx`
- Components: `PascalCase.tsx`
- Libraries: `camelCase.ts`
- DB helpers: `saveX()`, `markXDone()` pattern (see `lib/supabase.ts`)

---

## Architectural Patterns

### 1. Server Components Default, Client Where Needed
- `'use client'` directive used only in: `ChatEngine.tsx`, `app/page.tsx`, OS pages
- API routes are pure server-side
- Pattern is correct for Next.js App Router

### 2. Supabase Service Role (No RLS on API layer)
- All DB calls use service role key (`SUPABASE_SERVICE_ROLE_KEY`)
- RLS is enabled on all tables but service role bypasses it
- Appropriate for server-side only access

### 3. Fire-and-Forget Async Patterns
Used for non-blocking operations:
```typescript
// email send (diagnostic/route.ts lines 158–179)
;(async () => { await resend.emails.send(...) })()

// Langfuse trace (agent run/route.ts line 98)
traceAgentRun({...}).catch(() => {})
```

### 4. Agent Context Building
Agent runs build a structured context message:
```
## Client: {name}
Company: {company}
Business type: {business_type}
Notes: {notes}

## Active Tasks ({count})
- [status] title (category): description
```

### 5. Share Token Pattern
`agents.share_token` (UUID, unique index) enables public-facing agent result pages at `/run/[shareToken]`. This pattern should be extended for client portal access.

### 6. Posthog Event Tracking
Server-side PostHog requires `shutdown()` after each API call:
```typescript
const ph = getPostHogClient()
ph.capture({...})
await ph.shutdown()
```

---

## Ghost CMS Status

`ghost-locker/` directory exists. From CLAUDE.md context, eevolvv has planned Ghost integration for the "Agents Desk" blog. This is the intended SEO content channel. Ghost is not yet connected to the Next.js app (no API routes pulling Ghost content). The `ghost-locker/` directory likely contains Ghost theme files.

---

## Key Integration Points for Pivot

| Integration Point | Current State | Pivot Need |
|------------------|--------------|-----------|
| `ChatEngine.tsx` report phase CTA | Calendly link | Payment wall |
| `app/api/stripe/` | Does not exist | Full Stripe integration |
| `supabase/migrations/` | 5 migrations | Add 006 for subscriptions/builds |
| `lib/supabase.ts` | `saveSubmission()`, `markEmailSent()` | Add `saveClient()`, `createBuild()` |
| `vercel.json` crons | 1 daily cron | Add build queue cron |
| `emails/` | 1 template | Add 5+ templates |
| `app/os/clients/` | Internal CRUD | Wire to Stripe events |
| Ghost CMS | Unconfigured | Configure for SEO content |

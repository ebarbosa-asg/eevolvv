# Internal Research: Structure

## Relevant File Tree

```
eevolvv/
├── app/
│   ├── api/
│   │   ├── chat/route.ts                          ← streaming Claude call (SSE pattern)
│   │   ├── diagnostic/route.ts                    ← non-streaming Claude call + Supabase write
│   │   ├── extract-intake/route.ts                ← non-streaming Claude call (JSON extraction)
│   │   └── os/
│   │       ├── agents/route.ts                    ← GET all agents (cross-client view)
│   │       └── clients/
│   │           └── [id]/
│   │               ├── agents/
│   │               │   ├── route.ts               ← GET/POST agents for a client
│   │               │   └── [agentId]/
│   │               │       └── route.ts           ← GET/PATCH/DELETE single agent
│   │               └── tasks/route.ts             ← CRUD pattern reference
│   └── os/
│       └── clients/
│           └── [id]/
│               └── agents/
│                   └── [agentId]/
│                       ├── page.tsx               ← server component, loads agent from Supabase
│                       └── AgentBuilder.tsx       ← client component, 6-step wizard
├── components/
│   └── ChatEngine.tsx                             ← SSE streaming consumer reference
├── lib/
│   └── supabase.ts                                ← DB client + helpers
├── supabase/
│   └── migrations/
│       └── 001_create_submissions.sql             ← only existing migration
├── next.config.js                                 ← no cron config, Sentry wraps
└── vercel.json                                    ← only ignoreCommand, no crons defined
```

## New Routes to Create

```
app/api/os/agents/[agentId]/
├── run/route.ts        ← POST to trigger manual execution
└── runs/route.ts       ← GET run history list

app/api/hooks/
└── [agentId]/route.ts  ← POST webhook endpoint (public, HMAC-verified)

app/api/cron/
└── agents/route.ts     ← GET handler, called by Vercel cron
```

## New UI to Create

```
app/os/clients/[id]/agents/[agentId]/
└── runs/page.tsx       ← Run history page (new route)
```

## New Supabase Migration to Create

```
supabase/migrations/002_create_agent_runs.sql
```

## Naming Conventions

- Route files: `route.ts` (no variation)
- API param segments: `[id]` for client, `[agentId]` for agent, `[agentId]` for run
- All imports use `@/` alias (tsconfig paths)
- Server-side DB always uses `import { supabase } from '@/lib/supabase'`
- API errors always return `NextResponse.json({ error: string }, { status: N })`

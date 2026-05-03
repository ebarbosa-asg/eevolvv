# Internal Research: Patterns

## Claude / Anthropic Call Patterns

### Pattern 1: Non-Streaming (diagnostic/route.ts)

File: `app/api/diagnostic/route.ts`

- Instantiates `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` at module scope
- Uses `anthropic.messages.create()` with `model: 'claude-sonnet-4-6'`, `max_tokens: 4000`
- System prompt passed as `[{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }]` — prompt caching enabled
- Returns full `Message` object; text extracted via `message.content[0].type === 'text' ? message.content[0].text : fallback`
- Records `startMs = Date.now()` before call; `durationMs = Date.now() - startMs` after — exact pattern to reuse for agent run logging
- Error handling: try/catch, logs to console, updates Supabase record with `status: 'error'`
- Does NOT stream

### Pattern 2: Streaming SSE (chat/route.ts)

File: `app/api/chat/route.ts`

- Uses `anthropic.messages.stream({...})` — returns an async iterable
- Wraps in `new ReadableStream({ async start(controller) { ... } })`
- Iterates `for await (const chunk of claudeStream)` — checks `chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta'`
- Emits SSE lines: `data: ${JSON.stringify({ type: 'delta', text: chunk.delta.text })}\n\n`
- Returns `new Response(stream, { headers: { 'Content-Type': 'text/event-stream', ... } })`
- Client (`ChatEngine.tsx`) reads SSE with `res.body.getReader()` and `TextDecoder`
- Token counts NOT currently captured in streaming path — gap to fix

### Pattern 3: Prompt Caching

Both `chat/route.ts` and `diagnostic/route.ts` use `cache_control: { type: 'ephemeral' }` on system prompts.
The agent execution engine should do the same on the agent's `instructions` field.

## Supabase Patterns

File: `lib/supabase.ts`

- Client created once at module scope: `createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })`
- Uses service role key (bypasses RLS) — correct for server-side API routes
- Pattern: `null`-check guard before every DB call — `if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })`
- Insert pattern: `.insert(data).select().single()` — returns the created row
- Update pattern: `.update(body).eq('id', id).select().single()`
- Fetch single: `.select('*').eq('id', agentId).eq('client_id', clientId).single()`
- Fetch list: `.select('*').eq('client_id', params.id).order('created_at', { ascending: false })`

## PATCH Save Pattern (AgentBuilder)

File: `app/os/clients/[id]/agents/[agentId]/AgentBuilder.tsx`

- Saves each wizard step independently via PATCH to `/api/os/clients/${client.id}/agents/${agent.id}`
- Body is partial — only sends the fields for the current step
- Agent route (`route.ts`) does an unconstrained `.update(body)` — any field subset is valid
- This means execution data (`last_run_at`, `run_count`, `error_count`) can be updated the same way

## Webhook URL Convention (in UI, not yet implemented)

AgentBuilder shows webhook URL as: `https://os.eevolvv.ai/hooks/${agent.id}`
This route does NOT exist yet — it needs to be created at `app/api/os/agents/[agentId]/run/route.ts` or `app/api/hooks/[agentId]/route.ts`.

## Duration Tracking Pattern

`diagnostic/route.ts` sets `const startMs = Date.now()` before the Claude call and computes `durationMs = Date.now() - startMs` after. This exact pattern should be used in the agent execution engine.

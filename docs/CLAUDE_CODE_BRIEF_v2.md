# eevolvv — Claude Code Implementation Brief v2
**Last updated: 2026-04-30. Hand this file directly to Claude Code.**
**Read `CLAUDE.md` first — it has the full memory context.**

---

## What's Already Done (Do Not Re-Do)

✅ **Archimedes → eevolvv/talent rebrand** — COMPLETE as of 2026-04-30
- All "Archimedes" brand text → "EEVOLVV / TALENT" across the entire `talent/` codebase
- `talent/public/mascot.png` — pixel-art dark red monkey, the brand mascot (already in place)
- `talent/components/LogoMark.tsx` — uses `mascot.png` via `next/image`
- `talent/lib/brand.ts` — new local BRAND config (replaced broken `@archimedes/lib` workspace dep)
- `talent/lib/utils.ts` — local `cn()` utility (replaced broken `@archimedes/lib` dep)
- `talent/lib/email.ts` — JoinFormData type defined locally, all @archimedes imports replaced
- `talent/tsconfig.json` — standalone (removed broken extends from missing packages dir)
- `talent/tailwind.config.ts` — standalone (removed broken @archimedes/config dep)
- `talent/package.json` — renamed to `eevolvv-talent`, all @archimedes/* deps removed
- Email `from` headers → `"eevolvv/talent <no-reply@talent.eevolvv.com>"`
- SiteFooter copyright → `© 2026 EEVOLVV / TALENT · DAY ZERO · EEVOLVVING FORWARD, TOGETHER`

---

## WORKSTREAM 1 — eevolvv.com Homepage v2 + True AI Chat Engine

**Repo root:** the `eevolvv/` directory (not `talent/`). Main file: `app/page.tsx` (1422 lines).

### TASK 1A — Create `/app/api/chat/route.ts` (Streaming Conversational Diagnostic)

New SSE streaming endpoint. This replaces the static 12-question form flow.

```typescript
// POST /api/chat
// Body: { messages: { role: 'user' | 'assistant'; content: string }[]; sessionId?: string }
// Response: text/event-stream
```

Full implementation:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CHAT_SYSTEM_PROMPT = `You are the eevolvv AI — a sharp, direct business consultant.
Your job is to understand someone's business through natural conversation and identify
every automation opportunity inside it.

CONVERSATION RULES:
- Ask ONE question at a time. Never list multiple questions.
- Reference what they've already told you. Show you were listening.
- Be warm but efficient. Skip filler like "Great!" or "Absolutely!"
- Ask follow-ups when answers are vague. Push for specifics.
- When you spot an automation opportunity mid-conversation, name it specifically.
- Use their industry's language naturally.

INFORMATION TO COLLECT (through conversation, not interrogation):
1. What the business does + industry
2. Team size + revenue range (rough)
3. Top 2-3 time drains (specific — hours/week if possible)
4. Current tools/software stack
5. Where things break or slow down
6. What growth looks like for them
7. Their email (ask naturally near the end: "What email should I send your report to?")

OPENING — use exactly this, then adapt:
"Hi, I'm the eevolvv AI. I map businesses and find every automation win inside them.
Tell me about yours — what do you do, and what's your biggest operational headache right now?"

COMPLETION SIGNAL: When you have enough data (5–8 exchanges AND you have their email),
end your FINAL message with this exact token: [READY_TO_GENERATE]
This tells the frontend to transition to report generation. Do NOT generate the report here.`

export async function POST(req: NextRequest) {
  // Rate limit: reuse existing lib/rateLimit.ts logic
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const limited = await checkRateLimit(ip)
  if (limited) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { messages } = await req.json()

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: CHAT_SYSTEM_PROMPT,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

---

### TASK 1B — Create `/app/api/extract-intake/route.ts` (Extract Structured Data from Conversation)

When `[READY_TO_GENERATE]` fires, the frontend POSTs the full conversation history here.
Claude extracts structured fields, then calls `/api/diagnostic` with them.

```typescript
// POST /api/extract-intake
// Body: { messages: { role: 'user' | 'assistant'; content: string }[] }
// Returns: { success: boolean; report: string; ... } (same shape as /api/diagnostic)

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Step 1: Extract structured data from conversation
  const extraction = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `Extract structured data from this business diagnostic conversation.
Return ONLY a JSON object with these fields (use null for anything not mentioned):
{
  "name": string | null,
  "email": string | null,
  "businessName": string | null,
  "businessType": string,
  "industry": string,
  "teamSize": string | null,
  "revenue": string | null,
  "topPains": string,
  "tools": string | null,
  "goals": string | null
}`,
    messages,
  })

  let extracted: Record<string, string | null>
  try {
    const raw = extraction.content[0].type === 'text' ? extraction.content[0].text : '{}'
    extracted = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}')
  } catch {
    return NextResponse.json({ success: false, error: 'Extraction failed' }, { status: 500 })
  }

  // Step 2: Validate minimum required fields
  if (!extracted.email || !extracted.businessType || !extracted.topPains) {
    return NextResponse.json(
      { success: false, error: 'Insufficient conversation data' },
      { status: 422 }
    )
  }

  // Step 3: Forward to existing diagnostic endpoint
  const diagnosticRes = await fetch(
    new URL('/api/diagnostic', req.url).toString(),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extracted),
    }
  )

  const result = await diagnosticRes.json()
  return NextResponse.json(result, { status: diagnosticRes.status })
}
```

---

### TASK 1C — Create `/components/ChatEngine.tsx` (Streaming Chat UI)

Replace `DiagnosticForm` in `page.tsx` with this new streaming-aware component.

**Full state machine:**
```typescript
type Message = { role: 'user' | 'assistant'; content: string }
type Phase = 'chatting' | 'generating' | 'report' | 'error'

interface ChatState {
  phase: Phase
  messages: Message[]
  streamingText: string      // buffer for current streaming response
  isStreaming: boolean
  report: string | null
  reportMeta: { businessName?: string; tier?: string } | null
  error: string | null
}
```

**Key behaviors to implement:**
1. **On mount** — POST `{ messages: [] }` to `/api/chat` to get the AI's opening message
2. **Streaming** — `EventSource`-style fetch loop reading `text/event-stream` chunks
3. **Typewriter cursor** — show `▍` at end of streamingText while `isStreaming === true`
4. **`[READY_TO_GENERATE]` detection** — strip token from visible text, set `phase: 'generating'`, call `/api/extract-intake`
5. **`phase: 'generating'`** — show loading skeleton (reuse the existing one from DiagnosticForm)
6. **`phase: 'report'`** — render report exactly as DiagnosticForm does (copy the existing report JSX)
7. **Input UX** — textarea grows with content; submit on Cmd/Ctrl+Enter or button; disable while AI streaming
8. **Auto-scroll** — scroll chat container to bottom on each new token (use `useEffect` + ref)
9. **Abort** — call AbortController on unmount to cancel in-flight streams

**Streaming fetch pattern (use this, not EventSource):**
```typescript
async function streamFromAPI(messages: Message[]) {
  const controller = new AbortController()
  // store controller ref for cleanup

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal: controller.signal,
  })

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6)
      if (payload === '[DONE]') { /* finalize */ break }
      try {
        const { text } = JSON.parse(payload)
        // append text to streamingText state
        // check for [READY_TO_GENERATE] in accumulated text
      } catch { /* skip malformed */ }
    }
  }
}
```

---

### TASK 1D — Update `app/page.tsx`

Four specific changes. Do not rewrite the whole file — surgical edits only.

**Change 1 — HERO_PHRASES array** (find the existing `HERO_PHRASES` const and replace):
```typescript
const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM', 'KIRANA SHOP',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER', 'SARI-SARI STORE',
] as const
```

**Change 2 — Hero body copy** (find the two `<p>` tags in the Hero section with the old copy):
```
// DELETE:
"From the corner gym to the Fortune 500 — we map your workflows, deploy AI automation, and permanently rebuild how your business operates."
"No software to learn. No consultants with decks. Just results."

// REPLACE WITH:
"We don't sell software. We become your AI operations team — mapping your workflows, deploying automations, and rebuilding how your business runs."
"From your corner store to your enterprise. eevolvving forward, together."
```

**Change 3 — Fix SHEET dev labels (bugs)**

Line ~1346, inside `CTAClose` component — DELETE this exact line:
```tsx
<div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.5, marginBottom: 24 }}>SHEET A-09 · CALL TO ACTION</div>
```

Line ~1390, inside `Footer` component — REPLACE:
```tsx
// DELETE:
<span>SHEET A-99 · DAY 60 AUDIT</span>
// REPLACE WITH:
<span>eevolvving forward, together.</span>
```

**Change 4 — Add Micro tier** (find `TIERS` array, add this as the first entry before `Seed`):
```typescript
{
  id: 'micro',
  code: 'T-00',
  name: 'Micro',
  label: 'AI Starter',
  price: '$29–$49/mo',
  who: 'Corner stores · Bodegas · Kirana shops · Solo operators',
  tagline: 'WhatsApp-native automations. Live in 48 hours.',
  features: [
    'AI business diagnostic',
    'Inventory reorder alerts',
    'Daily sales summary (WhatsApp)',
    'Supplier payment tracker',
    'New automation every 60 days',
    'English · Spanish · Portuguese',
  ],
  highlight: false,
},
```
If pricing grid is `grid-cols-4`, change to `grid-cols-5` for desktop (keep responsive breakpoints).

**Change 5 — Swap DiagnosticForm for ChatEngine**

Find the diagnostic section in page.tsx. Replace the section intro copy and the `<DiagnosticForm>` component:
```tsx
// OLD section kicker copy:
"Answer 12 questions about your business. Our AI analyzes your workflows and delivers a custom automation roadmap."

// NEW:
"Just talk to us. Our AI listens, asks the right follow-up questions, and maps every automation opportunity in your business. No forms. No scripts. Just a real conversation."

// OLD component:
<DiagnosticForm />

// NEW:
<ChatEngine />
// (import ChatEngine from '@/components/ChatEngine')
```

**Change 6 — Calendly CTA** (in `CTAClose` / post-report section, replace mailto link):
```tsx
// OLD:
<a href="mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request" ...>
  BOOK STRATEGY CALL →
</a>

// NEW:
// Add to imports at top of file:
import Script from 'next/script'

// Add inside component (before return):
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? ''

// Replace anchor with:
<>
  <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
  <button
    onClick={() => {
      if (CALENDLY_URL && typeof window !== 'undefined' && (window as any).Calendly) {
        ;(window as any).Calendly.initPopupWidget({ url: CALENDLY_URL })
      } else {
        window.location.href = 'mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request'
      }
    }}
    className="... (copy existing className from the anchor)"
  >
    BOOK STRATEGY CALL →
  </button>
</>
```

---

### TASK 1E — Update `lib/diagnosticPrompts.ts` (Add Micro-Retail Industry Contexts)

Add these three entries to the `INDUSTRY_CONTEXT` object (it's a `Record<string, string>`):

```typescript
'Corner Store / Bodega': `
INDUSTRY CONTEXT — CORNER STORE / BODEGA / MICRO-RETAIL:
Key automation targets: inventory reorder alerts, daily sales summary (WhatsApp), supplier
invoice tracking, loyalty program (WhatsApp/SMS), shift scheduling, shrinkage detection,
supplier price comparison, monthly P&L report.
Industry benchmarks: AI inventory recommendations increase GMV 46% (Packworks, 2025);
manual invoice processing costs $12–15/invoice vs $2–4 automated; AI reduces shrinkage 35%;
WhatsApp loyalty drives 20–25% repeat purchase increase.
Common stack: basic POS or cash register, WhatsApp, paper or basic spreadsheet.
Highest-ROI automations: inventory reorder trigger, daily WhatsApp sales summary, supplier
payment reminder, loyalty message sequence.
Language: "shrinkage", "reorder point", "COGS", "SKU", "foot traffic", "slow movers".`,

'Kirana Store': `
INDUSTRY CONTEXT — KIRANA STORE (INDIA):
Key automation targets: UPI payment reconciliation, inventory tracking, distributor ordering,
credit customer management (khata/udhaar), WhatsApp delivery orders, festive demand planning.
Industry benchmarks: 12M+ kirana stores in India; digital-first kiranas outgrow non-digital 3x;
khata automation saves 2–4 hrs/week of manual reconciliation.
Common stack: Vyapar/OkCredit for khata, PhonePe/Google Pay, WhatsApp Business, paper inventory.
Highest-ROI automations: khata/credit ledger automation, inventory reorder via JioMart/Udaan API,
WhatsApp order confirmation, UPI daily reconciliation.
Language: "khata", "udhaar", "distributor", "godown", "maal", "dukaan".`,

'Sari-Sari Store': `
INDUSTRY CONTEXT — SARI-SARI STORE (PHILIPPINES):
Key automation targets: inventory recommendations, GCash/Maya payment tracking, supplier reorder,
palengke price monitoring, tingi demand forecasting, loyalty tapping via Viber/WhatsApp.
Industry benchmarks: AI recommendations lifted sari-sari GMV 46% in 2 weeks (2025 pilot);
1.3M stores, P2.4T segment by 2030; most run on <P50K capital.
Common stack: GCash, Maya, Facebook Marketplace, WhatsApp/Viber, paper inventory.
Highest-ROI automations: AI sales recommendations (which SKUs to stock up on), GCash
reconciliation, supplier reorder alert, loyalty tapping.
Language: "tingi", "suki", "palengke", "piso", "tindahan", "GMV".`,
```

---

### TASK 1F — Supabase Migration (Add `chat_sessions` table)

Run this in the Supabase SQL editor (or via supabase CLI):

```sql
create table if not exists chat_sessions (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  ip_address    text,
  messages      jsonb       not null default '[]',
  extracted_data jsonb,
  submission_id  uuid        references submissions(id),
  status        text        default 'active'
                            check (status in ('active', 'completed', 'abandoned'))
);

create index on chat_sessions (ip_address, created_at);
create index on chat_sessions (submission_id);
```

---

## WORKSTREAM 2 — eevolvv.com ↔ talent.eevolvv.com Integration

Both apps are deployed separately. This workstream links them.

### TASK 2A — Add Talent Link to eevolvv.com Footer

In `app/page.tsx`, find the `FOOTER_LINKS` array or the footer section and add:

```typescript
// In the ENGAGE or SERVICES column of the footer:
['Talent Network', 'https://talent.eevolvv.com']
```

### TASK 2B — Add eevolvv/talent Section to Homepage

Add a new section in `app/page.tsx` AFTER the Pricing section, BEFORE the Diagnostic section:

```tsx
// New section — "When you need a human expert"
// Section number: 07 (shift DiagnosticForm to 08 if needed)
// Eyebrow: "EEVOLVV / TALENT"
// Title: "Sometimes the lever is a person."
// Body: "When the automation needs a human architect — a fractional expert, a scoped contractor,
//         a one-brief specialist — eevolvv/talent places the right person for the work."
// CTA: "Find your expert →" → href="https://talent.eevolvv.com"
// Visual: Use the mascot image (import it from /public or reference talent.eevolvv.com/mascot.png)
//         Keep the blueprint/lever aesthetic from the talent site
```

### TASK 2C — Add Talent CTA to AI Report Output

In `app/api/diagnostic/route.ts`, find where the report is assembled and add a line to the BASE_PROMPT:

```typescript
// In lib/diagnosticPrompts.ts, add to the end of BASE_PROMPT:
`\n\nAt the end of your report, if any recommendations require skilled human implementation
(custom integrations, complex automation builds, strategic consulting), add a brief note:
"For the builds that need expert hands, eevolvv/talent connects you with a vetted specialist.
Learn more: talent.eevolvv.com"`
```

---

## WORKSTREAM 3 — Talent App: Post-Rebrand Cleanup

The rebrand itself is done. These are the remaining tasks to make the talent app production-ready.

### TASK 3A — Install Fresh Dependencies

The broken `@archimedes/*` workspace symlinks were removed from `package.json`.
Run this from the `talent/` directory:

```bash
cd talent
npm install
```

This will install the clean dependency tree without the broken workspace packages.

### TASK 3B — Verify Build Passes

```bash
cd talent
npm run type-check   # should pass — tsconfig is now standalone
npm run build        # should pass — no @archimedes imports remain in source
```

If `type-check` fails on any remaining issue, check for other files that still reference `@archimedes/ui`. Search:
```bash
grep -r '@archimedes' talent/ --include='*.ts' --include='*.tsx' -n | grep -v node_modules | grep -v .next
```

### TASK 3C — Check for @archimedes/ui Components

The package.json had `@archimedes/ui` as a dependency. Search for any component imports from it:
```bash
grep -r 'from "@archimedes/ui"' talent/ --include='*.ts' --include='*.tsx' | grep -v node_modules
```

If found, either inline the component or replace with a Tailwind equivalent.

### TASK 3D — Vercel Config Update (Manual — Eduardo does this)

These are manual steps outside the codebase:
1. Rename Vercel project: `archimedes` → `eevolvv-talent`
2. Add custom domain: `talent.eevolvv.com`
3. DNS: `CNAME talent.eevolvv.com → cname.vercel-dns.com`
4. Add env vars to Vercel:
   ```
   NEXT_PUBLIC_TALENT_DOMAIN=talent.eevolvv.com
   NEXT_PUBLIC_CONTACT_EMAIL=hello@eevolvv.com
   CONTACT_EMAIL=hello@eevolvv.com
   RESEND_API_KEY=<from existing setup>
   RESEND_FROM_EMAIL=<once DNS verified: no-reply@talent.eevolvv.com>
   ANTHROPIC_API_KEY=<from existing setup>
   ```

---

## Execution Order

```
PHASE 1 — eevolvv.com core (do these first, they're in one file)
  [ ] 1D: page.tsx — HERO_PHRASES, hero copy, SHEET bug fixes, Micro tier, swap to ChatEngine
  [ ] 1E: lib/diagnosticPrompts.ts — add 3 new industry contexts

PHASE 2 — New API endpoints (parallel work)
  [ ] 1A: app/api/chat/route.ts — streaming chat endpoint
  [ ] 1B: app/api/extract-intake/route.ts — intake extractor

PHASE 3 — New component
  [ ] 1C: components/ChatEngine.tsx — streaming chat UI

PHASE 4 — Infrastructure
  [ ] 1F: Supabase migration (chat_sessions table)
  [ ] 1D Change 6: Calendly CTA (add env var NEXT_PUBLIC_CALENDLY_URL)

PHASE 5 — Integration
  [ ] 2A: Add talent link to eevolvv.com footer
  [ ] 2B: Add eevolvv/talent section to eevolvv.com homepage
  [ ] 2C: Add talent CTA to AI report prompt

PHASE 6 — Talent app cleanup
  [ ] 3A: npm install (clean deps)
  [ ] 3B: type-check + build verification
  [ ] 3C: Check @archimedes/ui component imports

PHASE 7 — Manual (Eduardo)
  [ ] 3D: Vercel rename + DNS + env vars for talent app
  [ ] Confirm NEXT_PUBLIC_CALENDLY_URL value
```

---

## Testing Checklist Before Deploy

**eevolvv.com:**
- [ ] Streaming chat end-to-end: conversation → `[READY_TO_GENERATE]` → loading → report renders
- [ ] `[READY_TO_GENERATE]` token is stripped from visible UI (user never sees it)
- [ ] Email is extracted from conversation and report is sent to it
- [ ] "SHEET A-09" label gone from CTAClose
- [ ] "SHEET A-99" label gone from Footer — replaced with "eevolvving forward, together."
- [ ] Micro tier renders in pricing (T-00, $29–49/mo)
- [ ] Post-report CTA opens Calendly popup (or falls back to mailto if env not set)
- [ ] Corner Store / Kirana / Sari-Sari industries produce relevant report content
- [ ] Mobile layout works for ChatEngine (textarea, scrolling)
- [ ] Rate limiting on /api/chat returns 429 after 3 requests
- [ ] `npm run build` passes with no TS errors

**talent.eevolvv.com:**
- [ ] `npm run build` passes (no @archimedes imports)
- [ ] LogoMark shows mascot PNG (not broken image)
- [ ] Header shows "EEVOLVV / TALENT" (not ARCHIMEDES)
- [ ] Footer shows "EEVOLVV / TALENT · DAY ZERO" and "EEVOLVVING FORWARD, TOGETHER"
- [ ] Join form submits and sends email from `no-reply@talent.eevolvv.com`
- [ ] Post form submits and sends email notification
- [ ] Privacy and Terms pages render (BRAND.talentName resolves correctly)
- [ ] No "anothertechweb.site" URLs remain in any rendered output

---

## Environment Variables

**eevolvv.com (existing + new):**
```bash
# Existing — keep:
ANTHROPIC_API_KEY=
RESEND_API_KEY=
FROM_EMAIL=hello@eevolvv.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RATE_LIMIT_MAX=3

# New — add:
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/eevolvv/strategy-call   # Eduardo confirms URL
```

**talent.eevolvv.com (new app):**
```bash
NEXT_PUBLIC_TALENT_DOMAIN=talent.eevolvv.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@eevolvv.com
CONTACT_EMAIL=hello@eevolvv.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=no-reply@talent.eevolvv.com
ANTHROPIC_API_KEY=
```

---

## Design Constraints (Do Not Break)

1. **Color palette** — `--paper` (warm cream #FAF7F4), `--ink` (#141413), `--accent` (dark red/brown `var(--accent)`), `--rule` for borders. Do not introduce new color values.
2. **Typography** — Space Grotesk for display/body, JetBrains Mono for `.mono` class, Newsreader italic for accent serif phrases. All three are loaded in layout.tsx.
3. **Animation style** — Keep the split-flap hero, counter animations, and fade-up on scroll. These are brand signatures — do not replace them.
4. **SectionHeader pattern** — `§ 0N · EYEBROW · TITLE · NOTE` — keep consistent across all sections.
5. **Chat UX** — The new ChatEngine must feel faster than a form, not slower. Target <500ms to first streaming token. Show the typing cursor (`▍`) immediately.
6. **Mascot treatment** — `talent/public/mascot.png` is pixel-art. Use `imageRendering: 'pixelated'` in CSS so it doesn't blur when scaled.

---

*Brief v2 — April 2026. Workstream 2 (rebrand) is complete. Focus on Workstreams 1 and 3.*

# eevolvv — Claude Code Implementation Brief
**Hand this file to Claude Code. It contains everything needed to execute both workstreams.**

---

## Context & Stack

This is a **Next.js 14 App Router** project (TypeScript, Tailwind) deployed on Vercel.
- AI: Anthropic `claude-sonnet-4-6` via `@anthropic-ai/sdk`
- DB: Supabase (submissions table, IP-based rate limiting)
- Email: Resend + react-email
- Fonts: Space Grotesk, JetBrains Mono
- Key files: `app/page.tsx` (1422 lines, full homepage), `app/api/diagnostic/route.ts`, `lib/diagnosticPrompts.ts`

Read `CLAUDE.md` for the full memory context before starting.

---

## WORKSTREAM 1: True AI Chat Engine + Homepage v2

### 1A. Create `/app/api/chat/route.ts` — Streaming Conversational Diagnostic

Build a **new streaming endpoint** that powers a real AI conversation (not a form).

```typescript
// POST /api/chat
// Body: { messages: {role: 'user'|'assistant', content: string}[], sessionId?: string }
// Response: text/event-stream (SSE)
```

**System prompt for this endpoint** — make Claude act as a warm, expert business consultant:

```
You are the eevolvv AI — a smart, direct business consultant. Your job is to
understand someone's business through natural conversation and identify every
automation opportunity inside it.

CONVERSATION RULES:
- Ask ONE question at a time. Never list multiple questions.
- Reference what they've already told you. Show you were listening.
- Be warm but efficient. No filler phrases like "Great!" or "Absolutely!"
- Ask follow-ups when answers are vague. Push for specifics.
- When you mention an automation opportunity mid-conversation, be specific.
- Use their industry's language naturally (if they say "covers" you say "covers").

INFORMATION TO COLLECT (through natural conversation, not interrogation):
1. What the business does + industry
2. Team size + revenue range
3. Top 2-3 time drains (be specific about hours/week)
4. Current tools/software stack
5. Where things break or slow down
6. What growth looks like for them

OPENING: Start with exactly this — then adapt:
"Hi, I'm the eevolvv AI. I map businesses and find every automation win inside them.
Tell me about yours — what do you do, and what's your biggest operational headache right now?"

COMPLETION SIGNAL: When you have enough data (typically 5-8 exchanges), end your
final question with the token: [READY_TO_GENERATE]
This tells the frontend to transition to report generation.

DO NOT generate the report here. Just signal readiness.
```

**Implementation:**
```typescript
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages, sessionId } = await req.json()

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: CONVERSATIONAL_SYSTEM_PROMPT,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
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

### 1B. Create `/components/ChatEngine.tsx` — Streaming Chat UI

Extract the chat UI from `page.tsx` into a standalone component and upgrade it to handle streaming.

**Key behaviors:**
- Displays streaming text with a typewriter cursor (`▍`) while AI is responding
- User can type while AI is still streaming (queue input)
- When `[READY_TO_GENERATE]` token detected in AI response → strip it, extract conversation data, call `/api/diagnostic`
- Smooth scroll to bottom on each new token
- Auto-focus input after AI finishes each response
- Mobile-friendly: textarea grows with content, submit on Cmd/Ctrl+Enter

**State shape:**
```typescript
type Message = { role: 'user' | 'assistant'; content: string }
type ChatState = 
  | { phase: 'chatting'; messages: Message[]; streaming: boolean; streamBuffer: string }
  | { phase: 'generating'; messages: Message[] }
  | { phase: 'report'; report: string; businessData: ExtractedData }
  | { phase: 'error'; error: string }
```

**Extract business data from conversation history** (call this when `[READY_TO_GENERATE]` fires):
```typescript
// POST to a new endpoint /api/extract-intake
// Sends full conversation history
// Claude extracts structured fields: { name, email, businessName, businessType, industry, revenue, teamSize, topPains, tools, errorPoints, customerJourney, hoursFreed }
// Then call /api/diagnostic with extracted data
```

---

### 1C. Update `app/page.tsx` — Homepage Redesign

#### Hero Section — New Copy

Replace the current hero copy with the new positioning:

**Main headline** (keep the split-flap animation, change the rotating words to include micro-retail):
```typescript
const HERO_PHRASES = [
  'CORNER STORE', 'GYM', 'RESTAURANT', 'LAW FIRM', 'KIRANA SHOP',
  'STARTUP', 'ENTERPRISE', 'BODEGA', 'CLINIC', 'LOGISTICS',
  'REAL ESTATE', 'AGENCY', 'FRANCHISE', 'MANUFACTURER', 'SARI-SARI STORE'
] as const
```

**Supporting body copy** — replace:
```
// OLD:
"From the corner gym to the Fortune 500 — we map your workflows, deploy AI automation, 
and permanently rebuild how your business operates."
"No software to learn. No consultants with decks. Just results."

// NEW:
"We don't sell software. We become your AI operations team — mapping your workflows, 
deploying automations, and rebuilding how your business runs."
"From your corner store to your enterprise. eevolvving forward, together."
```

**H1 subtitle** — replace "into the new era." with something warmer. Options:
```
"A service. Not a software."          ← clean, punchy, differentiating
"eevolvving forward, together."       ← communal, brand truth
```
Pick "A service. Not a software." for h1 (more contrast). Use "eevolvving forward, together." as the footer/closing line.

#### Add Micro Tier to Pricing

Add before the Seed tier in `TIERS` array:
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
    'AI business diagnostic (7 questions)',
    'Inventory reorder alerts',
    'Daily sales summary (WhatsApp)',
    'Supplier payment tracker',
    'New automation every 60 days',
    'English, Spanish, Portuguese',
  ],
  highlight: false,
}
```
Update grid to `repeat(5, 1fr)` or keep 4-col and show Micro differently (e.g., a banner above the grid or a separate "starter" row).

#### Fix Production Bugs

1. **Line 1346** in `CTAClose` component:
   ```typescript
   // DELETE this line:
   <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.5, marginBottom: 24 }}>SHEET A-09 · CALL TO ACTION</div>
   ```

2. **Line 1390** in `Footer` component:
   ```typescript
   // DELETE this line:
   <span>SHEET A-99 · DAY 60 AUDIT</span>
   // Replace the right side of the footer bar with:
   <span>eevolvving forward, together.</span>
   ```

3. **Post-report CTA** — replace mailto: with Calendly:
   ```typescript
   // OLD:
   <a href="mailto:hello@eevolvv.com?subject=eevolvv%20Strategy%20Call%20Request" ...>
     BOOK STRATEGY CALL →
   </a>

   // NEW — inline Calendly widget trigger:
   // If Calendly URL is not set, fall back to a lightweight inline form
   // Eduardo will confirm: const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL
   // Add script: <Script src="https://assets.calendly.com/assets/external/widget.js" />
   // CTA button: onClick={() => Calendly.initPopupWidget({ url: CALENDLY_URL })}
   ```

#### Diagnostic Section — New Copy

Replace:
```
// OLD:
"Answer 12 questions about your business. Our AI analyzes your workflows 
and delivers a custom automation roadmap."

// NEW:
"Just talk to us. Our AI listens, asks the right questions, and maps every 
automation opportunity in your business. No forms. No scripts. Just a conversation."
```

Replace `<DiagnosticForm>` with `<ChatEngine>` (the new streaming component).

---

### 1D. Add Micro-Retail Industry Contexts to `lib/diagnosticPrompts.ts`

Add these industry context blocks to `INDUSTRY_CONTEXT`:

```typescript
'Corner Store / Bodega': `
INDUSTRY CONTEXT — CORNER STORE / BODEGA / MICRO-RETAIL:
Key automation targets: inventory reorder alerts, daily sales summary, supplier invoice tracking,
WhatsApp loyalty program, shift scheduling, shrinkage detection, supplier price comparison,
monthly P&L report.
Industry benchmarks: AI inventory recommendations increase GMV 46% (Packworks Philippines, 2025);
manual invoice processing costs $12–15/invoice vs $2–4 automated; AI reduces shrinkage 35%;
WhatsApp loyalty programs drive 20–25% repeat purchase increase.
Common stack: basic POS or cash register, WhatsApp, manual spreadsheet or paper.
Highest-ROI automations: inventory reorder trigger, daily WhatsApp sales summary, supplier
payment reminder, loyalty message sequence.
Language: use terms like "shrinkage", "reorder point", "COGS", "SKU", "foot traffic", "slow movers".`,

'Kirana Store': `
INDUSTRY CONTEXT — KIRANA STORE (INDIA):
Key automation targets: UPI payment reconciliation, inventory tracking, supplier (distributor) 
ordering, credit customer management (khata), WhatsApp delivery orders, festive demand planning.
Industry benchmarks: 12M kirana stores in India; digital-first kiranas outgrow non-digital by 3x;
khata (credit ledger) automation eliminates 2–4 hrs/week of manual reconciliation.
Common stack: Vyapar/OkCredit for khata, PhonePe/Google Pay, WhatsApp Business, paper for inventory.
Highest-ROI automations: khata/credit ledger automation, inventory reorder via JioMart/Udaan API,
WhatsApp order confirmation, UPI reconciliation.
Language: use terms like "khata", "udhaar", "distributor", "godown", "maal", "dukaan".`,

'Sari-Sari Store': `
INDUSTRY CONTEXT — SARI-SARI STORE (PHILIPPINES):
Key automation targets: inventory recommendations, GCash/Maya payment tracking, supplier reorder,
palengke price monitoring, tingi (single-serve) demand forecasting, loyalty tapping.
Industry benchmarks: AI-driven recommendations lifted sari-sari GMV 46% in 2 weeks (2025);
1.3M stores targeting P2.4T segment by 2030; most run on <P50K capital.
Common stack: GCash, Maya, Facebook Marketplace, WhatsApp/Viber, paper inventory.
Highest-ROI automations: AI sales recommendations (which items to stock more of), GCash
reconciliation, supplier reorder alert, loyalty tapping via Viber/WhatsApp.
Language: use terms like "tingi", "suki", "palengke", "piso", "tindahan", "GMV".`,
```

---

### 1E. Supabase — Add `chat_sessions` table

Run this migration:

```sql
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ip_address text,
  messages jsonb not null default '[]',
  extracted_data jsonb,
  submission_id uuid references submissions(id),
  status text default 'active' check (status in ('active', 'completed', 'abandoned'))
);

create index on chat_sessions (ip_address, created_at);
create index on chat_sessions (submission_id);
```

---

## WORKSTREAM 2: Project Archimedes → eevolvv/talent

### IMPORTANT: Wait for Eduardo to share:
1. The Archimedes codebase (repo or folder)
2. The smallest-monkey logo crop from the eevolvv evolution strip

### When codebase is available, execute this checklist:

#### Step 1 — Audit all brand references
```bash
# Find every instance of Archimedes branding
grep -r "archimedes" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.html" --include="*.css" -i -l

# Also check:
grep -r "archimedes\.ai" . -i
grep -r "Archimedes" . --include="*.ts" --include="*.tsx"
```

#### Step 2 — Global rename
```typescript
// Replace patterns:
"Archimedes"        → "eevolvv/talent"
"archimedes"        → "eevolvv-talent"  (for slugs/routes/IDs)
"archimedes.ai"     → "talent.eevolvv.com"
"ARCHIMEDES"        → "EEVOLVV/TALENT"
// In package.json name field:
"archimedes"        → "eevolvv-talent"
```

#### Step 3 — Logo swap
```bash
# Eduardo will provide: talent-logo.png (the smallest monkey)
# Replace all logo asset references:
# public/archimedes-logo.* → public/talent-logo.*
# Update all <img src>, next/image src, favicon, og:image references
```

#### Step 4 — Meta / SEO
```typescript
// In layout.tsx or _document.tsx:
title: "eevolvv/talent — Micro-Consulting & Expert Contracting"
description: "The human layer of eevolvv. Scoped, vetted, data-matched talent for every business need."
og:image: "/talent-logo.png"
og:url: "https://talent.eevolvv.com"
```

#### Step 5 — Email templates
```
From name: "eevolvv/talent" (was: "Archimedes" or similar)
Subject lines: remove any "Archimedes" references
Footer: "eevolvv/talent · talent.eevolvv.com"
```

#### Step 6 — Environment variables
```bash
# Check .env.example or .env.local for any ARCHIMEDES_ prefixed vars
# Rename to TALENT_ or EEVOLVV_TALENT_
# Update Vercel environment variables accordingly
```

#### Step 7 — Vercel + DNS
```
- Rename Vercel project: archimedes → eevolvv-talent
- Add custom domain: talent.eevolvv.com
- Update DNS: CNAME talent.eevolvv.com → cname.vercel-dns.com
```

#### Step 8 — eevolvv.com integration points
Add to eevolvv.com `app/page.tsx`:
- Footer nav: `['Talent', 'https://talent.eevolvv.com']` under ENGAGE column
- New section in homepage (after Pricing): "eevolvv/talent — When you need a human expert"
- In AI report output: when recommending complex implementation, add CTA to talent.eevolvv.com

---

## Execution Order

```
WEEK 1:
  Day 1-2:  Create /api/chat streaming endpoint (1A)
  Day 2-3:  Build ChatEngine component (1B)
  Day 3-4:  Homepage copy + Micro tier + bug fixes (1C)
  Day 4:    Add industry contexts (1D)
  Day 5:    Supabase migration (1E) + integration testing

WEEK 2:
  Day 1:    Eduardo provides Archimedes repo + talent logo
  Day 1-3:  Execute Archimedes rebrand checklist (Workstream 2)
  Day 4:    Cross-link eevolvv.com ↔ talent.eevolvv.com
  Day 5:    QA + deploy both

LONG-TERM (after Week 2):
  → memory/projects/global-expansion.md
  → Micro tier WhatsApp integration
  → eevolvv/talent marketplace features
```

---

## Testing Checklist Before Deploy

- [ ] Streaming chat works end-to-end: conversation → `[READY_TO_GENERATE]` → loading → report
- [ ] `[READY_TO_GENERATE]` token stripped from visible output
- [ ] "SHEET A-09" label gone from CTAClose
- [ ] "SHEET A-99" label gone from Footer — replaced with "eevolvving forward, together."
- [ ] Micro tier appears in pricing grid
- [ ] Post-report CTA triggers Calendly (or fallback inline form)
- [ ] Mobile layout works for new ChatEngine
- [ ] Rate limiting still works on /api/chat (same 3/hr per IP logic)
- [ ] Streaming handles AbortController timeout gracefully
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No Vercel build errors (`npm run build`)

---

## Environment Variables Needed

```bash
# Existing (keep):
ANTHROPIC_API_KEY=
RESEND_API_KEY=
FROM_EMAIL=hello@eevolvv.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RATE_LIMIT_MAX=3

# New (add):
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/eevolvv/strategy-call
```

---

## Key Design Constraints (Do Not Break)

1. **Color palette**: `--paper` (warm cream #FAF7F4), `--ink` (#141413), `--accent` (dark red/brown), `--rule` (rule lines) — do not introduce new colors
2. **Typography**: Space Grotesk for body/display, JetBrains Mono for `mono` class, serif italic for accent phrases
3. **Animation style**: Keep split-flap hero, counter animations, fade-up on scroll — these are brand signatures
4. **SectionHeader pattern**: `§ 0N · EYEBROW · TITLE · NOTE` — keep consistent
5. **The terminal/dark-bg code blocks** used in Problem section — these are high-value visual anchors
6. **Streaming must feel fast** — target <500ms to first token from /api/chat

---

*Brief prepared: April 2026. Read CLAUDE.md for project memory. Read memory/projects/ for full context.*

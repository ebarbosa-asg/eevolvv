# Client Portal Audit — May 19, 2026

## Current Structure (669-line component)

The client portal at `/os/[slug]` has **5 sections:**

1. **Hero** — Dark gradient, headline, summary, 3 proof cards, plan sidebar
2. **Agent Console** — 5 command buttons, textarea, submit button
3. **Active Work** — 3-column grid of work items + submitted requests list
4. **Weekly Recommendations** — 2-column grid of 5 recommendations  
5. **Deliverable Factory** — 2-column grid of deliverables (scope/proof/timing)
6. **Ghost Locker** — Owned products + available add-ons sidebar

---

## Problems

### 1. Too dense for a non-technical client
- 6 sections, each with sub-lists, status badges, proofs, owners, timing
- A roofing company owner needs to understand their status in 5 seconds, not 5 minutes

### 2. Jargon overload
"Ghost Locker", "Deliverable Factory", "Agent Console", "proof strip", "SCO" — these make sense to us but not to a small business owner. They think "where's my stuff?"

### 3. No single source of truth
- Active work items, recommendations, deliverables, and locker products all show overlapping data
- A client can't tell "what's the one thing finished this week?"

### 4. The command section is too complex
- 5 buttons, a textarea, send button — feels like a dashboard, not a simple request
- A client should be able to type "need more roof photos" and have it work

### 5. Dark/light mode switching
- Hero is dark, then the page switches to light background
- jarring transition that doesn't feel cohesive

### 6. No mobile consideration
- Grids don't collapse well on mobile — a client checking on their phone gets broken layouts

---

## Recommended Redesign

### Target: 3 clear areas, 1 scroll

**Area 1: STATUS BAR (top, always visible)**
- Company name + plan (Agent Three)
- 3-4 key metrics in a row: Leads captured, Automations live, Requests this month
- No paragraphs — just numbers and labels

**Area 2: WHAT'S BEING BUILT (main content)**
- Timeline/list of work items ordered by status: Live → Building → Planned
- Each item is ONE line: `✅ Lead intake — live since May 15` or `🔧 Chatbot — ETA May 25`
- No proof text, no owner, no timing — all that goes behind a click

**Area 3: ASK FOR SOMETHING (fixed at bottom)**
- Simple input: "What do you need?" + Send button
- No command buttons — they add mental overhead
- After sending, the request appears in the "what's being built" list

### Removed sections
- No "Ghost Locker" — merge into What's Being Built
- No "Deliverable Factory" — merge into What's Being Built  
- No separate "Recommendations" — promote from recommendations to What's Being Built when approved
- No "Available Products" sidebar — move to a simpler add-on link

### Visual changes
- One consistent background (light mode, matches the main site)
- Minimal cards — border, title, status badge, no long descriptions
- Status badges: green (done), yellow (building), gray (planned)
- Everything clickable for details instead of inline text

---

## Implementation cost

| Change | Effort | Impact |
|--------|--------|--------|
| Strip to 3-area layout | 4-6 hours | High — clients instantly understand |
| Remove jargon (Ghost Locker → Your Stuff) | 30 min rename | High |
| Collapse proof/owner/timing behind click | 2 hours | Medium — less visual noise |
| Mobile responsiveness | 3 hours | Medium — clients check on phones |
| Simple input instead of command buttons | 2 hours | High — reduces choice paralysis |

**Total: ~12 hours for a full rebuild of ClientAgentPage.tsx**

---

Want me to rebuild it now? I can strip it down to the 3-area layout, make it data-forward, and ship it in one session.
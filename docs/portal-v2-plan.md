# Client Portal Rebuild Plan
## Data-Forward, Zero-Friction Product

---

### Design Philosophy

Every element on the page answers ONE question the client woke up asking:

1. *"Is my stuff working?"* → **Stats bar**
2. *"What have I gotten?"* → **Activity feed**
3. *"What do I do now?"* → **Request input**
4. *"Can I add more?"* → **Store (subtle)**

**Rule:** If a piece of text can't fit on a highway billboard, it doesn't go on the page. Details go behind clicks.

---

### Layout (top to bottom)

```
┌─────────────────────────────────────────────┐
│          COMPANY NAME · PLAN BADGE          │
│     ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│     │ 142 │ │  3  │ │  12 │ │  0  │        │
│     │leads│ │auto │ │reqs │ │ hrs │        │
│     │capt.│ │live │ │this │ │saved│        │
│     │     │ │     │ │  mo │ │     │        │
│     └─────┘ └─────┘ └─────┘ └─────┘        │
│ [only visible when data exists]             │
├─────────────────────────────────────────────┤
│                                             │
│  AUTOMATIONS RUNNING                        │
│  ┌──────────────────────────────────────┐   │
│  │ ✅ Lead Intake           Running      │   │
│  │   → 14 leads captured                │   │
│  │   → Avg response 4.2min              │   │
│  ├──────────────────────────────────────┤   │
│  │ ✅ Follow-up Sequence    Running      │   │
│  │   → 8 sequences active               │   │
│  │   → 40% recovery rate                │   │
│  ├──────────────────────────────────────┤   │
│  │ 🔧 Estimator Chatbot    Building      │   │
│  │   → ETA May 25                       │   │
│  └──────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│  DIGITAL ASSETS  (visible only if owned)    │
│  ┌──────────────┐  ┌──────────────────────┐│
│  │ 🌐 WEBSITE   │  │ 📊 MARKETING         ││
│  │ studio23.com │  │ Google Ads Running    ││
│  │ 142 visits   │  │ 3.2% conv rate       ││
│  │ 4 pages      │  │ $12.50 CPA           ││
│  └──────────────┘  └──────────────────────┘│
│     [click for full dashboard]              │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ACTIVITY                                   │
│  ────────────────────────────────────────── │
│  May 18  → Lead captured (Sarah J, Austin)  │
│  May 18  → Follow-up sent (Day 2 sequence)  │
│  May 17  → Chatbot answered 3 roof queries  │
│  May 16  → Website published (studio23.com) │
│  May 15  → Lead intake automation went live │
│  May 14  → Agent portal created             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ASK FOR ANYTHING                           │
│  ┌──────────────────────────────────────┐   │
│  │ What do you need?                    │   │
│  └──────────────────────────────────────┘   │
│  [Send → appears in Activity within sec]    │
│                                             │
├─────────────────────────────────────────────┤
│  ADD MORE (collapsible, bottom)              │
│  Website Build  ·  SCO Management           │
│  Extra Automation  ·  Custom Dashboard      │
│  [+ Add] [+ Add] [+ Add]                    │
└─────────────────────────────────────────────┘
```

---

### Component-by-Component Spec

#### 1. Stats Bar (always at top)

**Data pulled from:**
- `clients` table → leads captured (count where stage !== 'cold')
- `agent_deliverables` or `requests` table → requests this month
- `clients` table → automations live (count where stage='live' in work items)
- Hours saved = [(leads × 15min) + (follow-ups × 10min) + (chatbot × 5min)] — computed, not stored

**Design:**
- 4 boxes, each with 1 big number + 1 label below
- No color, no borders — just numbers on a clean background
- If a stat is 0, don't show the box (hide until there's data)

#### 2. Automations Running

**Data:**
- From ClientAgentPage `activeWork` array, filtered to stage='live' or 'building'
- Each has: title, status, deliverable, proof

**Design:**
- Stacked list, one item per row
- Each row: icon (✅/🔧) + title + status badge
- Details on click: expands to show "→ X leads / → X response time / → ETA"
- No paragraphs — only `→ bullet` lines with hard data

**Only show items that have data.** If proof says "N/A" or "pending", don't show it.

#### 3. Digital Assets (conditional)

**Website add-on** (if `paidAddOns` includes 'website'):
- Show: URL, page count, visit count (from analytics API)
- Click: full site stats (pages, traffic, form submissions)

**Marketing add-on / SCO** (if `paidAddOns` includes 'sco-management' or plan includes SCO):
- Show: campaigns running, conversion rate, CPA
- Click: full marketing dashboard

**Only visible if the client has paid for these.** Otherwise, they show in "Add More" only.

#### 4. Activity Feed

**Data:**
- From requests, deliverables, and work items — flattened into a chronological feed
- Each entry: DATE + TYPE + TITLE + SOURCE (e.g. "May 18 · Lead captured · Sarah J from website form")
- Sorted newest first

**Design:**
- Clean timeline, no cards
- Each row: date → arrow → action description
- The entire client's history with eevolvv in one scroll

**Critical:** This replaces the current Active Work + Recommendations + Deliverable Factory + Ghost Locker sections. One feed to rule them all.

#### 5. Ask For Anything (sticky bottom or inline)

**Design:**
- Single input: "What do you need?"
- Send button → POST to `/api/os/client-agent/[slug]/requests`
- Response appears in Activity feed immediately
- No command buttons, no templates — just a text field

**Validation:** If < 8 chars, show "Add a bit more detail" inline (don't block with a modal)

#### 6. Add More (collapsible footer)

**Design:**
- Small section at the bottom, potentially collapsed by default
- Each available add-on: name + price + [+ Add] button
- [+ Add] → Stripe checkout for that add-on
- Minimal: name, price, one-line description

**Products available:**
- Website Build — $2,000
- SCO Management — $500/mo  
- Extra Automation — $300–$750/mo
- Custom Dashboard — $1,500–$5,000

---

### Data Model Changes

**New API route needed:** `/api/os/client-agent/[slug]/activity`
- Returns merged, sorted feed of: requests + deliverables + work status changes
- Each item: `{ date, type, title, description, source }`

**Current routes that still work:**
- `/api/os/client-agent/[slug]/requests` — POST + GET
- `/api/os/client-agent/[slug]/deliverables` — GET

---

### Visual Spec

- **One background:** `var(--paper)` (light/warm) — no dark sections
- **Cards:** `1px solid var(--rule)` — no shadows, no rounded corners
- **Typography:** Big numbers (36px+), small labels (10px mono), body text (14px)
- **Status:** ✅ Live (green dot) · 🔧 Building (amber dot) · 📋 Planned (gray dot)  
- **Activity:** Vertical line timeline, left-aligned dates
- **Request input:** Full-width, border-bottom only (like search bars)
- **Mobile:** Single column, stacks vertically

---

### Implementation Order

1. Create new `components/ClientPortalV2.tsx` (separate file, don't touch old one yet)
2. Build StatsBar component
3. Build AutomationsList component
4. Build DigitalAssets component (conditional rendering)
5. Build ActivityFeed component + new API route
6. Build AskInput component
7. Build AddMoreFooter component
8. Wire `/os/[slug]` to new component
9. Test with Studio 23 data
10. Ship

---

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Old API routes lack activity/sort data | Build `/api/os/client-agent/[slug]/activity` — merges 3 tables |
| Clients with no data see empty page | Stats hide when zero, feed shows "No activity yet — ask for something below" |
| Removing sections breaks existing assumptions | Keep old component as fallback, toggle via env var |
| Mobile layout | Test at 375px breakpoint before shipping |

---

### Success Criteria

A client visiting their portal should be able to:
1. ✅ See "is my stuff working?" in 2 seconds (stats bar)
2. ✅ See "what's been done" in one scroll (activity feed)
3. ✅ Make a request in 5 seconds (ask input)
4. ✅ Add more services without being sold (add footer)
5. ✅ Understand everything without reading a paragraph

---

Ready to build? Say **GO** and I start with the StatsBar component.
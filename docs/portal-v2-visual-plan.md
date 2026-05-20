# Portal v2 — Visual-First Design
## "So easy a 10-year-old runs their business from it"

---

### Core Principle

**Replace every label with a graphic. Replace every paragraph with a color.**

The only question a client portal needs to answer is: **green or red?**
- Green = everything running. Go back to work.
- Yellow = something needs a decision.
- Red = broken, fix now.

Everything else is a tap to discover.

---

### Layout — 1 Screen, 5 Zones, 0 Words Required

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │   🟢                        │   │
│  │ STUDIO 23 ROOFING           │   │
│  │     Agent Three             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │ 🎯 │ │ ⚙️ │ │ 📋 │ │ ⏱  │      │
│  │ 142│ │  3 │ │ 12 │ │  0 │      │
│  └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  ┌─ YOUR GEARS ──────────────────┐ │
│  │ 🟢 Lead Catcher      14 this wk│ │
│  │ 🟢 Auto Follow        8 active │ │
│  │ 🟡 Chatbot           May 25   │ │
│  └────────────────────────────────┘ │
│                                     │
│  ┌─ YOUR STUFF ───────────────────┐ │
│  │  🌐        │  📊               │ │
│  │  142 vis   │  12 conv          │ │
│  │  ⬤⬤⬤⬤○   │  ⬤⬤⬤○○           │ │
│  └────────────┴───────────────────┘ │
│                                     │
│  ● May 18  Lead caught (Sarah)      │
│  ● May 18  Follow-up sent           │
│  ● May 17  Chatbot answered 3      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 💬 Say what you need...  [→] │  │
│  └──────────────────────────────┘  │
│                                     │
│  ＋ ＋ ＋                            │
│  🌐  📊  ⚙️  🖥️                    │
└─────────────────────────────────────┘
```

---

### Zone 1: Status Head

**What it replaces:** Current hero section (headline + summary + plan sidebar — 100+ words)

**Graphics:**
- Big traffic light dot at top-left: 🟢 = all automations live, 🟡 = something building, 🔴 = something broken
- Company name in bold (logo if they upload one)
- Plan badge (small, mono, no explanation)

**No text** except company name and plan name. The green dot says everything.

**Behavior:**
- Tap green dot → shows "All 3 automations running. No issues."
- Tap plan badge → shows plan details (included automations, what's available)

---

### Zone 2: Stat Tiles

**What it replaces:** Proof strip (3 cards with label + value + detail paragraph)

**Graphics:**
- 4 tiles in a row, each with a BIG icon + BIG number
- Icons are universally understood:
  - 🎯 Bullseye = leads captured (not "leads captured")
  - ⚙️ Gear = automations running (not "active automations")
  - 📋 Clipboard = requests this month (not "submitted requests")
  - ⏱️ Stopwatch = hours saved (not "estimated time recovered")
- Number is 36px bold. Icon is 24px. That's it.
- Below the number: a small colored bar (green if growing, gray if flat)

**No labels, no text.** The icon + number says everything.

**Behavior:**
- Tap a tile → shows the breakdown (e.g. tap 🎯 → "14 this week, 142 total. Up 12% from last month." — only appears on tap)

---

### Zone 3: Your Gears (Automations)

**What it replaces:** Agent Console + Active Work (150+ lines of text)

**Graphics:**
- Each automation is a horizontal card with:
  - 🟢/🟡/🔴 dot (status light — green = running, yellow = building, red = stopped)
  - Icon representing the automation type (🤖 = chatbot, 📞 = call handler, ✉️ = email)
  - Name in 14px bold
  - Right side: key metric in a small number (e.g. "14" for leads caught by this automation)
- Cards are separated by a thin line, no borders

**No descriptions, no paragraphs.** Just status dot + icon + name + number.

**Behavior:**
- Tap a card → slides open to show:
  - What it does (one line, 10 words max)
  - What it's done this week (numbers only)
  - If building: progress bar + ETA
  - If stopped: "Tap to restart"

---

### Zone 4: Your Stuff (Digital Assets)

**What it replaces:** Ghost Locker + Deliverable Factory (200+ lines)

**Graphics:**
- Only visible if the client owns these add-ons
- Each asset is a square card with:
  - Big icon (🌐 = website, 📊 = marketing, 📦 = product)
  - Key metric below (e.g. "142 visits" for website, "12 conversions" for ads)
  - Star rating bar (⬤⬤⬤⬤○) — 5-star visual for health/performance

**Behavior:**
- Tap 🌐 → opens mini website dashboard (page views, sources, last 7 days chart)
- Tap 📊 → opens mini marketing dashboard (campaigns, CPA, conversion rate)
- **If they don't own it → card doesn't appear here.** It's only in "Add More" at the bottom.

---

### Zone 5: Timeline (Activity Feed)

**What it replaces:** Submitted requests + Recommendations + everything else

**Graphics:**
- Vertical timeline with colored dots:
  - 🟢 Dot = something was completed
  - 🟡 Dot = something is in progress
  - 🔵 Dot = client request was received
- Each entry: dot → date (mono, small) → action (14px, max 10 words)
- No cards, no borders — just a clean vertical line with dots

**Example:**
```
🟢 May 18  → Lead caught → Sarah J from website
🟢 May 18  → Follow-up sent → Day 2 sequence
🟡 May 17  → Chatbot answered → 3 roof queries
🔵 May 16  → You asked → "Better lead forms"
🟢 May 15  → Lead Catcher went live
🟢 May 14  → Your page was created
```

**Behavior:**
- If there's no activity: show a single gray dot with "Nothing yet. Ask for something below."
- Tap any entry → shows full detail (time, source, outcome)

---

### Zone 6: The Ask Box

**What it replaces:** 5 command buttons + textarea + send button + status messages

**Graphics:**
- Clean text input with icon prefix 💬
- Placeholder: "What do you need?" (only words on the screen)
- Send button: right arrow → in a circle
- No labels, no instructions, no "minimum 8 characters" error — just validate silently

**Behavior:**
- Type → tap → request appears in Timeline within 2 seconds
- If request is too short: brief text appears below input "a bit more detail?" — no blocking
- After 3 requests: input shows "You've made 3 requests. We'll check them today."

---

### Zone 7: Add More (The Store)

**What it replaces:** Available products sidebar with descriptions + prices

**Graphics:**
- Icon row: 🌐 📊 ⚙️ 🖥️ — each is a plus icon on hover
- Each icon is 32px, no text
- Prices appear on hover/tap

**Behavior:**
- Tap 🌐 → "Website — $2,000 one-time" + [Buy] button
- Tap 📊 → "SCO Management — $500/mo" + [Buy]
- Tap ⚙️ → "Extra Automation — $300/mo" + [Buy]
- Tap 🖥️ → "Custom Dashboard — $1,500" + [Buy]
- Any Buy → Stripe checkout for that add-on

---

### Mobile Adaptation

**At 768px and below:**
- Stat tiles stack to 2x2 grid
- "Your Gears" single column
- "Your Stuff" single column
- Timeline full width
- Ask Box full width, attached to bottom of screen (sticky)
- Add More icons at very bottom

**At 375px:**
- Everything single column
- Status head: small (no plan badge on mobile — it's in the menu)
- Stat tiles: 4 in a 2x2 grid (icons smaller, numbers 24px)

---

### Graphics Inventory

| Element | Type | Notes |
|---------|------|-------|
| Status dot | 🟢🟡🔴 CSS circle | 16px, animated pulse on green |
| Stat icons | Emoji or SVG | 🎯 ⚙️ 📋 ⏱️ — must render crisp at 24px |
| Automation icons | Emoji or SVG | Per-type: 🤖 📞 ✉️ 💬 etc |
| Progress rings | CSS conic gradient | For "Your Stuff" health bars |
| Timeline dots | CSS circles | 10px, colored by type |
| Ask icon | SVG | 💬 as icon prefix in input |
| Add icons | SVG icons | 🌐 📊 ⚙️ 🖥️ |

---

### What a 10-year-old sees

1. **Green circle** → "It's working." (scrolls down)
2. **Big numbers with pictures** → "142 targets, 3 machines, 12 jobs, 0 hours." (doesn't care about hours)
3. **Machines with green dots** → "These are on." Sees "Chatbot" with yellow dot → "This one's coming."
4. **Website picture** → "Oh there's my site." 142 visits → "People came."
5. **Timeline with dots** → scrolls through. Sees "Lead caught (Sarah)" → "Oh that's the new customer."
6. **Ask box** → types "make the green dot bigger" → taps → it appears in timeline → they see it worked.
7. **Plus icons at bottom** → taps one → sees price → "Oh that costs money." Moves on.

**Every interaction produces visible feedback within 2 seconds. No dead ends. No error states that block. No text to read.**

---

### Implementation Plan

| Step | File | What |
|------|------|------|
| 1 | `components/portal-v2/StatusHead.tsx` | Company name + 🟢 dot + plan badge |
| 2 | `components/portal-v2/StatTiles.tsx` | 4 icon+number tiles, tap to expand |
| 3 | `components/portal-v2/GearsList.tsx` | Running automations with status dots |
| 4 | `components/portal-v2/YourStuff.tsx` | Website + Marketing cards (conditional) |
| 5 | `components/portal-v2/Timeline.tsx` | Visual activity feed |
| 6 | `components/portal-v2/AskBox.tsx` | Single input, instant feedback |
| 7 | `components/portal-v2/AddMore.tsx` | Icon row, tap to expand + buy |
| 8 | `components/portal-v2/Hub.tsx` | Combines all 7 zones + mobile CSS |
| 9 | `app/os/[slug]/page.tsx` | Swap ClientAgentPage → Hub |
| 10 | `lib/client-agent-pages.ts` | Remove fields no longer needed (keep for data) |

---

### CSS Additions

A single CSS file `portal-v2.css` with:
- Traffic light system (green/yellow/red variables)
- Timeline vertical line (CSS pseudo-element)
- Progress rings (conic gradients)
- Tap-expand transitions
- Mobile breakpoints

---

### Data Model

The new portal queries the same data. No model changes needed:
- `page.activeWork` → GearsList (filter by stage)
- `page.proofItems` → StatTiles (map to 4 tiles)
- `page.products` → YourStuff + AddMore (filter owned vs available)
- `requests` + `deliverables` → Timeline (merged, sorted)
- `commandPrompts` → removed entirely (AskBox replaces)

---

**GO** to build this? I'll scaffold the component directory first.
# eevolvv — eevolvv.com

> AI-native business transformation. Every business. Every size. Every industry.

---

## What This Is

Full Next.js 14 landing page + AI diagnostic engine for **eevolvv**. Built to:
- Convert visitors into qualified leads
- Run AI-powered business diagnostics in real-time (Claude API)
- Handle all 4 service tiers (Seed → Enterprise) + Retainer
- Be deployed to Vercel in under 10 minutes

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI Engine:** Claude API (claude-opus-4-5)
- **Fonts:** Syne + DM Mono + Instrument Serif
- **Animations:** CSS (no library needed)
- **Deployment:** Vercel

---

## Setup

### 1. Install dependencies
```bash
cd eevolvv
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `ANTHROPIC_API_KEY` — Get from console.anthropic.com
- `RESEND_API_KEY` — Optional, for email notifications (resend.com)

### 3. Run locally
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.

---

## How The AI Diagnostic Works

1. User fills 4-step intake form (10 questions total)
2. On submit: POST to `/api/diagnostic`
3. API formats business data into a structured prompt
4. Claude (claude-opus-4-5) generates a custom **eevolvv Report**
5. Report displays inline — formatted, actionable, specific
6. CTA to book strategy call via email

**System prompt:** `lib/diagnosticPrompts.ts` · **API route:** `app/api/diagnostic/route.ts`

Customize the system prompt to tune report quality.

---

## Customization

### Colors
All colors defined in `tailwind.config.js` and `app/globals.css` CSS variables.

Main palette:
- `signal` — #00ff94 (primary green)
- `pulse` — #ff6b35 (accent orange)
- `void` — #080808 (background)

### Pricing / Tiers
Edit the `TIERS` array in `app/page.tsx`

### Industries list
Edit the `INDUSTRIES` array in `app/page.tsx`

### AI Prompt
Edit `lib/diagnosticPrompts.ts`

---

## Next Steps (Phase 2 Additions)

- [ ] Stripe payment integration (Seed tier self-serve)
- [ ] Cal.com embed for strategy call booking
- [ ] Notion API — auto-create client workspace on form submit
- [ ] Resend email — send eevolvv Report copy to client email
- [ ] Make.com webhook — trigger internal Slack notification on new lead
- [ ] Analytics dashboard (track conversion rates by tier)
- [ ] Case studies section (add after first 3 clients)
- [ ] Admin dashboard to view all diagnostic submissions

---

## File Structure

```
eevolvv/
├── app/
│   ├── api/
│   │   └── diagnostic/
│   │       └── route.ts      ← AI engine (Claude API)
│   ├── globals.css           ← Design system + animations
│   ├── layout.tsx            ← Root layout + metadata
│   └── page.tsx              ← Landing + form + report UI
├── emails/
│   └── EvolutionReport.tsx   ← Transactional email template
├── lib/
│   └── diagnosticPrompts.ts ← System prompt + industry context
└── supabase/migrations/       ← Submissions table
```

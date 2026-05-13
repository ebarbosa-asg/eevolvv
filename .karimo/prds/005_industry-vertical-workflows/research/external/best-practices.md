# External Best Practices — Industry Vertical Workflows

## 1. Vertical AI Chatbot Conversation Design

**What makes it feel native, not generic:**
- Industry terminology from the first message. A dental chatbot should use "practice" not "business," "patients" not "customers," "hygiene recall" not "follow-up."
- Skip questions the industry pre-answers. A dental visitor doesn't need to explain what they do — the chatbot should already know they're a practice and ask about team structure (hygienists, front desk, assistants).
- Ask the right diagnostic questions per vertical. Dental: "What's your current no-show rate?" Restaurant: "What POS system are you on?" Fitness: "What's your monthly churn rate?"
- Quantify their pain in their own language. Dental: "$200–$300 per no-show slot." Restaurant: "RevPASH." Fitness: "EFT recovery rate."

**Industry-specific intake question sets matter more than prompt engineering.** The best vertical chatbots are pre-loaded with 5–8 industry-specific questions that surface the exact data needed to generate an expert recommendation.

**SMS has 98% open rate vs. <20% for email** — dental recall messages should be SMS-first.

## 2. Dental Vertical: What Works

**Key pain points that convert:**
- No-show reduction: industry average 4–7% no-show rate; top practices are at 1%. Every 1% improvement = significant revenue recovery ($200–300/slot).
- Recall campaigns: 55–65% average recall rate vs. 85–90% for top performers. Every 10% improvement = $50,000–$100,000 additional annual revenue.
- Insurance pre-auth: manual, time-consuming, high error rate. Automation saves 2–4 hrs/week per biller.
- New patient intake: digital pre-visit forms cut check-in time by 60%.

**Willingness to pay:** 64% of US dental practices would pay a 20% premium for AI-enhanced automation. Monthly SaaS pricing ($300–600/mo) strongly preferred over upfront software costs. 81% of practices adopted cloud solutions when offered monthly billing.

**Competitive landscape:** Weave ($204M 2024 revenue, 30,000+ customers), NexHealth, Doctible, Arini AI, Jarvis Analytics. These are communication + scheduling tools — they don't do diagnostic assessment + custom build. eevolvv's differentiator is the diagnostic → build service model, not the SaaS tool.

**Market size:** Dental practice management software: $1.96B global in 2025, 10.77% CAGR to $4.87B by 2034. North America = 53% share. Significant room for AI-native overlays.

## 3. Fitness Vertical: What Works

**Key pain points that convert:**
- Member churn: 4–6% monthly average. AI churn prediction models (ABC Glofox) flag at-risk members with 85% accuracy. Automated win-back reduces churn 15–25%.
- Lead follow-up: CrossFit and boutique studio average lead-to-trial conversion is 45.7% with automation (vs. 15–25% without). Response time under 5 minutes is critical.
- Failed payment recovery (EFT dunning): automated dunning sequences recover payments before memberships lapse.
- Class utilization: automated weekly utilization reports replace manual data pulling.

**ARPM benchmarks:** Boutique studios target $250+/member/month. Standard gyms: $50–150/month. LTV:CAC ratio should be 3:1 or higher.

**Market:** AI in fitness projected at $10.3B by 2030. 63% of boutique studios planning AI personalization by 2025. Glofox, ABC Fitness, Zen Planner, Mindbody are the incumbent platforms — none do diagnostic assessment + custom build.

**Churn is the number one concern for boutique studios**, making retention automation the highest-ROI first build.

## 4. Restaurant Vertical: What Works

**Key pain points that convert:**
- No-shows: 30–40% reduction with automated reservation confirmation sequences.
- Staff scheduling: 4–8 hrs/week saved with automated schedule generation.
- Inventory/food cost: 12–18% food cost reduction via smart inventory automation; 55% of restaurants use AI inventory daily.
- Toast data: 56% of businesses report revenue increase after automation adoption.

**Market maturity:** Restaurants are the most tech-saturated vertical (Toast, Square, OpenTable, Resy, 7shifts all have large installed bases). This makes the sales cycle harder — they've heard automation pitches before. ROI proof before implementation is critical: "Beyond the Demo" article confirms restaurant SaaS success depends on proving ROI before implementation.

**Competitive risk:** Restaurant operators change technology solutions more frequently than enterprise buyers. Higher churn risk for the vendor.

## 5. Prioritization Framework for First Vertical

Factors to score each vertical:

| Factor | Dental | Fitness | Restaurant |
|--------|--------|---------|------------|
| Market size (US) | Large ($2B+ software market) | Growing fast | Massive but saturated |
| Tech sophistication of buyers | Low-medium (legacy systems) | Medium | Medium-high (Toast, etc.) |
| Willingness to pay | High (64% pay 20% premium) | Medium | Medium |
| Competition for AI-diagnostic model | Low | Medium | High |
| Regulatory complexity | Medium (HIPAA) | Low | Low |
| Average practice revenue | High ($500K–$2M+) | Medium ($200K–$800K) | Varies widely |
| Sales cycle | Long (decision by owner/partner) | Short (owner-operator) | Medium |
| "Ghost work" clarity | Very clear (recall, no-shows) | Very clear (churn, EFT) | Clear but complex |

**Assessment:** Dental scores highest on willingness to pay and market opportunity, but HIPAA adds complexity. Fitness is the cleanest first build — clear pain (churn, EFT), owner-operator decision maker, short sales cycle, lower competition for the diagnostic model. Restaurant has the largest TAM but the most competitive and churn-prone environment for the vendor.

## 6. Vertical SaaS Build Strategy

**From Tidemark 2025 Vertical SaaS Benchmark Report:**
- Multi-product companies grow 21% faster than single-product vertical SaaS
- Vertical solutions command 2–3x higher ACVs than horizontal tools
- SMBs have quick sales cycles, low procurement friction, and are forgiving of missing features early

**Key insight for eevolvv:** The diagnostic → build model is not a SaaS tool — it's a service with a software front-end. This means:
1. First vertical defines the service delivery playbook, not just a feature set
2. Getting the diagnostic questions right matters more than getting the report sections right
3. Real integrations (Dentrix, Mindbody, Toast) are the lock-in mechanism, not the software

**Build one vertical to 100% completeness before touching the next.** The test of "built correctly": a client in that vertical who goes through the diagnostic should receive a report so specific that it names their software, benchmarks their actual KPIs, and recommends automations they can verify are real.

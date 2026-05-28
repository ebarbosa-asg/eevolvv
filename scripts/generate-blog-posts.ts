/**
 * BLOG POST GENERATION PIPELINE
 * 
 * Generates SEO-optimized blog posts using OpenRouter API.
 * Run: BATCH_SIZE=3 npx ts-node scripts/generate-blog-posts.ts
 * 
 * Picks the next N unwritten topics and generates posts.
 * Saves to content/blog/{slug}.md
 */

import fs from 'fs';
import path from 'path';

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '3', 10);
const OUTPUT_DIR = path.join(process.cwd(), 'content/blog');
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'anthropic/claude-sonnet-4';
const RATE_LIMIT_MS = 2000;

const INDUSTRY_TOPICS: Record<string, string[]> = {
  dental: [
    'how much does AI cost for a dental practice',
    'dental office automation for appointment reminders',
    'automating insurance verification for dentists',
    'how to reduce dental no-shows with AI',
    'AI for dental recall campaigns automatic',
    'dental practice management AI tools 2026',
    'automate dental patient intake forms',
    'AI voice assistant for dental offices',
    'dental office workflow automation ROI',
    'best AI scheduling software for dentists',
  ],
  legal: [
    'AI for law firms automating client intake',
    'legal practice management AI tools',
    'automate legal document intake for attorneys',
    'AI receptionist for law firms cost',
    'how law firms use AI for lead follow up',
    'legal case management automation software',
    'AI for personal injury law firms',
    'automating legal consultation scheduling',
    'law firm client communication automation',
    'best AI tools for solo attorneys 2026',
  ],
  'real-estate': [
    'AI for real estate agents lead follow up',
    'automate real estate client intake system',
    'real estate CRM automation AI',
    'AI for property management companies',
    'automate real estate showing scheduling',
    'best AI tools for real estate agents 2026',
    'AI lead response for real estate',
    'real estate transaction automation software',
    'automate real estate review requests',
    'AI for real estate investor operations',
  ],
  fitness: [
    'AI for gyms and fitness studios',
    'automate gym membership management',
    'fitness studio scheduling automation',
    'AI personal trainer appointment system',
    'gym membership retention automation',
    'automate fitness client intake forms',
    'best AI tools for gym owners 2026',
    'AI for personal trainers client management',
    'fitness business automation ROI',
    'automate fitness class booking system',
  ],
  restaurant: [
    'AI for restaurant reservation management',
    'restaurant reservation system automation',
    'automate restaurant customer follow up',
    'AI for restaurant marketing automation',
    'restaurant online ordering automation',
    'best AI tools for restaurant owners 2026',
    'automate restaurant review collection',
    'AI for restaurant staff scheduling',
    'restaurant table management automation',
    'reduce restaurant no shows with AI',
  ],
  contractors: [
    'AI for contractors lead management',
    'contractor quoting and estimate automation',
    'automate contractor scheduling system',
    'best AI tools for construction businesses',
    'contractor customer follow up automation',
    'AI for home improvement contractors',
    'automate contractor review requests',
    'HVAC business automation software',
    'plumber lead response automation AI',
    'contractor project management AI tools',
  ],
  salon: [
    'AI for hair salons booking system',
    'salon appointment reminder automation',
    'salon client management AI tools',
    'automate salon marketing follow up',
    'best AI tools for salon owners 2026',
    'salon text message appointment reminders',
    'AI for nail salon operations',
    'salon review collection automation',
    'barber shop scheduling automation',
    'salon customer retention automation',
  ],
  chiro: [
    'AI for chiropractic offices patient intake',
    'chiropractor appointment automation system',
    'chiropractic practice management AI',
    'automate chiropractic insurance verification',
    'chiropractor patient recall automation',
    'best AI tools for chiropractors 2026',
    'chiropractic no show reduction AI',
    'automate chiropractic patient forms',
    'AI for chiropractic billing and coding',
    'chiropractic marketing automation software',
  ],
  cleaning: [
    'AI for cleaning businesses lead management',
    'cleaning service scheduling automation',
    'automate cleaning business customer follow up',
    'cleaning company estimate automation',
    'best AI tools for cleaning business owners',
    'cleaning service route optimization automation',
    'AI for house cleaning businesses',
    'cleaner customer review automation',
    'commercial cleaning business automation',
    'cleaning service recurring booking AI',
  ],
  'med-spa': [
    'AI for med spas client intake',
    'med spa appointment scheduling automation',
    'automate med spa patient follow up',
    'med spa marketing automation AI',
    'best AI tools for med spa owners 2026',
    'med spa patient retention automation',
    'AI for aesthetic clinic operations',
    'med spa review collection automation',
    'automate med spa consultation booking',
    'med spa inventory management AI',
  ],
  'auto-shop': [
    'AI for auto repair shops customer intake',
    'auto shop appointment scheduling automation',
    'automate auto repair customer follow up',
    'best AI tools for auto shop owners 2026',
    'auto repair shop marketing automation',
    'AI for tire shops and service centers',
    'automate auto shop estimate requests',
    'auto repair customer review automation',
    'car dealership service center automation',
    'auto shop text message reminders',
  ],
  childcare: [
    'AI for daycare centers parent communication',
    'childcare enrollment automation software',
    'automate daycare billing and payments',
    'daycare parent communication AI tools',
    'best AI tools for childcare centers 2026',
    'AI for preschool operations management',
    'automate childcare waitlist management',
    'daycare attendance tracking automation',
    'childcare marketing automation',
    'AI for after school programs',
  ],
  accounting: [
    'AI for accounting firms client intake',
    'automate accounting appointment scheduling',
    'accounting firm client communication AI',
    'best AI tools for accountants 2026',
    'AI for CPA firms document collection',
    'automate tax preparation client intake',
    'accounting practice management AI',
    'AI for bookkeeping businesses',
    'accountant lead follow up automation',
    'tax firm client portal automation',
  ],
  general: [
    'what is ghost work in business operations',
    'how to find ghost work in your business',
    'ghost work audit step by step guide',
    'small business automation ROI calculator',
    'AI receptionist vs human receptionist cost',
    'how much does business automation cost',
    'best AI tools for small businesses 2026',
    'small business workflow automation guide',
    'automate business operations without coding',
    'AI for small business FAQ guide',
    'how AI agents replace administrative assistants',
    'top signs your business has ghost work',
    'why small businesses fail at automation',
    'AI automation for service businesses guide',
    'how to choose the right AI automation provider',
    'SMB automation trends in 2026',
    'ghost work ROI calculator for businesses',
    'AI for customer follow up automation guide',
    'automating business reporting with AI',
    'AI workflow automation for non-technical owners',
    'how much time does AI automation save per week',
    'AI for appointment scheduling and reminders',
    'automating invoice follow up with AI agents',
    'AI for customer review management',
    'voice AI for business phone answering',
    'AI chatbot vs AI agent what is the difference',
    'how to automate your small business in 30 days',
    'AI for business operations management',
    'business process automation cost breakdown 2026',
    'AI for multi location business automation',
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getExistingSlugs(): Set<string> {
  const slugs = new Set<string>();
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.readdirSync(OUTPUT_DIR).forEach(f => {
      if (f.endsWith('.md')) slugs.add(f.replace('.md', ''));
    });
  }
  return slugs;
}

async function generatePost(topic: string, industry: string): Promise<string | null> {
  console.log(`[generate] "${topic}" (${industry})...`);

  const prompt = `Write an SEO-optimized blog post about: "${topic}"

Requirements:
- 800-1200 words
- 3-5 subheadings (## subheading)
- YAML frontmatter with: title, description (<155 chars), date (today YYYY-MM-DD, QUOTED), author (eevolvv), tags (array of 3-5)
- One internal link to https://eevolvv.com/diagnostic somewhere in the body
- Genuinely useful, not promotional
- Natural language, readable

Return ONLY valid markdown starting with --- frontmatter.`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[error] API ${res.status}: ${err.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || !content.startsWith('---')) {
      console.error(`[error] No valid frontmatter in response`);
      return null;
    }

    return content.trim();
  } catch (e: any) {
    console.error(`[error] Fetch failed: ${e.message}`);
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  if (!API_KEY) {
    console.error('FATAL: OPENROUTER_API_KEY not set');
    process.exit(1);
  }

  // Flatten all topics with their industry
  const allTopics: Array<{ topic: string; industry: string; slug: string }> = [];
  for (const [industry, topics] of Object.entries(INDUSTRY_TOPICS)) {
    for (const topic of topics) {
      allTopics.push({ topic, industry, slug: slugify(topic) });
    }
  }

  const existing = getExistingSlugs();
  console.log(`[start] ${existing.size} existing posts. ${allTopics.length} total topics.`);

  const pending = allTopics.filter(t => !existing.has(t.slug));
  console.log(`[queue] ${pending.length} unwritten topics. Batch: ${BATCH_SIZE}`);

  let generated = 0;
  for (const item of pending) {
    if (generated >= BATCH_SIZE) break;

    const content = await generatePost(item.topic, item.industry);
    if (content) {
      const filePath = path.join(OUTPUT_DIR, `${item.slug}.md`);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`[saved] ${item.slug}.md`);
      generated++;
    }

    if (generated < BATCH_SIZE) await delay(RATE_LIMIT_MS);
  }

  console.log(`[done] Generated ${generated} posts this run.`);
}

main().catch(e => { console.error(e); process.exit(1); });
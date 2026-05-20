/**
 * STRIKER DEEP SCRAPE — Extract phone numbers by clicking into results
 */
import { chromium } from 'playwright-chromium';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface DeepLead {
  company: string;
  phone: string;
  rating: number;
}

async function deepScrapeVertical(query: string, limit: number = 10) {
  console.log(`\n[DeepStriker] Deep scraping: ${query}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(searchUrl);
    await page.waitForTimeout(6000);

    // Wait for feed
    await page.waitForSelector('[role="feed"]', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Get all result anchor elements
    const resultLinks = await page.$$('a.hfpxzc');
    console.log(`[DeepStriker] Found ${resultLinks.length} results`);

    const leads: DeepLead[] = [];

    for (let i = 0; i < Math.min(resultLinks.length, limit); i++) {
      try {
        // Click the result to open detail panel
        await resultLinks[i].click();
        await page.waitForTimeout(2000);

        // Extract from the detail panel
        const lead = await page.evaluate(() => {
          // Business name — try multiple selectors
          const nameEl =
            document.querySelector('.DUwDvf.lfPIob') ||
            document.querySelector('h1') ||
            document.querySelector('.a4cYgo');
          const company = nameEl?.textContent?.trim() || '';

          // Phone — try multiple selectors
          const phoneEl =
            document.querySelector('[data-tooltip="Copy phone number"]') ||
            document.querySelector('.CsEnBe') ||
            document.querySelector('button[data-item-id*="phone"]') ||
            document.querySelector('[aria-label*="phone"]');
          const phone = phoneEl
            ? (phoneEl.textContent?.trim() || phoneEl.getAttribute('aria-label') || '')
                .replace(/^[^0-9+]+/, '')
                .trim()
            : '';

          // Rating
          const ratingEl = document.querySelector('.ZkP5Je') || document.querySelector('[aria-label*="stars"]');
          const ratingText = ratingEl?.textContent?.match(/[\d.]+/)?.[0] || '0';

          return { company, phone, rating: parseFloat(ratingText) };
        });

        if (lead.company) {
          leads.push(lead);
          console.log(`[DeepStriker] #${i+1}: ${lead.company} | Phone: ${lead.phone || 'NONE'} | Rating: ${lead.rating}`);
        }
      } catch (err) {
        console.log(`[DeepStriker] Failed on result #${i}`);
        continue;
      }
    }

    // Push to Supabase
    console.log(`\n[DeepStriker] Pushing ${leads.length} leads to Supabase...`);
    let inserted = 0;
    for (const lead of leads) {
      const existingName = lead.company;

      // Check if already exists
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('company', existingName)
        .limit(1);

      if (existing && existing.length > 0) {
        // Update with phone if we have it
        if (lead.phone) {
          await supabase
            .from('clients')
            .update({
              phone: lead.phone,
              updated_at: new Date().toISOString(),
              health: lead.rating > 0 && lead.rating < 4 ? 'red' : lead.rating >= 4.5 ? 'yellow' : 'yellow',
            })
            .eq('id', existing[0].id);
          console.log(`[DeepStriker] Updated phone for ${existingName}: ${lead.phone}`);
        }
        continue;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: lead.company,
          company: lead.company,
          phone: lead.phone || null,
          notes: `DeepStriker Auto-Lead: Rating ${lead.rating}`,
          stage: 'diagnose',
          health: lead.rating > 0 && lead.rating < 4 ? 'red' : 'yellow',
        }])
        .select();

      if (error) {
        console.error(`[DeepStriker] Insert failed ${lead.company}:`, error.message);
      } else {
        console.log(`[DeepStriker] Pushed: ${lead.company}`);
        inserted++;
      }
    }

    console.log(`[DeepStriker] Complete. ${inserted} new leads, ${leads.length - inserted} updates/skipped.`);
  } catch (err) {
    console.error('[DeepStriker] Scrape failed:', err);
  } finally {
    await browser.close();
  }
}

async function run() {
  // High-priority verticals with phone extraction
  const queries = [
    'emergency plumbers in Dallas',
    'hvac maintenance Houston',
    'personal injury lawyers Austin',
    'med spa Dallas',
    'cosmetic dentist San Antonio',
  ];

  for (const q of queries) {
    await deepScrapeVertical(q, 8);
  }
}

run().catch(console.error);

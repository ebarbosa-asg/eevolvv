/**
 * EEVOLVV STRIKER ENGINE
 * The autonomous lead generation engine.
 * Scrapes, analyzes, and pushes leads to Supabase.
 */

import { chromium } from 'playwright-chromium';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function scrapeVertical(query: string, limit: number = 10) {
  console.log(`[Striker] Initiating strike on: ${query}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Google Maps Search
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(searchUrl);
    await page.waitForTimeout(5000);

    // 2. Extract Leads
    const leads = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.Nv2rb')); // Search result class
      return items.slice(0, 10).map(item => ({
        company: item.querySelector('.qBF1Pd')?.textContent || 'Unknown',
        rating: parseFloat(item.querySelector('.MW479')?.textContent || '0'),
        phone: 'Needs Lookup', // Google Maps obfuscates this, requires secondary hop
        address: 'Service Area',
        stage: 'diagnose',
        health: 'yellow'
      })).filter(l => l.company !== 'Unknown');
    });

    console.log(`[Striker] Found ${leads.length} potential targets.`);

    // 3. Push to Supabase
    for (const lead of leads) {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          company: lead.company,
          notes: `Striker Auto-Lead: Rating ${lead.rating}`,
          stage: 'diagnose',
          health: lead.rating < 4 ? 'red' : 'yellow'
        }])
        .select();

      if (error) console.error(`[Striker] Failed to push ${lead.company}:`, error.message);
      else console.log(`[Striker] Pushed: ${lead.company}`);
    }

  } catch (err) {
    console.error('[Striker] Strike failed:', err);
  } finally {
    await browser.close();
  }
}

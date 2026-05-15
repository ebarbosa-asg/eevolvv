import { scrapeVertical } from './engine';
import { getHighPriorityVerticals } from './verticals';

async function runMasterStrike() {
  const targets = getHighPriorityVerticals();
  console.log(`[Striker] Master Strike sequence starting for ${targets.length} verticals.`);
  
  for (const target of targets) {
    await scrapeVertical(target.query);
  }
  
  console.log('[Striker] Master Strike complete. Check your eevolvv OS Clients list.');
}

runMasterStrike();

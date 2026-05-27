/**
 * X/Twitter Posting Script
 * 
 * Reads from data/twitter-queue.json and posts the next queued tweet via xurl CLI.
 * Run: npx ts-node scripts/post-to-twitter.ts
 * 
 * Cron: Run 4x/day (8am, 12pm, 4pm, 8pm CDT) — posts 1 tweet per run
 * Ramp up to 2 tweets/run when queue starts running low.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const QUEUE_FILE = path.join(process.cwd(), 'data/twitter-queue.json');
const POSTS_PER_RUN = parseInt(process.env.POSTS_PER_RUN || '1', 10);

interface Tweet {
  id: string;
  pillar: 'ghost-work-receipts' | 'build-in-public' | 'volvv-e' | 'founder-pov';
  content: string;
  status: 'queued' | 'posted';
  postedAt?: string;
  error?: string;
}

function readQueue(): Tweet[] {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
}

function writeQueue(tweets: Tweet[]): void {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(tweets, null, 2), 'utf-8');
}

function postToTwitter(content: string): boolean {
  try {
    const result = execSync(`xurl post "${content.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });
    const parsed = JSON.parse(result);
    if (parsed.data?.id) {
      console.log(`[posted] ID: ${parsed.data.id}`);
      return true;
    }
    console.error(`[error] Unexpected response:`, result);
    return false;
  } catch (e: any) {
    console.error(`[error] Post failed: ${e.message}`);
    return false;
  }
}

function main() {
  const queue = readQueue();
  const queued = queue.filter(t => t.status === 'queued');

  if (queued.length === 0) {
    console.log('[done] No queued tweets.');
    return;
  }

  console.log(`[start] ${queued.length} queued, posting ${POSTS_PER_RUN} this run`);

  let posted = 0;
  for (const tweet of queued) {
    if (posted >= POSTS_PER_RUN) break;

    console.log(`[post] ${tweet.id} (${tweet.pillar})`);
    const success = postToTwitter(tweet.content);

    const idx = queue.findIndex(t => t.id === tweet.id);
    if (idx !== -1) {
      queue[idx].status = success ? 'posted' : 'queued';
      queue[idx].postedAt = success ? new Date().toISOString() : undefined;
      if (!success) queue[idx].error = 'Post failed';
    }

    if (success) posted++;

    // Rate limit: 3s between posts
    if (posted < POSTS_PER_RUN) {
      const next = performance.now() + 3000;
      while (performance.now() < next) {}
    }
  }

  writeQueue(queue);
  console.log(`[done] Posted ${posted} tweet(s). ${queued.length - posted} remaining queued.`);

  // Warn if running low
  const remaining = queue.filter(t => t.status === 'queued').length;
  if (remaining < 10) {
    console.log(`[warn] Only ${remaining} tweets left in queue. Run the queue generator.`);
  }
}

main();
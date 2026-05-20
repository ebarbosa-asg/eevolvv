import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ScoredLead {
  id: number;
  company: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  health: string;
  notes: string;
  stage: string;
  created_at: string;
  score: number;
  pain_score: number;
  recency_score: number;
  contact_score: number;
}

async function runLeadScoring() {
  console.log('🧠 STRIKER LEAD SCORING ENGINE');
  console.log('================================');
  
  // Fetch all leads in 'diagnose' stage
  const { data: leads, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stage', 'diagnose')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('No leads to score.');
    return;
  }

  console.log(`Scoring ${leads.length} leads...\n`);

  // Score each lead
  const scored: ScoredLead[] = leads.map((lead) => {
    let score = 0;
    
    // 1. PAIN SCORE (60% weight) - Low rating = high pain = high priority
    let painScore = 0;
    if (lead.health === 'red') {
      painScore = 48; // rating < 4 = dissatisfied = hungry for change
    } else if (lead.health === 'yellow') {
      painScore = 30; // avg rating = could be better
    } else {
      painScore = 15; // green = happy = hard to sell
    }
    
    // Bonus for known business type (more targeted = higher quality)
    if (lead.business_type && lead.business_type !== 'unknown' && lead.business_type !== '') {
      painScore += 12;
    }

    // 2. RECENCY SCORE (25% weight)
    const age = Date.now() - new Date(lead.created_at).getTime();
    const ageHours = age / (1000 * 60 * 60);
    let recencyScore = 0;
    if (ageHours < 1) recencyScore = 25;      // < 1 hour
    else if (ageHours < 6) recencyScore = 20;  // < 6 hours
    else if (ageHours < 24) recencyScore = 15; // < 1 day
    else if (ageHours < 72) recencyScore = 10; // < 3 days
    else if (ageHours < 168) recencyScore = 5; // < 1 week
    else recencyScore = 2;                     // older

    // 3. CONTACT READINESS (15% weight)
    let contactScore = 0;
    if (lead.phone) contactScore += 8;   // textable
    if (lead.email) contactScore += 5;   // emailable
    if (!lead.notes || !lead.notes.includes('SMS_LIVE_SENT')) contactScore += 2; // untouched

    // Total
    score = painScore + recencyScore + contactScore;

    return {
      id: lead.id,
      company: lead.company || lead.name || 'Unknown',
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      health: lead.health,
      notes: lead.notes || '',
      stage: lead.stage,
      created_at: lead.created_at,
      score,
      pain_score: painScore,
      recency_score: recencyScore,
      contact_score: contactScore,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Print top 10
  console.log('TOP 10 SCORED LEADS:');
  console.log('--------------------');
  scored.slice(0, 10).forEach((l, i) => {
    const hasPhone = l.phone ? '📱' : '📧';
    console.log(`#${i+1}. ${l.company} [SCORE: ${l.score}]`);
    console.log(`   Pain:${l.pain_score} Recency:${l.recency_score} Contact:${l.contact_score}`);
    console.log(`   Health:${l.health} ${hasPhone} Stage:${l.stage}`);
    if (l.phone) console.log(`   Phone: ${l.phone}`);
    console.log('');
  });

  console.log(`\nTotal scored: ${scored.length}`);
  console.log(`High priority (score > 35): ${scored.filter(l => l.score > 35).length}`);
  console.log(`Medium priority (20-35): ${scored.filter(l => l.score >= 20 && l.score <= 35).length}`);
  console.log(`Low priority (< 20): ${scored.filter(l => l.score < 20).length}`);
  
  // Return the full scored list
  console.log('');
  console.log('=== FULL RANKING (all leads) ===');
  scored.forEach((l, i) => {
    console.log(`${i+1}. ${l.company} | Score:${l.score} | Pain:${l.pain_score} | Rec:${l.recency_score} | Contact:${l.contact_score} | ${l.health} | ${l.phone ? 'Phone:'+l.phone : 'No phone'}`);
  });
}

runLeadScoring().catch(console.error);

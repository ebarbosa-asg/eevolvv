/**
 * STRIKER VERTICALS
 * High-Ticket and High-Frequency Service Businesses
 */

export const VERTICALS = [
  // High Priority (The current focus)
  { 
    id: 'plumber', 
    query: 'emergency plumbers in Dallas', 
    priority: 'high',
    pain_point: 'High manual dispatch overhead'
  },
  { 
    id: 'hvac', 
    query: 'hvac maintenance Houston', 
    priority: 'high',
    pain_point: 'Scheduling inefficiency'
  },
  
  // NEW: High-Ticket / Legal & Professional
  { 
    id: 'personal_injury', 
    query: 'personal injury lawyers Austin', 
    priority: 'medium',
    pain_point: 'Slow lead response time'
  },
  { 
    id: 'medical_spa', 
    query: 'med spa Dallas', 
    priority: 'medium',
    pain_point: 'Manual booking follow-ups'
  },
  { 
    id: 'dentist', 
    query: 'cosmetic dentist San Antonio', 
    priority: 'medium',
    pain_point: 'Appointment no-shows'
  },

  // NEW: Real Estate & Construction
  { 
    id: 'solar', 
    query: 'solar panel installation Texas', 
    priority: 'medium',
    pain_point: 'Cold lead qualification'
  },
  { 
    id: 'pool_service', 
    query: 'pool cleaning and repair Austin', 
    priority: 'low',
    pain_point: 'Route optimization issues'
  },
  { 
    id: 'landscaping', 
    query: 'commercial landscaping Dallas', 
    priority: 'low',
    pain_point: 'Quote generation delay'
  }
];

export function getHighPriorityVerticals() {
  return VERTICALS.filter(v => v.priority === 'high');
}

export function getAllVerticals() {
  return VERTICALS;
}

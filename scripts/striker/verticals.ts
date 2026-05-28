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
  },

  // ROTATED: New verticals (Texas pool saturated, need fresh queries)
  { 
    id: 'auto_repair', 
    query: 'auto repair shop Houston', 
    priority: 'high',
    pain_point: 'Manual estimate generation'
  },
  { 
    id: 'restoration', 
    query: 'water damage restoration Dallas', 
    priority: 'high',
    pain_point: 'Slow insurance claim handling'
  },
  { 
    id: 'property_management', 
    query: 'property management Austin', 
    priority: 'high',
    pain_point: 'Maintenance coordination overhead'
  },
  { 
    id: 'tree_service', 
    query: 'tree service Fort Worth', 
    priority: 'high',
    pain_point: 'Scheduling inefficiency'
  },
  { 
    id: 'locksmith', 
    query: 'locksmith San Antonio', 
    priority: 'high',
    pain_point: 'Missed emergency calls'
  },
  { 
    id: 'pest_control', 
    query: 'pest control Dallas', 
    priority: 'high',
    pain_point: 'Route optimization'
  },
  { 
    id: 'roofing', 
    query: 'roofing contractor Houston', 
    priority: 'high',
    pain_point: 'Lead follow-up speed'
  },
  { 
    id: 'garage_door', 
    query: 'garage door repair Austin', 
    priority: 'high',
    pain_point: 'High call volume handling'
  }
];

export function getHighPriorityVerticals() {
  return VERTICALS.filter(v => v.priority === 'high');
}

export function getAllVerticals() {
  return VERTICALS;
}

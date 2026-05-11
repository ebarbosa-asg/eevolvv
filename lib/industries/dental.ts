export const VERTICAL_CONFIG = {
  key: 'Dental / Oral Health',

  intakeQuestions: [
    'What practice management software do you use? (Dentrix, Eaglesoft, Open Dental, Curve Dental, or other)',
    'What is your current recall rate — the percentage of active patients who come in for hygiene appointments at least once per year? Industry average is 55–65%.',
    'What is your current no-show rate? Industry average is 4–7% of scheduled appointments.',
    'How many new patients does your practice add per month on average?',
    'What percentage of your patients are insurance-based vs. fee-for-service?',
    'How do you currently handle recall outreach — phone calls, automated reminders, postcards, or a combination?',
    'How many front-desk team members handle scheduling and patient communication?',
  ],

  benchmarks: {
    recallRate: { avg: '55–65%', target: '85–90%', dollarImpact: '$50K–$100K/yr per provider per 10% gain' },
    noShowRate: { avg: '4–7%', target: '<1%', dollarPerSlot: '$200–$300 lost production per missed slot' },
    treatmentAcceptance: { avg: '55–65%', target: '70–80%' },
    collectionRate: { target: '98%+' },
    daysInAR: { target: '<30 days' },
  },

  softwareOptions: ['Dentrix', 'Eaglesoft', 'Open Dental', 'Curve Dental', 'Other'],

  automationCatalog: [
    {
      name: 'Recall Outreach Sequence',
      timeline: 'Month 1',
      builder: 'eevolvv',
      description: 'Automated multi-touch recall campaign for patients due for hygiene. Text + email sequence: 3-month advance notice, 1-month reminder, 2-week final. Tracks confirmed vs. unconfirmed and escalates.',
    },
    {
      name: 'No-Show Confirmation & Rescheduling',
      timeline: 'Month 1',
      builder: 'eevolvv',
      description: 'Day-before confirmation text with one-tap confirm/cancel. If no-show occurs: automatic rescheduling offer with 3 time slot options. Captures the slot before it goes to waste.',
    },
    {
      name: 'Insurance Pre-Authorization Tracking',
      timeline: 'Month 2',
      builder: 'eevolvv',
      description: 'Tracks pending pre-auth requests, alerts when approvals are delayed beyond 5 business days, and auto-escalates to the billing team. Prevents treatment delays and billing surprises.',
    },
    {
      name: 'New Patient Nurture Sequence',
      timeline: 'Month 2',
      builder: 'eevolvv',
      description: '30-day automated welcome sequence for new patients: intake form reminder, pre-appointment prep, post-visit check-in, and 6-month recall scheduling prompt.',
    },
    {
      name: 'AR Follow-Up Automation',
      timeline: 'Month 3',
      builder: 'eevolvv',
      description: 'Automated aging accounts receivable follow-up: 30-day statement, 60-day reminder, 90-day final notice with payment plan offer. Targets Days in AR below 30.',
    },
  ],

  emailVocabulary: {
    customer: 'patient',
    payment: 'copay',
    appointment: 'hygiene appointment',
    cancellation: 'cancellation',
    retention: 'patient retention',
  },

  hipaaNote: 'DIAGNOSTIC ONLY: eevolvv\'s AI diagnostic is for operational analysis only — no PHI (Protected Health Information) is collected or stored. Patient-facing automation builds that involve PHI require a BAA (Business Associate Agreement) with eevolvv prior to data access.',

  kpiPanels: [
    { id: 'recallRate', label: 'Recall Rate', unit: '%', benchmarkAvg: 60, benchmarkTarget: 87.5, higherIsBetter: true },
    { id: 'noShowRate', label: 'No-Show Rate', unit: '%', benchmarkAvg: 5.5, benchmarkTarget: 1, higherIsBetter: false },
    { id: 'treatmentAcceptance', label: 'Treatment Acceptance Rate', unit: '%', benchmarkAvg: 60, benchmarkTarget: 75, higherIsBetter: true },
    { id: 'collectionRate', label: 'Collection Rate', unit: '%', benchmarkTarget: 98, higherIsBetter: true },
    { id: 'daysInAR', label: 'Days in AR', unit: 'days', benchmarkTarget: 30, higherIsBetter: false },
  ],

  onboardingFields: [
    { id: 'practiceManagementSoftware', label: 'Practice Management Software', type: 'select', options: ['Dentrix', 'Eaglesoft', 'Open Dental', 'Curve Dental', 'Other'], required: true },
    { id: 'softwareUsername', label: 'Software Login (Username / Email)', type: 'text', required: true, secure: false },
    { id: 'softwarePassword', label: 'Software Password', type: 'password', required: true, secure: true },
    { id: 'recallRate', label: 'Current Recall Rate (%)', type: 'number', required: true },
    { id: 'noShowRate', label: 'Current No-Show Rate (%)', type: 'number', required: true },
    { id: 'frontDeskCount', label: 'Front-Desk Team Members', type: 'number', required: true },
    {
      id: 'hipaaAcknowledgment',
      label: 'HIPAA Acknowledgment',
      type: 'checkbox',
      required: true,
      label_text: 'I understand that eevolvv\'s diagnostic is operational analysis only. Patient-facing automations involving PHI require a BAA, which will be executed separately.',
    },
  ],

  recallOpportunityFormula: (providerCount: number, currentRecallRate: number, targetRecallRate: number): number => {
    // Every 10% gain in recall rate = ~$50K-$100K/yr per provider
    // Use midpoint of $75K per 10% per provider
    const recallGap = (targetRecallRate - currentRecallRate) / 10
    return Math.round(providerCount * recallGap * 75000)
  },
} as const

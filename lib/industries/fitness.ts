export const VERTICAL_CONFIG = {
  key: 'Fitness / Gym / Studio',

  displayName: 'Fitness & Gym',

  intakeQuestions: [
    'What gym management software do you use? (Mindbody, Glofox, Zen Planner, Pike13, or other)',
    'What is your current monthly member churn rate? Even a rough estimate works.',
    'How do you currently follow up with new leads — phone, email, text, or automated?',
    'How often do EFT (electronic funds transfer) payments fail each month, and what is your recovery process?',
    'What percentage of leads who try a free trial or intro class convert to paid members?',
    'How do you currently identify at-risk members before they cancel?',
    'What percentage of your revenue comes from personal training or add-on services?',
  ],

  benchmarks: {
    churn: { avg: '4–6% monthly', target: '<4% monthly' },
    arpm: { standard: '$50–$150/member/month', boutique: '$250+/member/month' },
    leadConversion: { avg: '15–25%', withAutomation: '40–60%' },
    annualRetention: { median: '66.4%' },
    classUtilization: { target: '70%+' },
  },

  softwareOptions: ['Mindbody', 'Glofox', 'Zen Planner', 'Pike13', 'Other'],

  automationCatalog: [
    {
      name: 'Churn Early-Warning System',
      timeline: 'Month 1',
      builder: 'eevolvv',
      description:
        'Flags members showing at-risk behavior (declining check-in frequency, skipped classes, failed EFT) 30 days before likely cancellation. Triggers a re-engagement sequence.',
    },
    {
      name: 'EFT Dunning Recovery',
      timeline: 'Month 2',
      builder: 'eevolvv',
      description:
        'Automated failed payment recovery sequence: immediate notification, 3-day follow-up, 7-day final notice. Recovers 60–80% of failed EFT payments before membership lapses.',
    },
    {
      name: '14-Day Lead Nurture Sequence',
      timeline: 'Month 2',
      builder: 'eevolvv',
      description:
        'Automated email + SMS nurture for new leads and trial members. Day 1 welcome, Day 3 class recommendation, Day 7 check-in, Day 14 conversion offer.',
    },
    {
      name: 'Class Utilization Report',
      timeline: 'Month 3',
      builder: 'eevolvv',
      description:
        'Weekly automated report showing class fill rates, peak vs. off-peak utilization, and revenue per class hour. Flags underperforming time slots for schedule optimization.',
    },
    {
      name: 'Referral Campaign Automation',
      timeline: 'Month 3',
      builder: 'eevolvv',
      description:
        'Automated referral ask sent to high-satisfaction members (90+ day tenure, high check-in frequency). Tracks referral conversions and sends reward fulfillment triggers.',
    },
  ],

  emailVocabulary: {
    customer: 'member',
    payment: 'EFT',
    appointment: 'class',
    cancellation: 'cancellation',
    retention: 'member retention',
  },

  kpiPanels: [
    {
      id: 'churn',
      label: 'Monthly Churn Rate',
      unit: '%',
      benchmarkAvg: 5,
      benchmarkTarget: 4,
      higherIsBetter: false,
    },
    {
      id: 'leadConversion',
      label: 'Lead-to-Member Conversion',
      unit: '%',
      benchmarkAvg: 20,
      benchmarkTarget: 50,
      higherIsBetter: true,
    },
    {
      id: 'arpm',
      label: 'Avg Revenue Per Member',
      unit: '$',
      benchmarkAvgStandard: 100,
      benchmarkBoutique: 250,
      higherIsBetter: true,
    },
    {
      id: 'annualRetention',
      label: 'Annual Member Retention',
      unit: '%',
      benchmarkMedian: 66.4,
      higherIsBetter: true,
    },
    {
      id: 'classUtilization',
      label: 'Class Utilization Rate',
      unit: '%',
      benchmarkTarget: 70,
      higherIsBetter: true,
    },
  ],

  onboardingFields: [
    {
      id: 'gymSoftware',
      label: 'Gym Management Software',
      type: 'select',
      options: ['Mindbody', 'Glofox', 'Zen Planner', 'Pike13', 'Other'],
      required: true,
    },
    {
      id: 'softwareUsername',
      label: 'Software Username / Login',
      type: 'text',
      required: true,
      secure: false,
    },
    {
      id: 'softwarePassword',
      label: 'Software Password',
      type: 'password',
      required: true,
      secure: true,
    },
    {
      id: 'apiKey',
      label: 'API Key (if available)',
      type: 'text',
      required: false,
      secure: true,
    },
    {
      id: 'memberCount',
      label: 'Current Active Member Count',
      type: 'number',
      required: true,
    },
    {
      id: 'monthlyChurnRate',
      label: 'Monthly Churn Rate (%)',
      type: 'number',
      required: true,
    },
  ],

  retentionOpportunityFormula: (
    memberCount: number,
    arpm: number,
    currentChurnPct: number,
    targetChurnPct: number
  ): number => {
    const churnGap = (currentChurnPct - targetChurnPct) / 100
    return Math.round(memberCount * arpm * churnGap * 12)
  },
} as const

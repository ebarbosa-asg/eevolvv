// Interfaces
export interface ReceiptInput {
  businessName: string;
  businessType: string;
  employees: number;
  annualRevenue: number; // midpoint of range
  adminHoursPerWeek: number; // 1-40
  ghostWorkAreas: string[]; // e.g., ['scheduling', 'follow_ups']
}

export interface ReceiptResult {
  annualGhostWorkCost: number;
  hoursLostPerWeek: number;
  hoursLostPerYear: number;
  effectiveHourlyRate: number;
  breakdown: Array<{ area: string; hoursPerWeek: number; annualCost: number }>;
  recoveryPercentage: number; // Always 72
}

// Area shares as percentages
const AREA_SHARES: { [key: string]: number } = {
  scheduling: 0.18,
  follow_ups: 0.22,
  data_entry: 0.15,
  customer_service: 0.14,
  invoicing: 0.11,
  marketing: 0.10,
  reporting: 0.06,
  inventory: 0.04,
};

const WORK_WEEKS_PER_YEAR = 48;
const EMPLOYEE_HOURS_PER_YEAR = 2080; // 40 hours/week * 52 weeks
const EFFECTIVE_HOURLY_RATE_MULTIPLIER = 1.3;
const DEFAULT_RECOVERY_PERCENTAGE = 72;

export function calculateGhostWorkCost(input: ReceiptInput): ReceiptResult {
  const { businessName, businessType, employees, annualRevenue, adminHoursPerWeek, ghostWorkAreas } = input;

  // Calculate effective hourly rate
  const effectiveHourlyRate = (annualRevenue / EMPLOYEE_HOURS_PER_YEAR) * EFFECTIVE_HOURLY_RATE_MULTIPLIER;

  // Calculate total hours lost
  const hoursLostPerWeek = adminHoursPerWeek * employees;
  const hoursLostPerYear = hoursLostPerWeek * WORK_WEEKS_PER_YEAR;

  // Calculate total annual ghost work cost
  const annualGhostWorkCost = Math.round(hoursLostPerYear * effectiveHourlyRate);

  // Calculate breakdown
  const breakdown = ghostWorkAreas
    .map(area => {
      const areaShare = AREA_SHARES[area] || 0; // Default to 0 if area not found
      const areaHoursPerWeek = hoursLostPerWeek * areaShare;
      const areaAnnualCost = areaHoursPerWeek * effectiveHourlyRate * WORK_WEEKS_PER_YEAR;
      return {
        area: area.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()), // Nicer formatting for area name
        hoursPerWeek: parseFloat(areaHoursPerWeek.toFixed(2)),
        annualCost: parseFloat(areaAnnualCost.toFixed(2)),
      };
    })
    .filter(item => item.annualCost > 0); // Only include areas with non-zero cost

  return {
    annualGhostWorkCost,
    hoursLostPerWeek,
    hoursLostPerYear,
    effectiveHourlyRate: parseFloat(effectiveHourlyRate.toFixed(2)),
    breakdown: breakdown,
    recoveryPercentage: DEFAULT_RECOVERY_PERCENTAGE,
  };
}

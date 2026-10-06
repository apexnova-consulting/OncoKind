export type IncomeBand = 'not_sure' | 'under_50k' | '50_to_100k' | '100_to_150k' | 'over_150k';

export type AccessIntake = {
  homeZip?: string;
  destinationLabel?: string;
  destinationZip?: string;
  destinationLat?: number;
  destinationLng?: number;
  homeLat?: number;
  homeLng?: number;
  visits?: number | 'not_sure';
  caregiverTravel?: boolean | 'not_sure';
  workLeaveDays?: number | 'not_sure';
  insuranceType?: string;
  cancerType?: string;
  incomeBand?: IncomeBand;
  travelMode?: 'car' | 'air' | 'not_sure';
};

export type CostAssumption = {
  id: string;
  label: string;
  amount: number;
  editable: boolean;
};

export type CostEstimate = {
  lowCents: number;
  highCents: number;
  miles: number;
  hours: number;
  assumptions: CostAssumption[];
  disclaimer: string;
};

const DEFAULTS = {
  milesPerHour: 50,
  gasPerMileCents: 22,
  lodgingPerNightCents: 18000,
  mealsPerDayCents: 6000,
  caregiverMultiplier: 1.35,
  lostWorkDayCents: 20000,
};

function zipToApproxPoint(zip: string): { lat: number; lng: number } | null {
  const numeric = Number(String(zip).slice(0, 5));
  if (!Number.isFinite(numeric) || numeric < 501 || numeric > 99950) return null;
  const lat = 24 + (numeric % 2300) / 100;
  const lng = -125 + (numeric % 5000) / 80;
  return { lat, lng };
}

export function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * 3958.8 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function estimateTravelCost(intake: AccessIntake): CostEstimate {
  const home = intake.homeLat && intake.homeLng
    ? { lat: intake.homeLat, lng: intake.homeLng }
    : zipToApproxPoint(intake.homeZip ?? '');
  const dest = intake.destinationLat && intake.destinationLng
    ? { lat: intake.destinationLat, lng: intake.destinationLng }
    : zipToApproxPoint(intake.destinationZip ?? '');

  const miles = home && dest ? Math.round(haversineMiles(home, dest)) : 120;
  const visits = typeof intake.visits === 'number' && intake.visits > 0 ? intake.visits : 6;
  const hours = Math.round((miles / DEFAULTS.milesPerHour) * 10) / 10;
  const lodgingNights = miles > 80 ? visits : 0;
  const gas = miles * 2 * visits * DEFAULTS.gasPerMileCents;
  const lodging = lodgingNights * DEFAULTS.lodgingPerNightCents;
  const meals = visits * DEFAULTS.mealsPerDayCents;
  const caregiver = intake.caregiverTravel === true ? Math.round(gas * 0.35) : 0;
  const work = typeof intake.workLeaveDays === 'number' ? intake.workLeaveDays * DEFAULTS.lostWorkDayCents : 0;
  const base = gas + lodging + meals + caregiver + work;

  const assumptions: CostAssumption[] = [
    { id: 'miles', label: `Round-trip miles per visit (${miles} one way)`, amount: miles * 2, editable: true },
    { id: 'visits', label: 'Expected visits', amount: visits, editable: true },
    { id: 'gas', label: 'Travel (gas or ground)', amount: gas, editable: true },
    { id: 'lodging', label: 'Lodging nights', amount: lodging, editable: true },
    { id: 'meals', label: 'Meals', amount: meals, editable: true },
    { id: 'caregiver', label: 'Caregiver travel add-on', amount: caregiver, editable: true },
    { id: 'work', label: 'Lost work days (optional)', amount: work, editable: true },
  ];

  return {
    lowCents: Math.round(base * 0.85),
    highCents: Math.round(base * 1.25),
    miles,
    hours,
    assumptions,
    disclaimer: 'Estimate only, not financial advice. Every assumption is visible and editable.',
  };
}

export function formatCentsRange(low: number, high: number): string {
  const fmt = (cents: number) => `$${Math.round(cents / 100).toLocaleString('en-US')}`;
  return `${fmt(low)} to ${fmt(high)}`;
}

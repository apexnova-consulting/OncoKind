export type CenterSeed = {
  center_id: string;
  name: string;
  city: string;
  state: string;
  intake_channel: 'portal' | 'fax' | 'email' | 'phone';
  contact: string;
  accepted_formats: string[];
  max_mb: number;
  typical_turnaround_days: number;
  last_verified_on: string | null;
  verified_by: string | null;
  next_verification_due: string;
  status: 'unverified' | 'active';
};

const NAMES = [
  ['Memorial Cancer Institute', 'Miami', 'FL'],
  ['Lakeside Oncology Center', 'Chicago', 'IL'],
  ['Riverbend Cancer Hospital', 'Nashville', 'TN'],
  ['Pacific Ridge Cancer Center', 'Seattle', 'WA'],
  ['Cedar Grove Cancer Institute', 'Austin', 'TX'],
  ['Northlight Comprehensive Cancer', 'Boston', 'MA'],
  ['Summit Valley Cancer Center', 'Denver', 'CO'],
  ['Harborview Oncology Network', 'San Diego', 'CA'],
  ['Prairie Star Cancer Institute', 'Minneapolis', 'MN'],
  ['Blue Ridge Cancer Center', 'Asheville', 'NC'],
  ['Gulf Coast Cancer Hospital', 'Houston', 'TX'],
  ['Great Lakes Cancer Institute', 'Detroit', 'MI'],
  ['Capitol Oncology Partners', 'Washington', 'DC'],
  ['Sunset Mesa Cancer Center', 'Phoenix', 'AZ'],
  ['Atlantic Point Cancer Institute', 'Philadelphia', 'PA'],
  ['Maplewood Cancer Hospital', 'Portland', 'OR'],
  ['Heartland Oncology Center', 'Kansas City', 'MO'],
  ['Bayou City Cancer Institute', 'New Orleans', 'LA'],
  ['Twin Rivers Cancer Center', 'Pittsburgh', 'PA'],
  ['Sierra Crest Oncology', 'Sacramento', 'CA'],
  ['Lakeshore Cancer Hospital', 'Cleveland', 'OH'],
  ['Pine Barrens Cancer Center', 'Tampa', 'FL'],
  ['Iron Range Oncology', 'Milwaukee', 'WI'],
  ['Canyon View Cancer Institute', 'Salt Lake City', 'UT'],
  ['Tidewater Cancer Hospital', 'Norfolk', 'VA'],
  ['Redwood Oncology Partners', 'San Francisco', 'CA'],
  ['Cottonwood Cancer Center', 'Oklahoma City', 'OK'],
  ['Hudson Valley Cancer Institute', 'New York', 'NY'],
  ['Desert Spring Oncology', 'Las Vegas', 'NV'],
  ['Elm Street Cancer Center', 'Atlanta', 'GA'],
] as const;

export const CENTER_SEEDS: CenterSeed[] = NAMES.map(([name, city, state], index) => ({
  center_id: `center_${String(index + 1).padStart(2, '0')}`,
  name,
  city,
  state,
  intake_channel: index % 4 === 0 ? 'portal' : index % 4 === 1 ? 'fax' : index % 4 === 2 ? 'email' : 'phone',
  contact: 'Unverified. Confirm with the center before sending.',
  accepted_formats: ['pdf'],
  max_mb: 25,
  typical_turnaround_days: 7,
  last_verified_on: null,
  verified_by: null,
  next_verification_due: '2027-01-23',
  status: 'unverified',
}));

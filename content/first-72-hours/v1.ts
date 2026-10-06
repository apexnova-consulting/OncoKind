export type First72Bucket = 'today' | 'day1' | 'day2' | 'day3' | 'week1';
export type First72Category =
  | 'records'
  | 'testing'
  | 'appointment_prep'
  | 'second_opinion'
  | 'trials'
  | 'insurance'
  | 'work_leave'
  | 'financial_aid'
  | 'support_circle'
  | 'self_care';

export type First72Task = {
  id: string;
  bucket: First72Bucket;
  category: First72Category;
  title: string;
  why: string;
  how: string[];
  script?: string;
  minutes: number;
  deepLink?: string;
};

export const FIRST_72_CONTENT_META = {
  version: '1.0.0',
  source: 'OncoKind First 72 Hours Caregiver Playbook',
  clinicalReviewer: 'Pending named clinical reviewer',
  reviewDate: '2026-10-04',
  status: 'draft_pending_clinical_legal',
} as const;

export const FIRST_72_TASKS: First72Task[] = [
  {
    id: 'records-request',
    bucket: 'today',
    category: 'records',
    title: 'Request the pathology report and imaging discs',
    why: 'You will need copies for second opinions, insurance, and your own records.',
    how: [
      'Call medical records or use the patient portal.',
      'Ask for pathology, imaging, and the most recent clinic note.',
      'Request a patient copy, not only a transfer to another office.',
    ],
    script:
      'Hello, I am the family caregiver. I need a patient copy of the pathology report, recent imaging, and the latest clinic note. Can you tell me how to request those today?',
    minutes: 15,
    deepLink: '/journey',
  },
  {
    id: 'biomarker-status',
    bucket: 'today',
    category: 'testing',
    title: 'Confirm whether biomarker or molecular testing was ordered',
    why: 'These results often shape treatment conversations. Ask, do not assume.',
    how: [
      'Check the pathology report for molecular or IHC language.',
      'If nothing is listed, ask the oncology nurse whether testing was sent.',
      'Write down the lab name if you are told a sample was sent out.',
    ],
    script:
      'Has comprehensive biomarker or molecular testing been ordered on this sample? If not, who on the team can review whether it should be?',
    minutes: 10,
    deepLink: '/journey/complete-the-picture',
  },
  {
    id: 'appointment-prep',
    bucket: 'today',
    category: 'appointment_prep',
    title: 'Write three questions for the next appointment',
    why: 'Appointments move quickly. A short list keeps the visit focused.',
    how: [
      'Open your Cancer Profile if you have one.',
      'Pick three questions you still cannot answer.',
      'Bring a notebook or use the Doctor Prep Sheet when available.',
    ],
    minutes: 12,
    deepLink: '/journey/second-opinion',
  },
  {
    id: 'insurance-card',
    bucket: 'day1',
    category: 'insurance',
    title: 'Photograph both sides of the insurance card',
    why: 'Authorizations and referrals stall when the card is missing.',
    how: [
      'Take a clear photo of the front and back.',
      'Store it somewhere the caregiver team can reach.',
      'Call the number on the back if you are unsure about referrals.',
    ],
    script:
      'I am calling to confirm whether oncology visits and imaging need a referral, and whether biomarker testing is covered under this plan.',
    minutes: 10,
  },
  {
    id: 'after-hours',
    bucket: 'day1',
    category: 'appointment_prep',
    title: 'Ask for after-hours contact instructions',
    why: 'You should know who to call if symptoms change before the next visit.',
    how: [
      'Ask the clinic for the after-hours number.',
      'Write down what counts as urgent versus a portal message.',
    ],
    script:
      'If we have a concern after hours, who should we call, and what should go through the patient portal instead?',
    minutes: 8,
  },
  {
    id: 'second-opinion-records',
    bucket: 'day2',
    category: 'second_opinion',
    title: 'Decide whether you want a second opinion packet started',
    why: 'A second opinion is common. Starting records transfer early reduces delays.',
    how: [
      'Ask the current team how they handle second-opinion requests.',
      'Use Second Opinion Mode if you want a structured packet.',
    ],
    minutes: 15,
    deepLink: '/journey/second-opinion',
  },
  {
    id: 'trial-screen',
    bucket: 'day2',
    category: 'trials',
    title: 'Preview whether trials are even being discussed',
    why: 'You do not need to enroll today. You do need to know if anyone is looking.',
    how: [
      'Ask the oncologist whether a trial conversation is appropriate later.',
      'Use trial matching as a starting list, then confirm with the care team.',
    ],
    minutes: 10,
    deepLink: '/journey/trials',
  },
  {
    id: 'fmla',
    bucket: 'day3',
    category: 'work_leave',
    title: 'Ask HR how medical leave works at your job',
    why: 'Leave paperwork takes time. Starting the conversation early reduces last-minute stress.',
    how: [
      'Email HR or your manager using the script below.',
      'You do not need a final treatment plan to ask about process.',
    ],
    script:
      'I am a caregiver for a close family member with a new cancer diagnosis. Can you share the process for medical leave or intermittent leave, including any forms the clinician would need to complete?',
    minutes: 20,
    deepLink: '/journey/access-agent',
  },
  {
    id: 'financial-scan',
    bucket: 'day3',
    category: 'financial_aid',
    title: 'List copay, travel, and time-off costs you already see',
    why: 'Aid programs exist, but they need a simple picture of the costs you are facing.',
    how: [
      'Write down known copays, parking, and missed work so far.',
      'Advocate Plan users can open the Live Financial Aid Tracker.',
    ],
    minutes: 15,
    deepLink: '/journey/access-agent',
  },
  {
    id: 'support-roles',
    bucket: 'week1',
    category: 'support_circle',
    title: 'Assign three roles: rides, notes, meals',
    why: 'A support circle works better with jobs, not a group chat of confusion.',
    how: [
      'Name one person for transportation.',
      'Name one person to sit in visits and take notes.',
      'Name one person to coordinate meals or school pickup.',
    ],
    minutes: 15,
  },
  {
    id: 'self-care',
    bucket: 'week1',
    category: 'self_care',
    title: 'Schedule one short rest block for yourself',
    why: 'Caregivers skip meals and sleep first. A planned 20-minute pause is a real task.',
    how: [
      'Put a 20-minute walk, nap, or quiet room block on the calendar.',
      'Tell one person you will be unreachable during that window.',
    ],
    minutes: 5,
    deepLink: '/quiet-room',
  },
  {
    id: 'portal-access',
    bucket: 'day1',
    category: 'records',
    title: 'Confirm you have portal access as a caregiver',
    why: 'Results often post to the portal before anyone calls.',
    how: [
      'Ask the clinic how proxy or caregiver access is granted.',
      'If access is denied, ask what signed form is required.',
    ],
    minutes: 12,
  },
];

export const FIRST_72_INTAKE_FIELDS = [
  { id: 'diagnosis_date', label: 'Diagnosis date', options: ['I am not sure', 'Not confirmed yet'] },
  { id: 'cancer_type', label: 'Cancer type', options: ['I am not sure'] },
  { id: 'stage', label: 'Stage', options: ['I am not sure'] },
  { id: 'biomarker_status', label: 'Biomarker or molecular testing', options: ['Done', 'Ordered', 'Not yet', 'I am not sure'] },
  { id: 'insurance_type', label: 'Insurance type', options: ['Employer', 'Medicare', 'Medicaid', 'Marketplace', 'Uninsured', 'I am not sure'] },
  { id: 'work_status', label: 'Caregiver work status', options: ['Working', 'On leave', 'Not working', 'I am not sure'] },
  { id: 'zip', label: 'ZIP code', options: ['I am not sure'] },
  { id: 'next_appointment', label: 'Next appointment date', options: ['I am not sure'] },
] as const;

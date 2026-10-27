export type JourneySignals = {
  hasReport: boolean;
  hasAppointment: boolean;
  hasDenial: boolean;
  trialInterest: boolean;
  conciergeCase: boolean;
};

export type JourneyAction = {
  id: string;
  label: string;
  href: string;
};

export type NextStepResult = {
  stageId: 'understand' | 'prepare' | 'fight' | 'plan';
  primary: JourneyAction;
  secondary: JourneyAction[];
};

const ACTIONS = {
  upload: { id: 'upload', label: 'Upload a report', href: '/journey' },
  first72: { id: 'first72', label: 'Open the First 72 Hours checklist', href: '/features/first-72-hours' },
  profile: { id: 'profile', label: 'Review your Cancer Profile', href: '/journey' },
  appointment: { id: 'appointment', label: 'Add your next appointment', href: '/journey/timeline' },
  prep: { id: 'prep', label: 'Open your Doctor Prep Sheet', href: '/features/doctor-prep-sheet' },
  denial: { id: 'denial', label: 'Decode a denial letter', href: '/journey/insurance-support' },
  trials: { id: 'trials', label: 'Review trial matches', href: '/journey/trials' },
  concierge: { id: 'concierge', label: 'See Concierge case status', href: '/journey/concierge' },
  conciergeStart: { id: 'conciergeStart', label: 'Ask Concierge to handle the paperwork', href: '/concierge' },
} as const;

export function nextJourneyStep(signals: JourneySignals): NextStepResult {
  if (!signals.hasReport) {
    return { stageId: 'understand', primary: ACTIONS.upload, secondary: [ACTIONS.first72] };
  }
  if (signals.hasDenial) {
    return {
      stageId: 'fight',
      primary: ACTIONS.denial,
      secondary: [ACTIONS.appointment, ACTIONS.conciergeStart].slice(0, 2),
    };
  }
  if (!signals.hasAppointment) {
    return {
      stageId: 'prepare',
      primary: ACTIONS.appointment,
      secondary: [ACTIONS.prep, ACTIONS.profile],
    };
  }
  if (signals.trialInterest) {
    return {
      stageId: 'plan',
      primary: ACTIONS.trials,
      secondary: [ACTIONS.conciergeStart, ACTIONS.prep],
    };
  }
  if (signals.conciergeCase) {
    return {
      stageId: 'plan',
      primary: ACTIONS.concierge,
      secondary: [ACTIONS.prep, ACTIONS.trials],
    };
  }
  return {
    stageId: 'prepare',
    primary: ACTIONS.prep,
    secondary: [ACTIONS.trials, ACTIONS.conciergeStart],
  };
}

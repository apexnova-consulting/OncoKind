export type JourneySignals = {
  hasReport: boolean;
  hasAppointment: boolean;
  hasDenial: boolean;
  trialInterest: boolean;
  secondOpinionGoal?: boolean;
  recordDelays?: boolean;
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
  prep: { id: 'prep', label: 'Open your Doctor Prep Sheet', href: '/journey' },
  denial: { id: 'denial', label: 'Decode a denial letter', href: '/journey/insurance-support' },
  trials: { id: 'trials', label: 'Review trial matches', href: '/journey/trials' },
  secondOpinion: { id: 'secondOpinion', label: 'Open Second Opinion Mode', href: '/journey/second-opinion' },
  concierge: { id: 'concierge', label: 'See Concierge case status', href: '/journey/concierge' },
  conciergeStart: { id: 'conciergeStart', label: 'Ask Concierge to handle the paperwork', href: '/concierge' },
} as const;

function withSecondary(primary: JourneyAction, extras: JourneyAction[]): JourneyAction[] {
  return extras.filter((item) => item.id !== primary.id).slice(0, 2);
}

export function nextJourneyStep(signals: JourneySignals): NextStepResult {
  if (!signals.hasReport) {
    return { stageId: 'understand', primary: ACTIONS.upload, secondary: [ACTIONS.first72] };
  }

  const wantsConciergeHelp =
    signals.hasDenial || signals.trialInterest || signals.secondOpinionGoal || signals.recordDelays;

  if (signals.conciergeCase) {
    return {
      stageId: 'plan',
      primary: ACTIONS.concierge,
      secondary: withSecondary(ACTIONS.concierge, [ACTIONS.prep, ACTIONS.trials]),
    };
  }

  if (wantsConciergeHelp) {
    const secondary = signals.hasDenial
      ? [ACTIONS.denial, ACTIONS.prep]
      : signals.trialInterest
        ? [ACTIONS.trials, ACTIONS.prep]
        : signals.secondOpinionGoal
          ? [ACTIONS.secondOpinion, ACTIONS.prep]
          : [ACTIONS.profile, ACTIONS.prep];
    return {
      stageId: signals.hasDenial ? 'fight' : 'plan',
      primary: ACTIONS.conciergeStart,
      secondary: withSecondary(ACTIONS.conciergeStart, secondary),
    };
  }

  if (!signals.hasAppointment) {
    return {
      stageId: 'prepare',
      primary: ACTIONS.appointment,
      secondary: [ACTIONS.prep, ACTIONS.profile],
    };
  }

  return {
    stageId: 'prepare',
    primary: ACTIONS.prep,
    secondary: [ACTIONS.trials, ACTIONS.first72],
  };
}

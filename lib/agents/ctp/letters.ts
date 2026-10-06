export function recordsRequestLetter(input: {
  caregiverName: string;
  patientRelationship: string;
  facilityName: string;
  today: string;
}): string {
  return [
    input.today,
    '',
    `To Medical Records, ${input.facilityName || 'the treating facility'}`,
    '',
    `My name is ${input.caregiverName || '[caregiver name]'}. I am the ${input.patientRelationship || 'family caregiver'}.`,
    '',
    'I am requesting a patient copy of pathology, molecular or genomic reports, imaging, and the most recent clinic note. This request is for the patient right of access. Please tell us the form, fees, and where to send the signed request.',
    '',
    'OncoKind does not send this letter. The family prints, signs, and sends it.',
    '',
    'Thank you,',
    input.caregiverName || '[signature]',
  ].join('\n');
}

export function coverageQuestionScript(): string {
  return 'We would like to understand how to ask the care team and the insurer about coverage for testing. Can you tell us who on the team handles prior authorization for biomarker or genomic tests, and what the insurer usually needs? This is a process question only.';
}

export const BRING_CHECKLIST = [
  'Ask for a copy of the molecular or genomic report if one exists.',
  'Ask whether tissue from the biopsy is still available.',
  'Ask for imaging on disc or a patient portal download.',
  'Ask for outside slides to be sent if a second review is discussed.',
];

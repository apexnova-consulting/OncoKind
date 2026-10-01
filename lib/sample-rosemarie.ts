export const ROSEMARIE_SAMPLE = {
  patientName: 'Rosemarie N.',
  cancerType: 'Vulvar Squamous Cell Carcinoma (VSCC)',
  cancerTypeShort: 'Vulvar squamous cell carcinoma',
  stage: 'Stage IV',
  nextMilestone: 'First oncology appointment',
  illustrationNote: 'Based on Rosemarie N. For educational illustration only.',
  hpv: {
    label: 'HPV Status: Positive (p16+)',
    value: 'Positive (p16+)',
    heroNote: undefined as string | undefined,
    description:
      "HPV status helps the care team understand how this cancer developed and may be part of treatment discussions. Ask your oncologist what this result means for your loved one's plan.",
  },
  pdl1: {
    label: 'PD-L1 (CPS): ≥10 — Positive',
    value: '≥10 — Positive',
    heroNote: 'Discuss immunotherapy options with care team',
    description:
      'PD-L1 results help the care team decide whether immunotherapy is an option worth discussing. Ask your oncologist whether it applies here.',
  },
  brca: {
    label: 'BRCA1/2: Negative',
    description:
      'No hereditary BRCA mutation detected. This affects some targeted therapy options, and your oncologist may recommend additional molecular testing.',
  },
  whatThisMeans:
    'Stage IV means the cancer has spread beyond the vulva. The care team will review imaging and other findings to determine the treatment plan. Many options remain on the table and your oncologist will walk through each one.',
  recommendedNextSteps: [
    'Meet with oncologist',
    'Discuss immunotherapy options with care team',
    'Review clinical trials',
  ],
  prepDiagnosis:
    'Stage IV vulvar squamous cell carcinoma means the cancer has spread beyond the vulva. The HPV-positive (p16+) status and PD-L1 CPS of ≥10 are important findings to review with the oncology team. Your care team will review imaging and other details to build the full treatment plan.',
  prepQuestions: [
    'Given the PD-L1 CPS of ≥10 and HPV-positive status, is immunotherapy part of the treatment discussion — either alone or combined with chemotherapy?',
    'What chemotherapy regimen is being recommended, and what side effects should we watch for?',
    'What is the primary goal of treatment right now — to reduce the cancer, to manage symptoms, or something else?',
    'Are there clinical trials for Stage IV vulvar cancer that we should consider, given the PD-L1 and HPV findings?',
    'How will we know if the treatment is working, and how often will we check?',
  ],
  trials: [
    {
      id: 'keynote-158',
      title: 'KEYNOTE-158',
      meta: 'Phase II',
      category: 'Immunotherapy',
      summary: 'Pembrolizumab for PD-L1 Positive Advanced Solid Tumors (incl. vulvar)',
      why: 'PD-L1 CPS ≥10, Stage IV, HPV-positive squamous cell carcinoma',
      distance: '~9 miles — Regional Cancer Center',
      status: 'Enrolling',
      detail:
        'This trial evaluates pembrolizumab in patients with PD-L1 positive solid tumors, including vulvar cancer. HPV-positive and high PD-L1 status are both relevant eligibility factors here.',
      doctorPrompt:
        'Given that the PD-L1 CPS is ≥10 and HPV status is positive, should we discuss immunotherapy — either through a trial like KEYNOTE-158 or as standard of care?',
    },
    {
      id: 'gog-vul-01',
      title: 'Cisplatin + Paclitaxel + Pembrolizumab',
      meta: 'Phase II',
      category: 'Combination Therapy',
      summary: 'Chemotherapy Combined with Immunotherapy for Advanced Vulvar Cancer',
      why: 'Stage IV vulvar squamous cell carcinoma, PD-L1 positive, no prior systemic therapy',
      distance: '~22 miles — University Medical Center',
      status: 'Enrolling',
      detail:
        'This trial evaluates whether adding pembrolizumab to standard chemotherapy improves outcomes in advanced vulvar cancer. It is an example of the combination approach many oncologists are exploring for PD-L1 positive cases.',
      doctorPrompt:
        'Is there a clinical trial combining chemotherapy with pembrolizumab for Stage IV vulvar cancer that we should consider, given the PD-L1 CPS of ≥10?',
    },
  ],
} as const;

export const ROSEMARIE_BIOMARKERS = [
  ROSEMARIE_SAMPLE.hpv,
  ROSEMARIE_SAMPLE.pdl1,
  ROSEMARIE_SAMPLE.brca,
] as const;

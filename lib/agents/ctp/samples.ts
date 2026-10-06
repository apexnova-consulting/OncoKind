export const CTP_FICTIONAL_SAMPLES = [
  {
    id: 'lung-sample',
    label: 'Fictional sample: lung',
    cancerType: 'non-small cell lung cancer',
    reportText: `Fictional sample. Not a real patient.
Pathology: Right upper lobe, adenocarcinoma, non-small cell lung cancer, Stage IIIA.
PD-L1 TPS 60% by IHC.
EGFR not mentioned. ALK not mentioned. Molecular NGS pending.
Lab: Fictional Regional Pathology.`,
  },
  {
    id: 'breast-sample',
    label: 'Fictional sample: breast',
    cancerType: 'breast cancer',
    reportText: `Fictional sample. Not a real patient.
Invasive ductal carcinoma of the breast, ER positive, PR positive, HER2 negative by IHC.
Grade 2. BRCA testing not mentioned.
Lab: Fictional Breast Pathology.`,
  },
] as const;

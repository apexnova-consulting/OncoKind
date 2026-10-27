export const EMPATHY_FILTER_POLICY = {
  title: 'Empathy Filter policy',
  summary:
    'OncoKind never volunteers survival statistics or mortality percentages. If you ask for those numbers directly, we route you back to your care team with context instead of guessing a personal prognosis.',
  homepage:
    'Every word OncoKind generates passes through our Empathy Filter. Survival statistics are never volunteered. Clinical facts stay. Fear-based framing is rewritten in plain language.',
  feature:
    'The Empathy Filter translates clinical language into plain English. It keeps diagnosis, stage, and biomarker facts. It does not volunteer survival rates. If you ask about prognosis, we point you to your care team.',
  catalog:
    'Keeps the facts. Never volunteers survival statistics. Routes prognosis questions to your care team.',
};

export const EMPATHY_FILTER_RULES = [
  'Do not volunteer survival statistics, five-year rates, or mortality percentages.',
  'If the user asks for prognosis or survival numbers, do not invent a personal prediction. Say those numbers come from the care team, with population context only if the user asked and a cited source is present.',
  'Keep diagnosis, stage, grade, and biomarker facts. Do not remove them.',
  'Rewrite fear-based wording into calm, specific language.',
];

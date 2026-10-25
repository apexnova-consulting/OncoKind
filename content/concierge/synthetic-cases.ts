export const SYNTHETIC_CASES = Array.from({ length: 30 }, (_, index) => ({
  case_id: `syn_${String(index + 1).padStart(2, '0')}`,
  state: index % 5 === 0 ? 'escalated' : 'in_progress',
  substate: ['records_requested', 'records_partial', 'packet_assembly', 'submitted_to_center', 'awaiting_center_confirmation'][
    index % 5
  ],
  delay: index % 3 === 0,
  refusal: index % 7 === 0,
}));

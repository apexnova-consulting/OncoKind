export const SOP_TASKS = [
  {
    task_type: 'send_records_request',
    checklist: [
      'Confirm authorization is active',
      'Confirm facility channel from the verified profile',
      'Coordinator approves the letter before send',
    ],
    expected_minutes: 6,
    evidence_required: true,
  },
  {
    task_type: 'chase_request',
    checklist: ['Check day 3, 7, and 10 cadence', 'Log any provider delay honestly'],
    expected_minutes: 4,
    evidence_required: true,
  },
  {
    task_type: 'assemble_packet',
    checklist: ['Index pages', 'Match center format and size rules', 'Flag imaging discs'],
    expected_minutes: 18,
    evidence_required: true,
  },
  {
    task_type: 'confirm_receipt_with_center',
    checklist: ['Draft confirmation from approved template', 'Store proof of contact'],
    expected_minutes: 8,
    evidence_required: true,
  },
] as const;

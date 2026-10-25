import { CLINICAL_BOUNDARY_MACRO } from '@/lib/concierge/lint';

export const MESSAGE_MACROS = [
  {
    id: 'clinical_boundary',
    title: 'Clinical question',
    body: CLINICAL_BOUNDARY_MACRO,
  },
  {
    id: 'provider_delay',
    title: 'Provider delay',
    body: 'The facility has not returned records yet. We followed up and will show the new date as soon as they give one. Hospitals set their own timelines.',
  },
  {
    id: 'need_better_scan',
    title: 'Unreadable scan',
    body: 'A file we received is hard to read. If you can upload a clearer copy, that helps us keep moving. We will keep the request open either way.',
  },
  {
    id: 'fee_approval',
    title: 'Record fee above threshold',
    body: 'The facility quoted a records fee above our review threshold. Please tell us if you want us to proceed. Coordinators do not pay fees on your behalf in this version.',
  },
] as const;

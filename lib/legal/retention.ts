export const CONCIERGE_RECORD_RETENTION_DAYS = 90;
/** Board run 2 canonical name. Same value as CONCIERGE_RECORD_RETENTION_DAYS. */
export const CONCIERGE_RETENTION_DAYS = CONCIERGE_RECORD_RETENTION_DAYS;

export const TOOLS_RETENTION_CLAIM =
  'Tools: raw report text is deleted after processing. Summaries you save stay until you delete them.';

export const CONCIERGE_RETENTION_CLAIM = `Concierge: authorized case records are stored encrypted and deleted ${CONCIERGE_RETENTION_DAYS} days after Case Ready.`;

export const SCOPED_RETENTION_BADGE = 'Tools: raw reports deleted after processing';

export const BANNED_UNSCOPED_RETENTION = [
  'No raw data retained',
  'No raw report data retained',
  'we do not retain raw report data after processing',
];

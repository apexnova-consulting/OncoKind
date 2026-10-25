/**
 * Recipients and send destinations never come from model output.
 * They must match a validated facility profile or a family-confirmed entry.
 */

export type SendDestination = {
  channel: 'fax' | 'email' | 'mail' | 'portal';
  value: string;
};

export function resolveSendDestination(input: {
  proposed?: string | null;
  facilityValue: string | null;
  familyConfirmedValue?: string | null;
}): SendDestination | { error: string } {
  const allowed = [input.facilityValue, input.familyConfirmedValue].filter(Boolean) as string[];
  if (!allowed.length) return { error: 'No validated destination is on file.' };
  if (input.proposed && !allowed.includes(input.proposed)) {
    return { error: 'Model output cannot set a send destination.' };
  }
  return { channel: 'fax', value: allowed[0] };
}

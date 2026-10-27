export function canCoordinatorOpenCase(input: {
  role: 'coordinator' | 'lead' | 'admin' | 'auditor';
  assignedTo: string | null;
  actorId: string;
  breakGlass?: boolean;
}): boolean {
  if (input.role === 'coordinator' && !input.breakGlass) {
    return input.assignedTo === input.actorId;
  }
  return true;
}

export function canFamilyReadCase(ownerUserId: string, actorUserId: string): boolean {
  return ownerUserId === actorUserId;
}

export function canPartnerReadPhi(): false {
  return false;
}

export function canAdvocateReadClient(input: {
  advocateId: string;
  clientAdvocateId: string;
}): boolean {
  return input.advocateId === input.clientAdvocateId;
}

export function canOrgReadOtherOrg(input: { orgId: string; recordOrgId: string }): boolean {
  return input.orgId === input.recordOrgId;
}

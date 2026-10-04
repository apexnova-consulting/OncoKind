export function canSeeHiddenMember(
  row: { hidden: boolean; claimed_by: string | null; created_by: string; family_owner: string },
  viewerId: string
): boolean {
  if (row.claimed_by === viewerId) return true;
  if (row.hidden) return false;
  return viewerId === row.created_by || viewerId === row.family_owner;
}

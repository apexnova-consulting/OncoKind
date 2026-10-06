export function canReadAgentRow(ownerId: string, requesterId: string): boolean {
  return ownerId === requesterId;
}

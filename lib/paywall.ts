const DIAGNOSTIC_PATHS = ['/journey', '/journey/diagnosis', '/reports'];

export function isDiagnosticSurface(pathname: string): boolean {
  return DIAGNOSTIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function canShowUpgradePrompt(pathname: string, action: 'view' | 'export' | 'generate_packet' | 'start_concierge'): boolean {
  if (action === 'view' && isDiagnosticSurface(pathname)) return false;
  return action !== 'view';
}

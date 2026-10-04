/**
 * Error logging only. No advertising pixels. Optional Sentry DSN if configured.
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, message);

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    const url = new URL(dsn.replace(/^https:\/\/(.+)@(.+)\.ingest\.(sentry\.io|us\.sentry\.io)\/(\d+)/, 'https://$2.ingest.$3/api/$4/store/'));
    void fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `${context}: ${message}`,
        level: 'error',
        timestamp: Date.now() / 1000,
      }),
    }).catch(() => undefined);
  } catch {
    // Invalid DSN. Console logging already happened.
  }
}

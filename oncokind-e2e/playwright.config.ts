import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * playwright.config.ts
 * ──────────────────────────────────────────────────────────────────────────
 * - `setup` runs first and authenticates all 5 QA roles (tests/auth.setup.ts),
 *   writing storageState to playwright/.auth/*.json.
 * - `marketing` needs no auth at all — Section 1 explicitly calls for
 *   "No login required · Use incognito window", so it intentionally has no
 *   dependency on `setup` and no storageState.
 * - `auth-gates` manages its own login/logout state per test (it's testing
 *   the auth flow itself), so it also skips the storageState fixture but
 *   does depend on `setup` for the tier-gate redirect checks that need an
 *   already-authenticated free/pro/advocate session.
 * - `user-tiers`, `prior-auth`, and `billing` depend on `setup` and each
 *   spec applies the storageState for the specific role(s) it needs via
 *   `test.use({ storageState: users.X.storageState })`.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.oncokind.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'marketing',
      testMatch: /marketing\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // No `dependencies` — Section 1 is public/incognito by design.
    },
    {
      name: 'auth-gates',
      testMatch: /auth-gates\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // No setup dependency — this project logs in fresh per test so it does
      // not invalidate playwright/.auth/*.json used by user-tiers / prior-auth.
    },
    {
      name: 'user-tiers',
      testMatch: /user-tiers\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'prior-auth',
      testMatch: /prior-auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'billing',
      testMatch: /billing\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      // Stripe billing tests are slower and mutate subscription state on a
      // throwaway account — keep them isolated and easy to exclude from a
      // fast local loop (`npm run test:billing` runs just this project).
      fullyParallel: false,
    },
    {
      name: 'mobile-marketing',
      testMatch: /marketing\.spec\.ts/,
      use: { ...devices['iPhone 13'] },
      // Section 10: "Test at 375px viewport (iPhone)". Reuses marketing.spec.ts
      // against a real device profile for the responsive-layout assertions.
    },
  ],
});

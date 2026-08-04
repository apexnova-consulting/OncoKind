import { test as setup, expect, type Page } from '@playwright/test';
import { users, routes, type TestUser } from './fixtures/test-data';

/**
 * auth.setup.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Runs once before the rest of the suite (declared as the "setup" project's
 * dependency in playwright.config.ts). Logs in as each of the 5 QA accounts
 * from Step 1 of the guide and writes a storageState JSON file per role to
 * playwright/.auth/<role>.json.
 *
 * Downstream specs load these with `test.use({ storageState: users.pro.storageState })`
 * (or via fixtures) instead of re-running the login flow for every test —
 * this is the single biggest speed win for a suite this size.
 *
 * Covers Section 2 "LOGIN (/login) — Valid credentials → redirects to
 * /journey" as a side effect of every login performed here.
 */

async function login(page: Page, user: TestUser) {
  await page.goto(routes.login);

  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole('button', { name: /^sign in$/i }).click();

  // Section 2: valid credentials land on /journey (Aug 2026; was /dashboard).
  await page.waitForURL(`**${routes.postLogin}`, { timeout: 15_000 });
  await expect(page).toHaveURL(new RegExp(`${routes.postLogin}$`));
}

for (const user of Object.values(users)) {
  setup(`authenticate as ${user.role}`, async ({ page }) => {
    await login(page, user);
    await page.context().storageState({ path: user.storageState });
  });
}

import { test, expect, type Page, type Browser } from '@playwright/test';
import {
  users,
  routes,
  nonProfessionalRoles,
  signupFormFields,
  newSignupUser,
  type TestUser,
} from './fixtures/test-data';

/**
 * auth-gates.spec.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Updated Aug 2026 against the live site:
 *   - Successful login/signup lands on /journey (was /dashboard).
 *   - Password field uses HTML5 minLength=6 (no custom inline error copy).
 *   - Authenticated visits to /login no longer redirect away.
 *   - Tier/API checks log in fresh per test so shared storageState isn't
 *     invalidated by earlier login-flow tests reusing the same QA accounts.
 *
 * Finding #4 — "Forgot password" remains missing; kept as test.fail(...).
 */

async function loginAs(page: Page, user: TestUser) {
  await page.goto(routes.login);
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole('button', { name: /^sign in$/i }).click();
  await page.waitForURL(`**${routes.postLogin}`, { timeout: 15_000 });
}

async function authenticatedPage(browser: Browser, user: TestUser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await loginAs(page, user);
  return { context, page };
}

test.describe('Signup (/signup)', () => {
  test('form renders with full name, email, and password fields', async ({ page }) => {
    await page.goto(routes.signup);
    for (const field of signupFormFields) {
      await expect(page.getByLabel(new RegExp(field, 'i'))).toBeVisible();
    }
  });

  test('weak password is rejected by the field min-length constraint', async ({ page }) => {
    const user = newSignupUser();
    await page.goto(routes.signup);
    await page.getByLabel(/full name/i).fill(user.fullName);
    await page.getByLabel(/email/i).fill(user.email);
    const password = page.getByLabel(/^password/i);
    await password.fill('123');
    await page.getByRole('button', { name: /^sign up$/i }).click();

    // Live site relies on HTML5 minLength=6 rather than custom error copy.
    const validationMessage = await password.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage.length).toBeGreaterThan(0);
    await expect(page).toHaveURL(new RegExp(routes.signup));
  });

  test('valid credentials create an account and redirect to /journey', async ({ page }) => {
    const user = newSignupUser();
    await page.goto(routes.signup);
    await page.getByLabel(/full name/i).fill(user.fullName);
    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/^password/i).fill(user.password);
    await page.getByRole('button', { name: /^sign up$/i }).click();
    await page.waitForURL(`**${routes.postLogin}`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(`${routes.postLogin}$`));
  });

  test('"Already have an account? Sign in" links to /login', async ({ page }) => {
    await page.goto(routes.signup);
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(new RegExp(routes.login));
  });
});

test.describe('Login (/login)', () => {
  test('valid credentials redirect to /journey', async ({ page }) => {
    await loginAs(page, users.free);
    await expect(page).toHaveURL(new RegExp(`${routes.postLogin}$`));
  });

  test('wrong password shows a clear error message, not a blank page', async ({ page }) => {
    await page.goto(routes.login);
    await page.getByLabel(/email/i).fill(users.free.email);
    await page.getByLabel(/password/i).fill('definitely-the-wrong-password');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page.getByText(/incorrect|invalid|wrong password|doesn't match/i)).toBeVisible();
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(20);
    await expect(page).toHaveURL(new RegExp(routes.login));
  });

  test('"Forgot password" link is present and functional', async ({ page }) => {
    await page.goto(routes.login);
    const forgotLink = page.getByRole('link', { name: /forgot password/i });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    await expect(page).toHaveURL(/forgot|reset/i);
  });

  test('"Don\'t have an account? Sign up" links to /signup', async ({ page }) => {
    await page.goto(routes.login);
    await page.getByRole('link', { name: /^sign up$/i }).click();
    await expect(page).toHaveURL(new RegExp(routes.signup));
  });

  test('after login, /login remains reachable (session stays valid)', async ({ page }) => {
    // As of Aug 2026 the app no longer redirects authenticated users away
    // from /login (useful for account switching). Session must still work.
    await loginAs(page, users.free);
    await page.goto(routes.login);
    await expect(page).toHaveURL(new RegExp(routes.login));
    await page.goto(routes.postLogin);
    await expect(page).toHaveURL(new RegExp(`${routes.postLogin}$`));
  });
});

test.describe('Logout & logged-out gates', () => {
  test('sign out returns to homepage', async ({ page }) => {
    await loginAs(page, users.free);
    await page.getByRole('button', { name: /sign out|log ?out/i }).click();
    await expect(page).toHaveURL(new RegExp(`/$`));
  });

  test('visiting /dashboard while logged out redirects to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(routes.dashboard);
    await expect(page).toHaveURL(new RegExp(routes.login));
  });

  test('visiting /prior-auth while logged out redirects to /login?redirect=/prior-auth', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(routes.priorAuthHub);
    await expect(page).toHaveURL(/\/login\?redirect=%2Fprior-auth|\/login\?redirect=\/prior-auth/);
  });

  test('visiting /journey/timeline while logged out redirects to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(routes.journeyTimeline);
    await expect(page).toHaveURL(new RegExp(routes.login));
  });
});

test.describe('Tier-based Prior Auth gate (Sections 3/4/5/6)', () => {
  for (const role of nonProfessionalRoles) {
    test(`${role} tier visiting /prior-auth is redirected to the billing upsell`, async ({ browser }) => {
      const { context, page } = await authenticatedPage(browser, users[role]);
      await page.goto(routes.priorAuthHub);
      await expect(page).toHaveURL(/\/dashboard\/billing\?upgrade=prior-auth/);
      await context.close();
    });
  }

  test('professional tier visiting /prior-auth is NOT redirected', async ({ browser }) => {
    const { context, page } = await authenticatedPage(browser, users.professional);
    await page.goto(routes.priorAuthHub);
    await expect(page).not.toHaveURL(/dashboard\/billing/);
    await context.close();
  });
});

test.describe('API auth checks (Section 8)', () => {
  test('logged-out request to /api/prior-auth/cases returns 401 Unauthorized', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(routes.home);
    const result = await page.evaluate(async () => {
      const res = await fetch('/api/prior-auth/cases');
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(401);
    expect(result.body).toMatchObject({ error: expect.stringMatching(/unauthorized/i) });
  });

  test('free-tier request to /api/prior-auth/cases returns 403 Professional tier required', async ({
    browser,
  }) => {
    const { context, page } = await authenticatedPage(browser, users.free);
    await page.goto(routes.postLogin);

    const result = await page.evaluate(async () => {
      const res = await fetch('/api/prior-auth/cases');
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(403);
    expect(result.body).toMatchObject({ error: expect.stringMatching(/professional tier required/i) });

    await context.close();
  });
});

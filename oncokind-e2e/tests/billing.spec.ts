import { test, expect } from '@playwright/test';
import { routes, stripeTestCard, pricingTiers, newSignupUser } from './fixtures/test-data';

/**
 * billing.spec.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Rewritten July 2026 against the live pricing page. Key changes from the
 * original suite:
 *   - Buttons are now "Start Caregiver Pro →" / "Start Advocate Plan →", not
 *     "Get Caregiver Pro" / "Get Advocate".
 *   - Professional tier is Book-a-Demo only now — no self-serve Stripe
 *     checkout exists for it anymore, so there's nothing to test there.
 *   - Signup requires a full name field now, in addition to email/password.
 *
 * Test isolation: each test signs up a brand-new throwaway account rather
 * than reusing qa-free/qa-pro/qa-advocate, since running a real Stripe
 * test-mode subscription against those shared fixtures would permanently
 * change their tier and break user-tiers.spec.ts / prior-auth.spec.ts, which
 * depend on them staying pinned at their seeded tier.
 */

async function signUpFreshAccount(page: import('@playwright/test').Page): Promise<string> {
  const user = newSignupUser();

  await page.goto(routes.signup);
  await page.getByLabel(/full name/i).fill(user.fullName);
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/^password/i).fill(user.password);
  await page.getByRole('button', { name: /^sign up$/i }).click();
  await page.waitForURL(`**${routes.postLogin}`, { timeout: 15_000 });

  return user.email;
}

async function completeStripeCheckout(page: import('@playwright/test').Page) {
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 20_000 });

  const emailField = page.getByPlaceholder('Email');
  if (await emailField.isVisible().catch(() => false)) {
    const currentValue = await emailField.inputValue().catch(() => '');
    if (!currentValue) await emailField.fill(`qa-checkout-${Date.now()}@oncokind.com`);
  }

  await page.getByPlaceholder('Card number').fill(stripeTestCard.number);
  await page.getByPlaceholder('MM / YY').fill(stripeTestCard.expiry);
  await page.getByPlaceholder('CVC').fill(stripeTestCard.cvc);

  const cardholderName = page.getByLabel(/cardholder name/i);
  if (await cardholderName.isVisible().catch(() => false)) {
    await cardholderName.fill('QA Playwright Test');
  }

  await page.getByRole('button', { name: /subscribe|pay|start trial/i }).click();
}

test.describe('Stripe Billing', () => {
  test('purchasing Caregiver Pro from /pricing completes checkout and reflects in billing', async ({ page }) => {
    await signUpFreshAccount(page);

    await page.goto(routes.pricing);
    await page.getByRole('link', { name: new RegExp(pricingTiers.pro.cta, 'i') }).click();

    await completeStripeCheckout(page);

    await page.waitForURL(new RegExp(routes.dashboard), { timeout: 30_000 });

    await page.goto(routes.dashboardBilling);
    await expect(page.getByText(/caregiver pro/i).first()).toBeVisible();
    await expect(page.getByText(/active/i)).toBeVisible();
  });

  test('purchasing Advocate Plan from /pricing loads Stripe checkout', async ({ page }) => {
    await signUpFreshAccount(page);

    await page.goto(routes.pricing);
    await page.getByRole('link', { name: new RegExp(pricingTiers.advocate.cta, 'i') }).click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 20_000 });
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });

  test('subscription status is visible and accurate in /dashboard/billing after purchase', async ({ page }) => {
    await signUpFreshAccount(page);

    await page.goto(routes.pricing);
    await page.getByRole('link', { name: new RegExp(pricingTiers.advocate.cta, 'i') }).click();
    await completeStripeCheckout(page);
    await page.waitForURL(new RegExp(routes.dashboard), { timeout: 30_000 });

    await page.goto(routes.dashboardBilling);
    await expect(page.getByText(/advocate/i).first()).toBeVisible();
    await expect(page.getByText(/active/i)).toBeVisible();
  });

  test('Professional tier has no self-serve checkout — "Book a Demo" only', async ({ page }) => {
    // Confirmed live: Professional ($999/mo) links to Calendly, not Stripe.
    await page.goto(routes.pricing);
    const professionalCta = page.getByRole('link', { name: new RegExp(pricingTiers.professional.cta, 'i') });
    await expect(professionalCta).toHaveAttribute('href', /calendly\.com\/oncokind-support/);
  });
});

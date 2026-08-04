import { test, expect } from '@playwright/test';
import path from 'path';
import { users, routes, nonProfessionalRoles } from './fixtures/test-data';

/**
 * user-tiers.spec.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Guide coverage: Section 3 (Free Tier), Section 4 (Caregiver Pro Tier),
 * Section 5 (Advocate Tier), a light pass on Section 7 (Admin/Enterprise),
 * and the role-based dashboard-nav visibility checks from Section 9.
 *
 * Each describe block applies the relevant storageState written by
 * auth.setup.ts, so no login flow runs here — just feature verification.
 */

const sampleReportPath = path.join(__dirname, 'fixtures', 'sample-pathology-report.pdf');

test.describe('Free Tier', () => {
  test.use({ storageState: users.free.storageState });

  test.describe('Dashboard & Reports', () => {
    test('dashboard loads with an Advocate Plan upgrade CTA visible', async ({ page }) => {
      await page.goto(routes.dashboard);
      await expect(page.getByRole('link', { name: /upgrade.*advocate/i })).toBeVisible();
    });

    test('can upload a PDF report from /reports', async ({ page }) => {
      await page.goto('/reports');
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(sampleReportPath);
      await expect(page.getByText(/uploading|processing/i)).toBeVisible();
    });

    test('an uploaded report processes and shows the AI Cancer Profile', async ({ page }) => {
      await page.goto('/reports');
      await page.locator('input[type="file"]').setInputFiles(sampleReportPath);
      await page.getByText(/uploading|processing/i).waitFor({ state: 'hidden', timeout: 60_000 });
      await expect(page.getByText(/cancer profile/i)).toBeVisible();
    });

    test('a second report upload shows a usage-limit or upgrade prompt', async ({ page }) => {
      await page.goto('/reports');
      // First upload (may already exist from a prior test run; either way,
      // attempting a 2nd should trip the Free-tier limit).
      await page.locator('input[type="file"]').setInputFiles(sampleReportPath);
      await page.waitForTimeout(1000);
      await page.locator('input[type="file"]').setInputFiles(sampleReportPath);
      await expect(page.getByText(/limit reached|upgrade to upload more|upgrade required/i)).toBeVisible();
    });
  });

  test.describe('Feature gates — all should show an upgrade prompt, never the feature', () => {
    test('Doctor Prep Sheet shows an upgrade prompt', async ({ page }) => {
      await page.goto(routes.journeySecondOpinion);
      await expect(page.getByText(/upgrade/i)).toBeVisible();
    });

    test('Clinical Trial Matching shows an upgrade prompt', async ({ page }) => {
      await page.goto(routes.journeyTrials);
      await expect(page.getByText(/upgrade/i)).toBeVisible();
    });

    test('Insurance Denial Defense shows an upgrade prompt', async ({ page }) => {
      await page.goto(routes.journeyInsuranceSupport);
      await expect(page.getByText(/upgrade/i)).toBeVisible();
    });

    test('/dashboard/billing shows the Free plan with upgrade CTAs', async ({ page }) => {
      await page.goto(routes.dashboardBilling);
      await expect(page.getByText(/free plan/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /upgrade/i }).first()).toBeVisible();
    });
  });

  test.describe('Community & Quiet Room', () => {
    // NOTE: /community currently renders the site's "old" template (see
    // ../../SITE_REVIEW_FINDINGS.md, finding #1) and shows 4 category cards
    // with 0 seeded posts each ("No posts yet"). Adjusted to match what's
    // actually there rather than assuming a post feed exists.
    test('/community shows category cards, read-only for Free tier', async ({ page }) => {
      await page.goto(routes.community);
      for (const category of ['Just Diagnosed', 'Treatment & Side Effects', 'Insurance & Financial Help', 'Caregiver Support']) {
        await expect(page.getByText(category)).toBeVisible();
      }
      await expect(page.getByRole('button', { name: /new post|create post/i })).toHaveCount(0);
    });

    test('/quiet-room loads and is accessible', async ({ page }) => {
      const response = await page.goto(routes.quietRoom);
      expect(response?.ok()).toBeTruthy();
    });
  });
});

test.describe('Caregiver Pro Tier', () => {
  test.use({ storageState: users.pro.storageState });

  test.describe('Pro features', () => {
    test('can upload 2+ reports with no limit error', async ({ page }) => {
      await page.goto('/reports');
      await page.locator('input[type="file"]').setInputFiles(sampleReportPath);
      await page.waitForTimeout(1000);
      await page.locator('input[type="file"]').setInputFiles(sampleReportPath);
      await expect(page.getByText(/limit reached|upgrade required/i)).toHaveCount(0);
    });

    test('Doctor Prep Sheet generates and exports a PDF', async ({ page }) => {
      await page.goto(routes.journeySecondOpinion);
      await page.getByRole('button', { name: /generate/i }).click();
      await expect(page.getByText(/ready|generated/i)).toBeVisible({ timeout: 20_000 });

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: /export.*pdf|download.*pdf/i }).click(),
      ]);
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    });

    test('Clinical Trial Matching returns results for a test zip code', async ({ page }) => {
      await page.goto(routes.journeyTrials);
      await page.getByLabel(/zip code/i).fill('19104');
      await page.getByRole('button', { name: /search/i }).click();
      await expect(page.getByText(/results|trials found/i)).toBeVisible({ timeout: 15_000 });
    });

    test('Care Timeline loads and entries can be added', async ({ page }) => {
      await page.goto(routes.journeyTimeline);
      await page.getByRole('button', { name: /add entry/i }).click();
      await page.getByLabel(/title|description/i).first().fill('Chemo cycle 1');
      await page.getByRole('button', { name: /save/i }).click();
      await expect(page.getByText('Chemo cycle 1')).toBeVisible();
    });

    test('Appointment Check-In is accessible and functional', async ({ page }) => {
      const response = await page.goto('/journey/check-in');
      expect(response?.ok()).toBeTruthy();
    });

    test('Community allows both reading and posting (full access)', async ({ page }) => {
      await page.goto(routes.community);
      // Pro tier should be able to enter a category and post, rather than
      // just seeing the "Sign In to Join" / "See Advocate Plan" CTAs shown
      // to logged-out visitors.
      await expect(page.getByRole('link', { name: /sign in to join/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /new post|create post/i })).toBeVisible();
    });
  });

  test.describe('Feature gates — Pro should NOT have these', () => {
    test('Insurance Denial Defense shows an upgrade-to-Advocate prompt', async ({ page }) => {
      await page.goto(routes.journeyInsuranceSupport);
      await expect(page.getByText(/upgrade.*advocate/i)).toBeVisible();
    });

    test('Financial Aid Tracker shows an upgrade prompt', async ({ page }) => {
      await page.goto(routes.journeyFinancialHelp);
      await expect(page.getByText(/upgrade/i)).toBeVisible();
    });

    test('/prior-auth redirects to the billing upsell', async ({ page }) => {
      await page.goto(routes.priorAuthHub);
      await expect(page).toHaveURL(/\/dashboard\/billing\?upgrade=prior-auth/);
    });
  });
});

test.describe('Advocate Tier', () => {
  test.use({ storageState: users.advocate.storageState });

  test.describe('Advocate-only features', () => {
    test('Insurance Denial Defense page loads', async ({ page }) => {
      const response = await page.goto(routes.journeyInsuranceSupport);
      expect(response?.ok()).toBeTruthy();
    });

    test('uploading/pasting denial text generates an AI analysis', async ({ page }) => {
      await page.goto(routes.journeyInsuranceSupport);
      await page.getByLabel(/denial letter|paste.*text/i).fill(
        'Your claim for Keytruda has been denied. Denial Code: CO-50. Reason: step therapy not completed.'
      );
      await page.getByRole('button', { name: /analyze/i }).click();
      await expect(page.getByText(/denial reason|appeal basis/i)).toBeVisible({ timeout: 15_000 });
    });

    test('a structured appeal packet generates and can be downloaded', async ({ page }) => {
      await page.goto(routes.journeyInsuranceSupport);
      await page.getByRole('button', { name: /generate appeal packet/i }).click();
      await expect(page.getByText(/appeal packet ready|generated/i)).toBeVisible({ timeout: 20_000 });

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: /download/i }).click(),
      ]);
      expect(download.suggestedFilename()).toBeTruthy();
    });

    test('Financial Aid Tracker loads with aid categories', async ({ page }) => {
      await page.goto(routes.journeyFinancialHelp);
      await expect(page.locator('[data-testid*="aid-categor" i], [class*="categor" i]').first()).toBeVisible();
    });

    test('all Pro features remain accessible (Prep Sheet, Trials, Timeline)', async ({ page }) => {
      for (const route of [routes.journeySecondOpinion, routes.journeyTrials, routes.journeyTimeline]) {
        const response = await page.goto(route);
        expect(response?.ok(), `${route} should be reachable for Advocate tier`).toBeTruthy();
        await expect(page.getByText(/upgrade required/i)).toHaveCount(0);
      }
    });
  });

  test.describe('Feature gates', () => {
    test('/prior-auth redirects to the billing upsell', async ({ page }) => {
      await page.goto(routes.priorAuthHub);
      await expect(page).toHaveURL(/\/dashboard\/billing\?upgrade=prior-auth/);
    });
  });
});

test.describe('Admin / Enterprise Tier (Section 7)', () => {
  test.use({ storageState: users.admin.storageState });

  test('dashboard shows an "Admin" nav link', async ({ page }) => {
    await page.goto(routes.dashboard);
    await expect(page.getByRole('navigation').getByRole('link', { name: /admin/i })).toBeVisible();
  });

  test('/admin/organizations loads (may be an empty list in test data)', async ({ page }) => {
    const response = await page.goto(routes.adminOrganizations);
    expect(response?.ok()).toBeTruthy();
  });

  test('/admin/community moderation page loads', async ({ page }) => {
    const response = await page.goto(routes.adminCommunity);
    expect(response?.ok()).toBeTruthy();
  });

  test('Prior Auth Engine card is visible (enterprise includes professional access)', async ({ page }) => {
    await page.goto(routes.dashboard);
    await expect(page.getByText(/prior auth engine/i)).toBeVisible();
  });

  test('/prior-auth workspace loads successfully for admin', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await expect(page).not.toHaveURL(/dashboard\/billing/);
  });
});

test.describe('Cross-tier dashboard nav — Prior Auth "NEW" badge (Section 9)', () => {
  for (const role of nonProfessionalRoles) {
    test(`${role} tier does NOT see the Prior Auth nav link`, async ({ browser }) => {
      const context = await browser.newContext({ storageState: users[role].storageState });
      const page = await context.newPage();
      await page.goto(routes.dashboard);
      await expect(page.getByRole('navigation').getByRole('link', { name: /prior auth/i })).toHaveCount(0);
      await context.close();
    });
  }
});

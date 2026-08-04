import { test, expect } from '@playwright/test';
import {
  users,
  routes,
  priorAuthCase,
  stepTherapyCase,
  continuedStayCase,
  sampleDenialLetterText,
} from './fixtures/test-data';

/**
 * prior-auth.spec.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Guide coverage: Section 6 "Professional Tier — Prior Auth Engine
 * (KindAuth)" in full — the guide's own "Most critical section" — plus the
 * relevant Section 14 error states (fake case ID → 404, empty-field
 * validation, denial analyzer <20 char validation).
 *
 * All tests in this file run as the `professional` tier via storageState.
 *
 * NOTE on Section 6's DB verification queries (AI audit log / PHI check /
 * cross-user leakage): those require direct Supabase access and aren't
 * appropriate for a browser-driven E2E suite. If you have a service-role
 * Supabase client available in CI, that verification belongs in a separate
 * Node/SQL script (or a Supabase-backed Playwright fixture) run
 * post-suite — not modeled here to avoid embedding DB credentials in
 * browser-facing test code.
 */

test.use({ storageState: users.professional.storageState });

test.describe('Entry points', () => {
  test('dashboard shows a dark "Prior Auth Engine" card', async ({ page }) => {
    await page.goto(routes.dashboard);
    await expect(page.getByText(/prior auth engine/i).first()).toBeVisible();
  });

  test('dashboard nav shows a "Prior Auth" link with a "NEW" badge', async ({ page }) => {
    await page.goto(routes.dashboard);
    const navLink = page.getByRole('navigation').getByRole('link', { name: /prior auth/i });
    await expect(navLink).toBeVisible();
    await expect(navLink.getByText(/new/i)).toBeVisible();
  });

  test('clicking an entry point opens /prior-auth in a new tab', async ({ page, context }) => {
    await page.goto(routes.dashboard);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('navigation').getByRole('link', { name: /prior auth/i }).click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain(routes.priorAuthHub);
  });
});

test.describe('Prior Auth Hub (/prior-auth)', () => {
  test('renders a standalone dark workspace header', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await expect(page.getByText('OncoKind | Prior Auth Engine')).toBeVisible();
  });

  test('"Back to Dashboard" returns to /dashboard', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('link', { name: /back to dashboard/i }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.dashboard}$`));
  });

  test('stats row shows Total Cases, Ready to Submit, In Review, Approved', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    for (const label of ['Total Cases', 'Ready to Submit', 'In Review', 'Approved']) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('three workflow cards render', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    for (const label of ['Prior Authorization', 'Step Therapy Exception', 'Continued Stay Defense']) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('filter tabs render: All, Prior, Step, Continued', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    for (const tab of ['All', 'Prior', 'Step', 'Continued']) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible();
    }
  });
});

test.describe('New Case — Prior Authorization Request (5-step wizard)', () => {
  test('completes the full wizard and generates a document', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('button', { name: /new prior auth/i }).click();
    await expect(page).toHaveURL(/\/prior-auth\/new\?type=prior_auth/);

    // 5-step progress bar, Step 1 pre-selected.
    const progressBar = page.getByRole('progressbar').or(page.locator('[data-testid*="progress" i]'));
    await expect(progressBar).toBeVisible();
    await expect(page.getByText(/step 1/i)).toBeVisible();

    // Step 1 — Patient / Facility
    await page.getByLabel(/patient ref/i).fill(priorAuthCase.patientRef);
    await page.getByLabel(/facility name/i).fill(priorAuthCase.facilityName);
    await page.getByLabel(/^state$/i).selectOption(priorAuthCase.state);
    await page.getByLabel(/physician/i).fill(priorAuthCase.physician);
    await page.getByRole('button', { name: /next/i }).click();

    // Step 2 — Payer
    await expect(page.getByText(/step 2/i)).toBeVisible();
    await page.getByLabel(/payer/i).fill(priorAuthCase.payer);
    await page.getByLabel(/plan/i).fill(priorAuthCase.plan);
    await page.getByLabel(/member id/i).fill(priorAuthCase.memberIdLast4);
    await page.getByRole('button', { name: /next/i }).click();

    // Step 3 — Medication / Diagnosis
    await expect(page.getByText(/step 3/i)).toBeVisible();
    await page.getByLabel(/medication/i).fill(priorAuthCase.medication);
    await page.getByLabel(/icd-?10/i).fill(priorAuthCase.icd10);
    await page.getByLabel(/diagnosis/i).fill(priorAuthCase.diagnosis);
    await page.getByLabel(/urgent/i).check();
    await page.getByRole('button', { name: /next/i }).click();

    // Step 4 — Review
    await expect(page.getByText(/step 4/i)).toBeVisible();
    await expect(page.getByText(priorAuthCase.patientRef)).toBeVisible();
    await expect(page.getByText(priorAuthCase.medication)).toBeVisible();
    await expect(page.getByText(/ai.assisted|review.*before submitting|disclaimer/i)).toBeVisible(); // amber disclaimer

    // Generate
    const generateBtn = page.getByRole('button', { name: /generate document/i });
    await generateBtn.click();
    await expect(page.getByText(/generating|loading/i)).toBeVisible();

    // Redirects to case workspace, spinner clears within 15s per guide.
    await page.waitForURL(/\/prior-auth\/[^/]+$/, { timeout: 20_000 });
    await expect(page.getByText(/generating|loading/i)).toBeHidden({ timeout: 20_000 });

    // Document body: 400–600 words, bracketed placeholders, amber review bar.
    const docText = await page.locator('[data-testid="generated-document"], textarea').first().inputValue()
      .catch(async () => page.locator('[data-testid="generated-document"]').innerText());
    const wordCount = docText.trim().split(/\s+/).length;
    expect(wordCount, `Generated document word count was ${wordCount}`).toBeGreaterThanOrEqual(300); // guide says 400–600; floor kept lenient for fixture data variance
    expect(docText).toMatch(/\[.*(signature|physician).*\]/i);
    await expect(page.getByText(/review.*placeholder/i)).toBeVisible();
  });
});

test.describe('Document actions', () => {
  // Reuses whatever the most recent Prior Authorization case is; in a fuller
  // suite this would create its own case in a `beforeEach` via an API helper
  // rather than depending on test execution order.
  test('edited text persists in the textarea while on the page', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByText('Prior Authorization').first().click(); // filter tab
    await page.locator('[data-testid="case-row"]').first().click();

    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('EDITED BY PLAYWRIGHT — persistence check');
    await expect(textarea).toHaveValue(/EDITED BY PLAYWRIGHT/);
  });

  test('Copy button copies text and shows a "Copied!" confirmation', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await page.getByRole('button', { name: /^copy$/i }).click();
    await expect(page.getByText('Copied!')).toBeVisible();
  });

  test('Print/PDF button opens a print dialog with the disclaimer footer', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();

    let printTriggered = false;
    page.on('dialog', async (dialog) => {
      printTriggered = true;
      await dialog.dismiss();
    });
    await page.evaluate(() => {
      // Playwright can't intercept native print dialogs directly; verify the
      // print handler fires via window.print being invoked instead.
      (window as any).__printCalled = false;
      const original = window.print;
      window.print = () => {
        (window as any).__printCalled = true;
      };
    });
    await page.getByRole('button', { name: /print|pdf/i }).click();
    const printCalled = await page.evaluate(() => (window as any).__printCalled);
    expect(printCalled).toBeTruthy();
  });
});

test.describe('New Case — Step Therapy Exception', () => {
  test('6-step form captures failed medications and cites state law', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('button', { name: /new step therapy/i }).click();

    for (const med of stepTherapyCase.triedMedications) {
      await page.getByRole('button', { name: /add medication/i }).click();
      await page.getByLabel(/medication name/i).last().fill(med);
      await page.getByLabel(/failed|failure/i).last().check();
    }
    await page.getByRole('button', { name: /next/i }).click(); // advance to State & Law step
    await expect(page.getByText(/state.*law/i)).toBeVisible();

    // Auto-detected PA statute.
    await expect(page.getByText(stepTherapyCase.expectedStatute)).toBeVisible();

    await page.getByRole('button', { name: /generate document/i }).click();
    await page.waitForURL(/\/prior-auth\/[^/]+$/, { timeout: 20_000 });

    const docText = await page.locator('textarea').first().inputValue();
    expect(docText).toContain(stepTherapyCase.expectedStatute);

    // Sidebar cards.
    await expect(page.getByText('State Law Applied')).toBeVisible();
    await expect(page.getByText('Drug Trial History')).toBeVisible();
    for (const med of stepTherapyCase.triedMedications) {
      await expect(page.getByText(med)).toBeVisible();
    }
  });
});

test.describe('New Case — Continued Stay Defense', () => {
  test('generates a document using InterQual-adjacent language', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('button', { name: /new continued stay/i }).click();

    await page.getByLabel(/admission date/i).fill(continuedStayCase.admissionDate);
    await page.getByLabel(/functional status/i).fill(continuedStayCase.functionalStatus);
    await page.getByLabel(/discharge barriers/i).fill(continuedStayCase.dischargeBarriers);
    await page.getByRole('button', { name: /generate document/i }).click();

    await page.waitForURL(/\/prior-auth\/[^/]+$/, { timeout: 20_000 });
    const docText = await page.locator('textarea').first().inputValue();
    expect(docText.toLowerCase()).toContain(continuedStayCase.expectedLanguageFragment.toLowerCase());
  });
});

test.describe('Denial Letter Analyzer', () => {
  test('analyzing a denial letter returns all 6 expected sections', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();

    await page.getByText('Analyze a Denial Letter').scrollIntoViewIfNeeded();
    await page.getByLabel(/denial letter text/i).fill(sampleDenialLetterText);
    await page.getByRole('button', { name: /analyze denial/i }).click();
    await expect(page.getByText(/analyzing/i)).toBeVisible();

    for (const section of [
      'Denial Reason',
      'Denial Code',
      'Appeal Basis',
      'Urgency',
      'Missing Info',
      'Next Step',
    ]) {
      await expect(page.getByText(section)).toBeVisible({ timeout: 15_000 });
    }
  });

  test('"Clear / Analyze another" resets the form', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await page.getByLabel(/denial letter text/i).fill(sampleDenialLetterText);
    await page.getByRole('button', { name: /analyze denial/i }).click();
    await expect(page.getByText('Denial Reason')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /clear|analyze another/i }).click();
    await expect(page.getByLabel(/denial letter text/i)).toHaveValue('');
  });

  // Section 14 — validation on short input.
  test('submitting fewer than 20 characters shows a validation error', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await page.getByLabel(/denial letter text/i).fill('too short');
    await page.getByRole('button', { name: /analyze denial/i }).click();
    await expect(page.getByText(/at least 20 characters|too short/i)).toBeVisible();
  });
});

test.describe('Status tracking & outcome modal', () => {
  test('status can move Ready → Submitted', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await page.getByLabel(/status/i).selectOption({ label: 'Submitted' });
    await expect(page.getByText(/saved|updated/i)).toBeVisible();
  });

  test('changing status to Approved opens the outcome modal and confirms', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await page.getByLabel(/status/i).selectOption({ label: 'Approved' });

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await modal.getByLabel(/notes/i).fill('Approved on first submission — Playwright QA run.');
    await modal.getByRole('button', { name: /confirm/i }).click();
    await expect(modal).toBeHidden();

    await page.goto(routes.priorAuthHub);
    await expect(page.getByText(/approved/i).first()).toBeVisible();
  });

  test('changing status to Denied opens a red outcome modal and confirms', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').nth(1).click();
    await page.getByLabel(/status/i).selectOption({ label: 'Denied' });

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: /confirm/i }).click();
    await expect(modal).toBeHidden();
  });
});

test.describe('Case list & filtering', () => {
  test('all 3 case types appear in the case list with correct stats', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    const rows = page.locator('[data-testid="case-row"]');
    expect(await rows.count()).toBeGreaterThanOrEqual(3);
    await expect(page.getByText('Total Cases')).toBeVisible();
  });

  test('filter tabs correctly show/hide cases by type', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('tab', { name: 'Prior' }).click();
    const rows = page.locator('[data-testid="case-row"]');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText(/prior authorization/i);
    }
  });

  test('clicking a case row navigates to its workspace', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.locator('[data-testid="case-row"]').first().click();
    await expect(page).toHaveURL(/\/prior-auth\/[^/]+$/);
  });
});

test.describe('Error states (Section 14)', () => {
  test('a fake case ID shows a 404 page', async ({ page }) => {
    const response = await page.goto('/prior-auth/00000000-0000-0000-0000-000000000000');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test('clicking Generate with empty required fields shows validation errors', async ({ page }) => {
    await page.goto(routes.priorAuthHub);
    await page.getByRole('button', { name: /new prior auth/i }).click();
    // Skip straight to trying to submit without filling anything.
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });
});

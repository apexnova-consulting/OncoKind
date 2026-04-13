import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const FREE_EMAIL = process.env.TEST_FREE_EMAIL!;
const FREE_PASS = process.env.TEST_FREE_PASS!;
const ADVOCATE_EMAIL = process.env.TEST_ADVOCATE_EMAIL!;
const ADVOCATE_PASS = process.env.TEST_ADVOCATE_PASS!;

function escapePdfText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildSimplePdf(text: string): Buffer {
  const lines = text.split('\n');
  const content = [
    'BT',
    '/F1 12 Tf',
    '50 750 Td',
    ...lines.flatMap((line, index) =>
      index === 0
        ? [`(${escapePdfText(line)}) Tj`]
        : ['0 -18 Td', `(${escapePdfText(line)}) Tj`]
    ),
    'ET',
  ].join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${object}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForURL(/dashboard|journey|reports|home/, { timeout: 20_000 });
}

async function postSeed(page: Page, body: Record<string, unknown>) {
  return page.evaluate(async (payload) => {
    const response = await fetch('/api/test/advocacy/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return {
      status: response.status,
      body: await response.json().catch(() => ({})),
    };
  }, body);
}

async function getRetentionSnapshot(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/test/zero-retention-status');
    return response.json();
  });
}

test.describe.configure({ mode: 'serial' });

test.describe('Advocacy & Appeals', () => {
  test('Fund matching shows an open fund for stage IV lung cancer', async ({ page }) => {
    await login(page, ADVOCATE_EMAIL, ADVOCATE_PASS);

    const seeded = await postSeed(page, {
      subscriptionTier: 'advocate',
      seedFinancialHelp: true,
    });
    expect(seeded.status).toBe(200);

    await page.goto(`${BASE_URL}/journey/financial-help`);
    await expect(page.getByRole('heading', { name: /financial help/i })).toBeVisible();
    await expect(page.getByText(/last updated:/i)).toBeVisible();
    await expect(page.getByText(/open/i).first()).toBeVisible();
    await expect(
      page.getByText(/lung cancer|non-small cell lung cancer|PAF Lung Cancer Co-Pay Relief Fund/i).first()
    ).toBeVisible();
  });

  test('Appeal logic decodes Prior Auth Required and generates a draft appeal', async ({ page }) => {
    await login(page, ADVOCATE_EMAIL, ADVOCATE_PASS);

    const seeded = await postSeed(page, {
      subscriptionTier: 'advocate',
      seedFinancialHelp: false,
    });
    expect(seeded.status).toBe(200);

    await page.goto(`${BASE_URL}/journey/insurance-support`);

    const denialPdf = buildSimplePdf([
      'Insurance: Blue Cross Blue Shield',
      'Denial Code: Prior Auth Required',
      'Member Services: 800-555-1212',
      'Appeal must be submitted within 30 days.',
      'Patient needs biomarker-driven oncology treatment.',
    ].join('\n'));

    await page.locator('input[type="file"]').setInputFiles({
      name: 'sample-denial.pdf',
      mimeType: 'application/pdf',
      buffer: denialPdf,
    });

    await page.getByRole('button', { name: /decode denial letter/i }).click();
    await expect(page.getByText(/prior auth required/i)).toBeVisible();
    await expect(page.getByText(/blue cross blue shield/i)).toBeVisible();

    await page.getByRole('button', { name: /generate appeal letter/i }).click();
    await expect(page.getByText(/draft appeal package/i)).toBeVisible();
    await expect(page.getByText(/letter of medical necessity/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /export \/ print pdf/i })).toBeVisible();
  });

  test('Free tier user is redirected to Advocate pricing when generating an appeal', async ({ page }) => {
    await login(page, FREE_EMAIL, FREE_PASS);

    const seeded = await postSeed(page, {
      subscriptionTier: 'free',
      seedFinancialHelp: false,
    });
    expect(seeded.status).toBe(200);

    await page.goto(`${BASE_URL}/journey/insurance-support`);

    const denialPdf = buildSimplePdf([
      'Insurance: UnitedHealthcare',
      'Reason Code: Prior Auth Required',
      'Customer Service: 877-555-0100',
      'Appeal within 45 days.',
    ].join('\n'));

    await page.locator('input[type="file"]').setInputFiles({
      name: 'free-user-denial.pdf',
      mimeType: 'application/pdf',
      buffer: denialPdf,
    });

    await page.getByRole('button', { name: /decode denial letter/i }).click();
    await expect(page.getByText(/prior auth required/i)).toBeVisible();

    await page.getByRole('button', { name: /generate appeal letter/i }).click();
    await expect(page).toHaveURL(/pricing\?plan=advocate/);
    await expect(page.getByText(/\$49/)).toBeVisible();
    await expect(page.getByText(/advocate plan/i)).toBeVisible();
  });

  test('Zero-retention monitor reports no active temp artifacts after upload processing', async ({ page }) => {
    test.setTimeout(150_000);

    await login(page, FREE_EMAIL, FREE_PASS);

    const seeded = await postSeed(page, {
      subscriptionTier: 'free',
      seedFinancialHelp: false,
    });
    expect(seeded.status).toBe(200);

    await page.goto(`${BASE_URL}/journey/insurance-support`);

    const denialPdf = buildSimplePdf([
      'Insurance: Cigna',
      'Denial Code: Prior Auth Required',
      'Member Services: 866-555-0199',
      'Please file your appeal within 60 days.',
    ].join('\n'));

    await page.locator('input[type="file"]').setInputFiles({
      name: 'retention-check.pdf',
      mimeType: 'application/pdf',
      buffer: denialPdf,
    });

    await page.getByRole('button', { name: /decode denial letter/i }).click();
    await expect(page.getByText(/decoded denial/i)).toBeVisible();

    await page.waitForTimeout(61_000);
    const snapshot = await getRetentionSnapshot(page);
    expect(snapshot.activeTempArtifacts).toBe(0);
  });
});

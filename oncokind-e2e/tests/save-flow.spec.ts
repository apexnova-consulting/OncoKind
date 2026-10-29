import { test, expect } from '@playwright/test';

test('Billing save flow is not public while the flag is off', async ({ page }) => {
  await page.goto('/dashboard/billing/save');
  await expect(page).not.toHaveURL(/billing\/save$/);
});

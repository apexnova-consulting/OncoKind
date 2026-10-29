import { test, expect } from '@playwright/test';

test('Keep and partners stay off while flags are off', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'Keep', exact: true })).toHaveCount(0);
  const partners = await page.goto('/partners');
  expect(partners?.status()).toBe(404);
});

test('Public nav does not add Keep or Partners', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Keep' })).toHaveCount(0);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Partners' })).toHaveCount(0);
});

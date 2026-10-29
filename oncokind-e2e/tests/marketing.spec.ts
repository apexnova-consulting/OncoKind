import { test, expect, type Page } from '@playwright/test';
import {
  routes,
  homepageJourneyStages,
  pricingTiers,
  pricingComparisonRowCount,
  pricingFaqQuestions,
  homepageFaqQuestions,
  newTemplateNavLabels,
  newTemplateFooterColumnLabels,
  newTemplateFooterColumnCount,
} from './fixtures/test-data';

/**
 * marketing.spec.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Updated Sep 2026 against the LIVE site. See ../SITE_REVIEW_FINDINGS.md
 * for the July write-up. The previously failing public-site bugs are now
 * asserted as passing behavior:
 *   1. /features/empathy-filter is a real feature page.
 *   2. robots.txt explicitly allows /prior-auth-pro.
 *   3. "Start Caregiver Plus" links to /signup?plan=plus.
 */

/** Site logo accessible name is "O ncoKind" (split accent span), not "OncoKind". */
function logoLink(page: Page) {
  return page.getByRole('link', { name: /O\s*ncoKind/i }).first();
}

/** Site chrome footer (role=contentinfo). Testimonial <footer>s are excluded. */
function siteFooter(page: Page) {
  return page.getByRole('contentinfo');
}

/** Main nav links, including the desktop nav hidden behind `lg:flex` on mobile. */
async function mainNavLinkTexts(page: Page): Promise<string[]> {
  return page
    .getByRole('navigation', { name: /main/i, includeHidden: true })
    .getByRole('link', { includeHidden: true })
    .allInnerTexts();
}

test.describe('Homepage (/)', () => {
  test('loads without unexpected console or page errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(routes.home);
    await page.waitForLoadState('networkidle');

    expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
    expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('hero headline and primary CTA render correctly', async ({ page }) => {
    await page.goto(routes.home);
    await expect(
      page.getByRole('heading', { name: /rare women's/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /start first 72 hours/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /start concierge case/i }).first()).toBeVisible();
  });

  test('"Start First 72 Hours" CTA navigates to /signup', async ({ page }) => {
    await page.goto(routes.home);
    await page.getByRole('link', { name: /start first 72 hours/i }).first().click();
    await expect(page).toHaveURL(new RegExp(routes.signup));
  });

  test('founder story section is present with a link to the full story', async ({ page }) => {
    // Founder <video> was removed; the "Why this exists" story section remains.
    await page.goto(routes.home);
    await expect(
      page.getByRole('heading', { name: /why this exists/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /read the full founder story/i })).toBeVisible();
  });

  test('homepage links visitors to the pricing page', async ({ page }) => {
    // Inline pricing preview cards were removed from the homepage; the Pricing
    // nav/footer path is the way in now.
    await page.goto(routes.home);
    await expect(
      page
        .getByRole('navigation', { name: /main/i, includeHidden: true })
        .getByRole('link', { name: 'Pricing', includeHidden: true })
    ).toHaveAttribute('href', /\/pricing/);
  });

  test('homepage shows four stages instead of a tool grid', async ({ page }) => {
    await page.goto(routes.home);
    for (const stage of homepageJourneyStages) {
      await expect(page.getByText(stage.name, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'Learn more', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /see all features/i })).toBeVisible();
  });

  test(
    '"The Empathy Filter" feature card link does not 404',
    async ({ page, request, baseURL }) => {
      await page.goto(routes.home);
      const response = await request.get(`${baseURL}${routes.featureEmpathyFilter}`);
      expect(response.ok(), `${routes.featureEmpathyFilter} returned ${response.status()}`).toBeTruthy();
    }
  );

  test('homepage FAQ shows all 5 questions', async ({ page }) => {
    await page.goto(routes.home);
    await page.getByText(/questions families ask/i).scrollIntoViewIfNeeded();
    for (const question of homepageFaqQuestions) {
      await expect(page.getByText(question, { exact: false })).toBeVisible();
    }
  });

  test('Rosemarie sample demo does not mention NSCLC', async ({ page }) => {
    await page.goto(routes.home);
    const demo = page.locator('#sample-demo');
    await expect(demo).toBeVisible();
    await expect(demo.getByText(/vulvar/i).first()).toBeVisible();
    await expect(demo.getByText(/nsclc|non-small cell lung/i)).toHaveCount(0);
  });

  test('homepage stats cite AMA and KFF sources', async ({ page }) => {
    await page.goto(routes.home);
    await expect(page.getByRole('link', { name: /american medical association \(2024\)/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /kaiser family foundation \(2025\)/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /kaiser family foundation \(2024\)/i })).toBeVisible();
    await expect(page.getByText(/industry research|healthcare system data/i)).toHaveCount(0);
  });

  test('final CTA section renders at bottom of page', async ({ page }) => {
    await page.goto(routes.home);
    await page.keyboard.press('End');
    await expect(siteFooter(page)).toBeInViewport();
  });
});

test.describe('Pricing (/pricing)', () => {
  test('all 3 tier cards visible with current pricing', async ({ page }) => {
    await page.goto(routes.pricing);
    for (const tier of Object.values(pricingTiers)) {
      await expect(page.getByRole('heading', { name: tier.name, exact: true })).toBeVisible();
      if (tier.price !== '$0') {
        await expect(page.getByText(tier.price, { exact: false }).first()).toBeVisible();
      }
    }
    await expect(page.getByText(pricingTiers.caregiver.badge)).toBeVisible();
    await expect(page.getByText(/14-day trial/i).first()).toBeVisible();
  });

  test('monthly is the default billing interval and yearly toggle updates the price', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByText(/save ~/i).first()).toBeVisible();
    await expect(page.getByText('$39').first()).toBeVisible();

    await page.getByRole('button', { name: /annual billing/i }).click();
    await expect(page.getByText('$390').first()).toBeVisible();
  });

  test('Explorer, Caregiver Pro, and Concierge cards are the public pricing doors', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByRole('heading', { name: /explorer/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /caregiver pro/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /^concierge$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /start caregiver plus/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /book a demo/i })).toHaveCount(0);
  });

  test('"Start Free Trial" links to /signup?plan=pro', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByRole('link', { name: /start free trial/i }).first()).toHaveAttribute(
      'href',
      /\/signup\?plan=pro/
    );
  });

  test('signup from Caregiver Pro pre-selects the plan', async ({ page }) => {
    await page.goto(routes.pricing);
    await page.getByRole('link', { name: /start free trial/i }).first().click();
    await expect(page).toHaveURL(/\/signup\?plan=pro/);
    await expect(page.getByText(/selected plan/i)).toBeVisible();
    await expect(page.getByText(/caregiver pro/i).first()).toBeVisible();
  });

  test(`feature comparison table renders with ${pricingComparisonRowCount} rows`, async ({ page }) => {
    await page.goto(routes.pricing);
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(pricingComparisonRowCount);
  });

  test('feature comparison table does not sell KindAuth on public pricing', async ({
    page,
  }) => {
    await page.goto(routes.pricing);
    await expect(page.locator('tr', { hasText: 'KindAuth' })).toHaveCount(0);
  });

  test('pricing FAQ shows all 5 questions', async ({ page }) => {
    await page.goto(routes.pricing);
    for (const question of pricingFaqQuestions) {
      await expect(page.getByText(question, { exact: false })).toBeVisible();
    }
  });
});

test.describe('Parked B2B routes', () => {
  test('/professional redirects home', async ({ page }) => {
    const response = await page.goto(routes.forProfessionals);
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/$/);
  });

  test('/prior-auth-pro redirects home', async ({ page }) => {
    const response = await page.goto(routes.priorAuthPro);
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Site template consistency', () => {
  // Finding #1 is fixed as of Aug 2026: /about, /resources, and /community
  // now render the same nav + footer as the rest of the marketing site.
  const formerlyOldTemplatePages = [routes.about, routes.resources, routes.community, routes.trust];

  for (const route of formerlyOldTemplatePages) {
    test(`${route} uses the same nav as the rest of the site`, async ({ page }) => {
      await page.goto(route);
      const navLinks = await mainNavLinkTexts(page);
      for (const label of newTemplateNavLabels) {
        expect(navLinks.some((l) => l.includes(label)), `Expected nav on ${route} to include "${label}"`).toBeTruthy();
      }
      await expect(page.getByRole('link', { name: /^Timeline$/ })).toHaveCount(0);
      await expect(page.getByRole('link', { name: /^Prep Sheet$/ })).toHaveCount(0);
    });

    test(`${route} footer has the same ${newTemplateFooterColumnCount} columns as the rest of the site`, async ({
      page,
    }) => {
      await page.goto(route);
      const footer = siteFooter(page);
      for (const label of newTemplateFooterColumnLabels) {
        await expect(footer.getByText(label, { exact: true })).toBeVisible();
      }
    });
  }

  test('formerly old-template pages share one consistent public chrome', async ({ page }) => {
    const navSnapshots: string[][] = [];
    for (const route of formerlyOldTemplatePages) {
      await page.goto(route);
      navSnapshots.push(await mainNavLinkTexts(page));
      const footer = siteFooter(page);
      for (const label of newTemplateFooterColumnLabels) {
        await expect(footer.getByText(label, { exact: true })).toBeVisible();
      }
    }
    // All three should expose the same main-nav link set.
    for (let i = 1; i < navSnapshots.length; i++) {
      expect(navSnapshots[i]).toEqual(navSnapshots[0]);
    }
  });
});

test.describe('Other marketing pages', () => {
  const newTemplatePages: Array<[string, string]> = [
    [routes.learn, 'learn'],
    [routes.trust, 'trust'],
    [routes.privacy, 'privacy'],
    [routes.terms, 'terms'],
    [routes.support, 'support'],
    [routes.security, 'security'],
    [routes.mission, 'mission'],
  ];

  for (const [route, name] of newTemplatePages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok(), `${route} should return an OK response`).toBeTruthy();
    });
  }

  test('/learn — article index loads with many readable guides', async ({ page }) => {
    await page.goto(routes.learn);
    const guideLinks = page.getByRole('link', { name: /read guide/i });
    expect(await guideLinks.count()).toBeGreaterThanOrEqual(2);
  });

  test('/trust — data retention language present', async ({ page }) => {
    await page.goto(routes.trust);
    await expect(page.getByText(/data retention/i)).toBeVisible();
  });

  test('/privacy — data retention language present', async ({ page }) => {
    await page.goto(routes.privacy);
    await expect(page.getByText(/data retention/i)).toBeVisible();
  });

  test('/support — support@oncokind.com is visible', async ({ page }) => {
    await page.goto(routes.support);
    await expect(page.getByText('support@oncokind.com')).toBeVisible();
  });

  test('/resources loads with its own distinct article set', async ({ page }) => {
    await page.goto(routes.resources);
    const response = await page.goto(routes.resources);
    expect(response?.ok()).toBeTruthy();
    const articleLinks = page.getByRole('link', { name: /read article/i });
    expect(await articleLinks.count()).toBeGreaterThanOrEqual(2);
  });

  test('/community hub loads with 4 categories visible', async ({ page }) => {
    await page.goto(routes.community);
    for (const category of ['Just Diagnosed', 'Treatment & Side Effects', 'Insurance & Financial Help', 'Caregiver Support']) {
      await expect(page.getByText(category)).toBeVisible();
    }
  });

  test('/waitlist redirects to /signup', async ({ page }) => {
    await page.goto(routes.waitlist);
    await expect(page).toHaveURL(/\/signup\/?$/);
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  });
});

test.describe('Navigation & SEO', () => {
  test('main nav on marketing pages matches the confirmed link set', async ({ page }) => {
    await page.goto(routes.home);
    const navLinks = await mainNavLinkTexts(page);
    for (const label of newTemplateNavLabels) {
      expect(navLinks.some((l) => l.includes(label)), `Missing nav link: ${label}`).toBeTruthy();
    }
  });

  test(`footer shows ${newTemplateFooterColumnCount} columns and 2026 copyright`, async ({ page }) => {
    await page.goto(routes.home);
    const footer = siteFooter(page);
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/2026/)).toBeVisible();
    for (const label of newTemplateFooterColumnLabels) {
      await expect(footer.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('footer does not include a Join Waitlist link', async ({ page }) => {
    await page.goto(routes.home);
    await expect(siteFooter(page).getByRole('link', { name: /join waitlist/i })).toHaveCount(0);
  });

  test('footer Contact links to support', async ({ page }) => {
    await page.goto(routes.home);
    await expect(siteFooter(page).getByRole('link', { name: /^Contact$/ }).first()).toHaveAttribute(
      'href',
      /\/support/
    );
  });

  test('Cancer Support Community helpline is visible in the footer', async ({ page }) => {
    await page.goto(routes.home);
    await expect(page.getByText('1-888-793-9355')).toBeVisible();
  });

  test('logo on pricing page links back to /', async ({ page }) => {
    await page.goto(routes.pricing);
    await logoLink(page).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('/ has a <title> tag with expected content', async ({ page }) => {
    await page.goto(routes.home);
    await expect(page).toHaveTitle(/OncoKind/);
  });

  test('pricing metadata matches Caregiver Pro at $39/$390 and Caregiver Plus at $49/$490', async ({ page }) => {
    await page.goto(routes.pricing);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    expect(description).toMatch(/\$39\/month/);
    expect(description).toMatch(/\$390\/year/);
    expect(description).toMatch(/\$49\/month/);
    expect(ogDescription).toMatch(/\$39\/month/);
    expect(twitterDescription).toMatch(/\$39\/month/);
  });

  test('robots.txt does not disallow the public /prior-auth-pro marketing page', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/robots.txt`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();

    // Reconstruct the effective rule set for /prior-auth-pro: if there's a
    // `Disallow: /prior-auth` line and no more-specific `Allow: /prior-auth-pro`
    // ahead of it, standard robots.txt precedence disallows this page too.
    const hasBlanketDisallow = /Disallow:\s*\/prior-auth\s*$/m.test(body);
    const hasExplicitAllow = /Allow:\s*\/prior-auth-pro/m.test(body);
    expect(hasExplicitAllow, 'robots.txt should explicitly allow /prior-auth-pro').toBeTruthy();
    expect(hasBlanketDisallow && !hasExplicitAllow, 'robots.txt disallows /prior-auth-pro via prefix match').toBeFalsy();
    expect(/Disallow:\s*\/prior-auth-pro/m.test(body)).toBeFalsy();
  });

  test('robots.txt disallows /dashboard/, /api/, and the authenticated /prior-auth workspace', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get(`${baseURL}/robots.txt`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toMatch(/Disallow:\s*\/dashboard\//);
    expect(body).toMatch(/Disallow:\s*\/api\//);
    expect(body).toMatch(/Disallow:\s*\/prior-auth/);
  });

  test('sitemap.xml is reachable and includes /prior-auth-pro', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/sitemap.xml`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('/prior-auth-pro');
  });

  test('unknown URL shows a custom 404 page, not a blank/default page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-qa-check');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/404|not found/i)).toBeVisible();
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(20);
  });
});

test.describe('Responsive layout (Section 10 — runs against the `mobile-marketing` project too)', () => {
  test('homepage hero is readable with a tappable primary CTA (min 44px height)', async ({ page }) => {
    await page.goto(routes.home);
    const cta = page.getByRole('link', { name: /upload your first report/i }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('pricing cards stack vertically on narrow viewports', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only meaningful on the mobile project');
    await page.goto(routes.pricing);
    const freeHeading = page.getByRole('heading', { name: pricingTiers.free.name, exact: true });
    const careHeading = page.getByRole('heading', { name: pricingTiers.caregiver.name, exact: true });
    const freeCard = freeHeading.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
    const proCard = careHeading.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
    const firstBox = await freeCard.boundingBox();
    const secondBox = await proCard.boundingBox();
    expect(firstBox && secondBox).toBeTruthy();
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y + firstBox.height - 5);
    }
  });
});

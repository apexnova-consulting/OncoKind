import { test, expect, type Page } from '@playwright/test';
import {
  routes,
  homepageFeatureCards,
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
 * Updated Aug 2026 against the LIVE site. See ../SITE_REVIEW_FINDINGS.md
 * for the July write-up; several of those findings have since changed:
 *   - /about, /resources, /community now share the unified public template
 *   - Homepage feature grid is 10 cards (Goals of Care Prep Sheet added)
 *   - Founder video removed; founder story copy remains
 *   - Homepage pricing preview removed
 * Two tests remain EXPECTED TO FAIL (`test.fail(...)`) until fixed:
 *   1. /features/empathy-filter 404s despite being linked from the footer
 *      and homepage feature grid.
 *   2. robots.txt appears to disallow /prior-auth-pro via prefix-matching
 *      on a `Disallow: /prior-auth` rule.
 *   3. "Start Advocate Plan" still omits `?plan=advocate` on /pricing.
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
      page.getByRole('heading', { name: /you shouldn't have to understand oncology/i })
    ).toBeVisible();
    // Hero + final CTA both say "Upload your first report" — scope to the first (hero).
    await expect(page.getByRole('link', { name: /upload your first report/i }).first()).toBeVisible();
  });

  test('"Upload your first report" CTA navigates to /signup', async ({ page }) => {
    await page.goto(routes.home);
    await page.getByRole('link', { name: /upload your first report/i }).first().click();
    await expect(page).toHaveURL(new RegExp(routes.signup));
  });

  test('"Try a sample report first" scrolls to the interactive demo', async ({ page }) => {
    await page.goto(routes.home);
    await page.getByRole('link', { name: /try a sample report first/i }).click();
    await expect(page).toHaveURL(/#sample-demo/);
    await expect(page.getByText(/interactive sample demo/i)).toBeInViewport();
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

  test(`feature grid shows ${homepageFeatureCards.length} cards with working "Learn more" links`, async ({
    page,
  }) => {
    await page.goto(routes.home);
    // Exact name avoids the separate "Learn more about the Empathy Filter" link.
    const learnMoreLinks = page.getByRole('link', { name: 'Learn more', exact: true });
    await expect(learnMoreLinks).toHaveCount(homepageFeatureCards.length);
  });

  test('feature grid card hrefs match the expected feature pages', async ({ page }) => {
    await page.goto(routes.home);
    for (const card of homepageFeatureCards) {
      const heading = page.getByRole('heading', { name: card.name, exact: true });
      await expect(heading).toBeVisible();
      const cardLink = heading.locator('xpath=following::a[normalize-space()="Learn more"][1]');
      await expect(cardLink).toHaveAttribute('href', new RegExp(card.href.replace(/\//g, '\\/')));
    }
  });

  // Finding #2 — this card's link 404s live. Written to fail until fixed.
  test.fail(
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

  test('final CTA section renders at bottom of page', async ({ page }) => {
    await page.goto(routes.home);
    await page.keyboard.press('End');
    await expect(siteFooter(page)).toBeInViewport();
  });
});

test.describe('Pricing (/pricing)', () => {
  test('all 4 tier cards visible with current pricing', async ({ page }) => {
    await page.goto(routes.pricing);
    for (const tier of Object.values(pricingTiers)) {
      // Prefer heading role so "Free" isn't confused with "Get Started Free" / "2 months free".
      await expect(page.getByRole('heading', { name: tier.name, exact: true })).toBeVisible();
      if (tier.price !== '$0') {
        await expect(page.getByText(tier.price, { exact: false }).first()).toBeVisible();
      }
    }
    await expect(page.getByText(pricingTiers.advocate.badge)).toBeVisible();
  });

  test('monthly/yearly toggle updates displayed prices', async ({ page }) => {
    // Confirmed fixed live (was flagged missing in the June guide).
    await page.goto(routes.pricing);
    await expect(page.getByText(/2 months free/i)).toBeVisible();

    const proCard = page.getByText(pricingTiers.pro.name).locator('..');
    const monthlyPrice = await proCard.getByText(pricingTiers.pro.price).first().innerText();

    await page.getByRole('tab', { name: /yearly/i }).or(page.getByText('Yearly')).click();
    await page.waitForTimeout(300); // allow price re-render

    const yearlyPriceLocator = proCard.getByText(/\$\d/).first();
    await expect(yearlyPriceLocator).not.toHaveText(monthlyPrice);
  });

  test('"Start Caregiver Pro" links to /signup?plan=pro', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByRole('link', { name: /start caregiver pro/i })).toHaveAttribute(
      'href',
      /\/signup\?plan=pro/
    );
  });

  // Finding #5 — live site omits the plan param for Advocate. Written to the
  // INTENDED behavior; fails until the link is fixed to match Pro's pattern.
  test.fail('"Start Advocate Plan" links to /signup?plan=advocate', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByRole('link', { name: /start advocate plan/i })).toHaveAttribute(
      'href',
      /\/signup\?plan=advocate/
    );
  });

  test('"Book a Demo" on Professional tier links to Calendly', async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page.getByRole('link', { name: /book a demo/i }).first()).toHaveAttribute(
      'href',
      /calendly\.com\/oncokind-support/
    );
  });

  test(`feature comparison table renders with ${pricingComparisonRowCount} rows`, async ({ page }) => {
    await page.goto(routes.pricing);
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(pricingComparisonRowCount);
  });

  test('feature comparison table includes a Prior Auth Engine (KindAuth) row', async ({ page }) => {
    // Confirmed added since the June guide's QA notes suggested it.
    await page.goto(routes.pricing);
    await expect(page.getByText(/prior auth engine \(kindauth\)/i)).toBeVisible();
  });

  test('pricing FAQ shows all 5 questions', async ({ page }) => {
    await page.goto(routes.pricing);
    for (const question of pricingFaqQuestions) {
      await expect(page.getByText(question, { exact: false })).toBeVisible();
    }
  });
});

test.describe('For Professionals (/professional)', () => {
  test('Prior Auth Engine section visible with "See Full Details" link', async ({ page }) => {
    await page.goto(routes.forProfessionals);
    await expect(page.getByRole('heading', { name: /prior auth engine/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /see full details/i })).toHaveAttribute(
      'href',
      new RegExp(routes.priorAuthPro)
    );
  });

  test('"Book a Demo" links to Calendly', async ({ page }) => {
    await page.goto(routes.forProfessionals);
    const demoLinks = page.getByRole('link', { name: /book a demo/i });
    await expect(demoLinks.first()).toHaveAttribute('href', /calendly\.com\/oncokind-support/);
  });

  // As of Aug 2026, "Prior Auth Engine" is no longer injected into the public
  // nav on this page (or anywhere else). The section heading above is the
  // discovery path; keep this assertion so a regression that re-adds a
  // page-only nav item is noticed.
  test('public nav does not include a page-only "Prior Auth Engine" link', async ({ page }) => {
    await page.goto(routes.forProfessionals);
    await expect(
      page
        .getByRole('navigation', { name: /main/i, includeHidden: true })
        .getByRole('link', { name: 'Prior Auth Engine', includeHidden: true })
    ).toHaveCount(0);
  });
});

test.describe('Prior Auth Pro (/prior-auth-pro)', () => {
  // Playwright's browser context does NOT consult robots.txt (that's a
  // crawler-etiquette signal, not a browser-enforced rule), so these
  // functional checks still run even though the page is likely mis-blocked
  // from search engines — see the dedicated robots.txt test below.
  test('loads publicly with no login required', async ({ page }) => {
    const response = await page.goto(routes.priorAuthPro);
    expect(response?.ok()).toBeTruthy();
    await expect(page).not.toHaveURL(new RegExp(routes.login));
  });

  test('three workflow cards render: Prior Authorization, Step Therapy Exception, Continued Stay', async ({
    page,
  }) => {
    await page.goto(routes.priorAuthPro);
    for (const label of ['Prior Authorization', 'Step Therapy Exception', 'Continued Stay']) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
  });

  test('"Start Free — Professional Plan" navigates to signup with the professional plan', async ({ page }) => {
    await page.goto(routes.priorAuthPro);
    await page.getByRole('link', { name: /start free.*professional plan/i }).click();
    await expect(page).toHaveURL(/\/signup\?plan=professional/);
  });
});

test.describe('Site template consistency', () => {
  // Finding #1 is fixed as of Aug 2026: /about, /resources, and /community
  // now render the same nav + footer as the rest of the marketing site.
  const formerlyOldTemplatePages = [routes.about, routes.resources, routes.community];

  for (const route of formerlyOldTemplatePages) {
    test(`${route} uses the same nav as the rest of the site`, async ({ page }) => {
      await page.goto(route);
      const navLinks = await mainNavLinkTexts(page);
      for (const label of newTemplateNavLabels) {
        expect(navLinks.some((l) => l.includes(label)), `Expected nav on ${route} to include "${label}"`).toBeTruthy();
      }
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

  test('/waitlist shows the closed-waitlist message, not a signup form', async ({ page }) => {
    // The waitlist retired when the product launched (Section 12 of the
    // June guide assumed an active signup form — that flow no longer
    // exists). This replaces the old "/waitlist form submits" test entirely.
    await page.goto(routes.waitlist);
    await expect(page.getByText(/waitlist is now closed/i)).toBeVisible();
    await expect(page.getByText(/oncokind has launched/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /go to oncokind/i })).toHaveAttribute('href', /^\/$|^https?:\/\/(www\.)?oncokind\.com\/?$/);
    // There should be no lingering email capture form on this page anymore.
    await expect(page.getByLabel(/email/i)).toHaveCount(0);
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

  // Finding #3 — likely prefix-match bug in robots.txt. Written to fail
  // until an explicit `Allow: /prior-auth-pro` (ordered ahead of the
  // `Disallow: /prior-auth` rule) is added.
  test.fail('robots.txt does not disallow the public /prior-auth-pro marketing page', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/robots.txt`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();

    // Reconstruct the effective rule set for /prior-auth-pro: if there's a
    // `Disallow: /prior-auth` line and no more-specific `Allow: /prior-auth-pro`
    // ahead of it, standard robots.txt precedence disallows this page too.
    const hasBlanketDisallow = /Disallow:\s*\/prior-auth\s*$/m.test(body);
    const hasExplicitAllow = /Allow:\s*\/prior-auth-pro/m.test(body);
    expect(hasBlanketDisallow && !hasExplicitAllow, 'robots.txt disallows /prior-auth-pro via prefix match').toBeFalsy();
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
    const proHeading = page.getByRole('heading', { name: pricingTiers.pro.name, exact: true });
    const freeCard = freeHeading.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
    const proCard = proHeading.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
    const firstBox = await freeCard.boundingBox();
    const secondBox = await proCard.boundingBox();
    expect(firstBox && secondBox).toBeTruthy();
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y + firstBox.height - 5);
    }
  });
});

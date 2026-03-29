import { test, expect } from '@playwright/test';

test.describe('marketing home', () => {
  test('shows primary hero heading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /plan projects, track tasks, and keep work moving/i,
      }),
    ).toBeVisible();
  });

  test('has navigation to sign in', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('link', { name: /go to dashboard/i }),
    ).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('sign in page', () => {
  test('renders email and password fields', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});

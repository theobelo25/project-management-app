import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

/** When set (e.g. in CI), Playwright starts `next dev` before running tests. Locally, run `pnpm dev` in another terminal or set this. */
const startWebServer =
  process.env.CI === 'true' || process.env.PLAYWRIGHT_START_SERVER === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  /** One worker avoids hammering `next dev` during cold compile. */
  workers: process.env.CI ? 2 : 1,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    navigationTimeout: 90_000,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  ...(startWebServer
    ? {
        webServer: {
          command: 'pnpm exec next dev --port 3000',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }
    : {}),
});

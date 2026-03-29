import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const webSrc = path.join(dirname, 'src');

const resolveWebAlias = {
  alias: {
    '@web': webSrc,
  },
} as const;

export default defineConfig({
  resolve: resolveWebAlias,
  test: {
    projects: [
      {
        extends: true,
        resolve: resolveWebAlias,
        plugins: [
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        resolve: resolveWebAlias,
        plugins: [react()],
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          exclude: ['node_modules', '.storybook', '**/*.integration.test.ts'],
        },
      },
      {
        resolve: resolveWebAlias,
        plugins: [react()],
        test: {
          name: 'integration',
          environment: 'jsdom',
          include: ['src/**/*.integration.test.tsx'],
          setupFiles: [path.join(dirname, 'src/test/setup-integration.ts')],
        },
      },
    ],
  },
});

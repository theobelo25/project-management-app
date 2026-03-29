// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(globalIgnores([
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
  // Not part of tsconfig.json; avoid projectService parsing errors
  'eslint.config.mjs',
  'postcss.config.mjs',
]), ...nextVitals, {
  settings: {
    next: {
      rootDir: '.',
    },
  },
}, eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintPluginPrettierRecommended, {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
}, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // React 19 / Next compiler rules: warn until patterns are aligned app-wide
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/purity': 'warn',
    'react-hooks/set-state-in-effect': 'warn',
  },
}, storybook.configs["flat/recommended"]);

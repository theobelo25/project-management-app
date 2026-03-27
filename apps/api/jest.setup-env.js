// Runs before each test file is loaded (Jest setupFiles). @repo/database throws if DATABASE_URL is missing at import time.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://127.0.0.1:5432/jest_placeholder';
}

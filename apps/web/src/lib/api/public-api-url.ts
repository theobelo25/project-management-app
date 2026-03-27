function normalizeBase(raw: string): string {
  return raw.replace(/\/+$/, '');
}

let cachedBase: string | null = null;

/**
 * Public API origin (no trailing slash). Cached after first read.
 * Throws if `NEXT_PUBLIC_API_URL` is missing or blank so bad deploys fail loudly
 * instead of producing `undefined/api/...` requests.
 */
export function getPublicApiBaseUrl(): string {
  if (cachedBase !== null) return cachedBase;

  const raw = (process.env.NEXT_PUBLIC_API_URL ?? '').trim();
  if (!raw) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set or empty. Set it in the web app environment so requests can reach the API.',
    );
  }

  cachedBase = normalizeBase(raw);
  return cachedBase;
}

/** Absolute URL for a path starting with `/` (e.g. `/api/projects`). */
export function apiUrl(path: string): string {
  const base = getPublicApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

if (process.env.NODE_ENV === 'development') {
  getPublicApiBaseUrl();
}

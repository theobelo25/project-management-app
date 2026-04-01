import { describe, expect, it } from 'vitest';
import { ROUTES } from '@web/lib/routes';
import { sanitizeCallbackUrl } from './safe-callback-url';

describe('sanitizeCallbackUrl', () => {
  it('returns internal callback paths', () => {
    expect(sanitizeCallbackUrl('/projects/abc')).toBe('/projects/abc');
  });

  it('falls back for external urls', () => {
    expect(sanitizeCallbackUrl('https://evil.example')).toBe(ROUTES.projects);
    expect(sanitizeCallbackUrl('http://evil.example')).toBe(ROUTES.projects);
  });

  it('falls back for protocol-relative and malformed leading slashes', () => {
    expect(sanitizeCallbackUrl('//evil.example')).toBe(ROUTES.projects);
    expect(sanitizeCallbackUrl('/\\evil.example')).toBe(ROUTES.projects);
  });

  it('falls back for empty input', () => {
    expect(sanitizeCallbackUrl(undefined)).toBe(ROUTES.projects);
    expect(sanitizeCallbackUrl(null)).toBe(ROUTES.projects);
    expect(sanitizeCallbackUrl('   ')).toBe(ROUTES.projects);
  });
});

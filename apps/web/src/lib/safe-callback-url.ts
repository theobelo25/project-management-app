import { ROUTES } from '@web/lib/routes';

export function sanitizeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return ROUTES.projects;

  const value = raw.trim();
  if (!value.startsWith('/')) return ROUTES.projects;
  if (value.startsWith('//')) return ROUTES.projects;
  if (value.startsWith('/\\')) return ROUTES.projects;

  return value;
}

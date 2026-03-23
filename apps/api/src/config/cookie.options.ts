import type { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { COOKIE } from '@repo/types';

export type CookieConfig = {
  access: { name: typeof COOKIE.AUTHENTICATION; options: CookieOptions };
  refresh: { name: typeof COOKIE.REFRESH; options: CookieOptions };
};

export function getCookieConfig(config: ConfigService): CookieConfig {
  const nodeEnv = config.getOrThrow<string>('NODE_ENV');
  const isProd = nodeEnv === 'production';

  const cookieDomain = config.get<string>('COOKIE_DOMAIN')?.trim();
  const domainOption = isProd && cookieDomain ? { domain: cookieDomain } : {};

  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    ...domainOption,
  };

  return {
    access: { name: COOKIE.AUTHENTICATION, options: baseOptions },
    refresh: {
      name: COOKIE.REFRESH,
      options: { ...baseOptions, path: '/api/auth/refresh' },
    },
  };
}

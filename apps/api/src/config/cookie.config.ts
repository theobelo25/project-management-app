import { CookieOptions } from 'express';
import { COOKIE } from '../domain/auth/cookies/cookies.constants';
import { registerAs } from '@nestjs/config';

export const cookieConfig = registerAs('cookie', () => {
  const isProd = process.env.NODE_ENV === 'production';

  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  };

  return {
    access: {
      name: COOKIE.AUTHENTICATION,
      options: baseOptions,
    },
    refresh: {
      name: COOKIE.REFRESH,
      options: {
        ...baseOptions,
        path: '/auth/refresh',
      } satisfies CookieOptions,
    },
  } as const;
});

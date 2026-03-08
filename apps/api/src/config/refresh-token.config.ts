import { registerAs } from '@nestjs/config';

export const refreshTokenConfig = registerAs('refreshToken', () => {
  const ttlMs = Number(process.env.REFRESH_TOKEN_EXPIRATION_MS);
  const prefixSecret = process.env.REFRESH_PREFIX_SECRET;

  if (!prefixSecret || typeof prefixSecret !== 'string')
    throw new Error('REFRESH_PREFIX_SECRET must be set');

  if (prefixSecret.length < 32)
    throw new Error(
      `REFRESH_PREFIX_SECRET must be at least 32 characters (got ${prefixSecret.length})`,
    );

  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new Error(
      `Invalid REFRESH_TOKEN_EXPIRATION_MS: ${String(process.env.REFRESH_TOKEN_EXPIRATION_MS)}`,
    );
  }

  if (!prefixSecret) {
    throw new Error('REFRESH_PREFIX_SECRET is not set');
  }

  const config = {
    ttlMs,
    ttlSeconds: Math.floor(ttlMs / 1000),
    prefixSecret,
  } as const;

  return config;
});

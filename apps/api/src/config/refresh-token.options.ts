import { ConfigService } from '@nestjs/config';

export type RefreshTokenOptions = {
  ttlMs: number;
  ttlSeconds: number;
};

export function getRefreshTokenOptions(
  config: ConfigService,
): RefreshTokenOptions {
  const ttlMs = config.getOrThrow<number>('REFRESH_TOKEN_EXPIRATION_MS');

  return {
    ttlMs,
    ttlSeconds: Math.floor(ttlMs / 1000),
  };
}

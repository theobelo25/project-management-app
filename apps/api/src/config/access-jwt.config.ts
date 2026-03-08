import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const accessJwtConfig = registerAs('accessJwt', () => {
  const ttlMs = Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS);
  const secret = process.env.JWT_SECRET;
  const issuer = process.env.JWT_ISSUER;
  const audience = process.env.JWT_AUDIENCE;

  if (!Number.isFinite(ttlMs) || ttlMs <= 0)
    throw new Error(
      `Invalid JWT_ACCESS_TOKEN_EXPIRATION_MS: ${String(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS)}`,
    );

  if (!secret?.length) throw new Error('JWT_SECRET must be set');
  if (!issuer?.length) throw new Error('JWT_ISSUER must be set');
  if (!audience?.length) throw new Error('JWT_AUDIENCE must be set');

  const config = {
    ttlMs,
    jwt: {
      secret,
      signOptions: {
        expiresIn: Math.floor(ttlMs / 1000),
        issuer,
        audience,
      },
    } satisfies JwtModuleOptions,
  } as const;

  return config;
});

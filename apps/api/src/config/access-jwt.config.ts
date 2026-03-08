import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const accessJwtConfig = registerAs('accessJwt', () => {
  const ttlMs = Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS);

  const config = {
    ttlMs,
    jwt: {
      secret: process.env.JWT_SECRET!,
      signOptions: {
        expiresIn: Math.floor(ttlMs / 1000),
        issuer: process.env.JWT_ISSUER!,
        audience: process.env.JWT_AUDIENCE!,
      },
    } satisfies JwtModuleOptions,
  } as const;

  return config;
});

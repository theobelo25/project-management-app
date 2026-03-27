import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export type AccessJwtOptions = {
  ttlMs: number;
  secret: string;
  issuer: string;
  audience: string;
  jwtModuleOptions: JwtModuleOptions;
  jwtSignOptions: JwtSignOptions;
};

export function getAccessJwtOptions(config: ConfigService): AccessJwtOptions {
  const ttlMs = config.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRATION_MS');
  const secret = config.getOrThrow<string>('JWT_SECRET');
  const issuer = config.getOrThrow<string>('JWT_ISSUER');
  const audience = config.getOrThrow<string>('JWT_AUDIENCE');

  const expiresInSeconds = Math.floor(ttlMs / 1000);

  return {
    ttlMs,
    secret,
    issuer,
    audience,
    jwtModuleOptions: {
      secret,
      signOptions: { expiresIn: expiresInSeconds, issuer, audience },
    },
    jwtSignOptions: { secret, expiresIn: expiresInSeconds, issuer, audience },
  };
}

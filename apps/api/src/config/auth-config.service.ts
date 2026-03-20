import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAccessJwtOptions } from './access-jwt.options';
import { getRefreshTokenOptions } from './refresh-token.options';
import { getCookieConfig } from './cookie.options';

@Injectable()
export class AuthConfigService {
  constructor(private readonly config: ConfigService) {}

  get access() {
    const access = getAccessJwtOptions(this.config);
    return {
      ttlMs: access.ttlMs,
      secret: access.secret,
      issuer: access.issuer,
      audience: access.audience,
      jwt: access.jwtModuleOptions,
      jwtSign: access.jwtSignOptions,
    };
  }

  get refresh() {
    return getRefreshTokenOptions(this.config);
  }

  get cookies() {
    return getCookieConfig(this.config);
  }
}

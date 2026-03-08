import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { accessJwtConfig } from './access-jwt.config';
import { refreshTokenConfig } from './refresh-token.config';
import { cookieConfig } from './cookie.config';

@Injectable()
export class AuthConfigService {
  readonly access: {
    jwt: ConfigType<typeof accessJwtConfig>['jwt'];
    ttlMs: ConfigType<typeof accessJwtConfig>['ttlMs'];
    jwtSign: ConfigType<typeof accessJwtConfig>['jwtSign'];
  };

  readonly refresh: {
    ttlMs: ConfigType<typeof refreshTokenConfig>['ttlMs'];
    ttlSeconds: ConfigType<typeof refreshTokenConfig>['ttlSeconds'];
    prefixSecret: ConfigType<typeof refreshTokenConfig>['prefixSecret'];
  };

  readonly cookies: ConfigType<typeof cookieConfig>;

  constructor(
    @Inject(accessJwtConfig.KEY)
    accessCfg: ConfigType<typeof accessJwtConfig>,
    @Inject(refreshTokenConfig.KEY)
    refreshCfg: ConfigType<typeof refreshTokenConfig>,
    @Inject(cookieConfig.KEY)
    cookieCfg: ConfigType<typeof cookieConfig>,
  ) {
    this.access = {
      jwt: accessCfg.jwt,
      ttlMs: accessCfg.ttlMs,
      jwtSign: accessCfg.jwtSign,
    };

    this.refresh = {
      ttlMs: refreshCfg.ttlMs,
      ttlSeconds: refreshCfg.ttlSeconds,
      prefixSecret: refreshCfg.prefixSecret,
    };

    this.cookies = cookieCfg;
  }
}

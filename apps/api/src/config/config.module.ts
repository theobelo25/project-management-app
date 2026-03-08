import { Module } from '@nestjs/common';
import { ConfigModule, ConfigObject } from '@nestjs/config';
import { appConfig } from './app.config';
import { corsConfig } from './cors.config';
import { accessJwtConfig } from './access-jwt.config';
import { cookieConfig } from './cookie.config';
import { refreshTokenConfig } from './refresh-token.config';
import { AuthConfigService } from './auth-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(corsConfig),
    ConfigModule.forFeature(accessJwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    ConfigModule.forFeature(cookieConfig),
  ],
  providers: [AuthConfigService],
  exports: [ConfigModule, AuthConfigService],
})
export class AppConfigModule {}

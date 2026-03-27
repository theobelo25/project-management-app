import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AppConfigModule, getAccessJwtOptions } from '@api/config';
import { LoggerModule } from '../../logger/logger.module';

import { CookiesService } from './cookies/cookies.service';
import { AccessTokensService } from './accessTokens/access-tokens.service';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getAccessJwtOptions(configService).jwtModuleOptions;
      },
    }),
  ],
  providers: [CookiesService, AccessTokensService],
  exports: [CookiesService, AccessTokensService],
})
export class AuthTokensModule {}

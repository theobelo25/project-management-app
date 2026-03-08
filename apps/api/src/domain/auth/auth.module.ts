import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { HASHING_SERVICE } from './hashing/hashing.service.interface';
import { Argon2Service } from './hashing/argon2.service';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';

import { AccessTokensService } from './accessTokens/access-tokens.service';
import { RefreshTokensService } from './refreshTokens/refresh-tokens.service';
import { CookiesService } from './cookies/cookies.service';

import { AuthRepository } from './repositories/auth.repository';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';

import { accessJwtConfig } from '../../config/access-jwt.config';
import { refreshTokenConfig } from '../../config/refresh-token.config';
import { cookieConfig } from '../../config/cookie.config';
import { AuthConfigService } from '../../config/auth-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(accessJwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    ConfigModule.forFeature(cookieConfig),

    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      inject: [accessJwtConfig.KEY],
      useFactory: (cfg: ConfigType<typeof accessJwtConfig>) => cfg.jwt,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthConfigService,

    { provide: HASHING_SERVICE, useClass: Argon2Service },
    { provide: AuthRepository, useClass: PrismaAuthRepository },

    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,

    AccessTokensService,
    RefreshTokensService,
    CookiesService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

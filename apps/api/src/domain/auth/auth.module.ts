import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { HASHING_SERVICE } from './hashing/hashing.service.interface';
import { Argon2Service } from './hashing/argon2.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';

import { AccessTokensService } from './accessTokens/access-tokens.service';
import { RefreshTokensService } from './refreshTokens/refresh-tokens.service';
import { CookiesService } from './cookies/cookies.service';

import { PrismaAuthRepository } from './repositories/prisma-auth.repository';

import { AppConfigModule, accessJwtConfig } from '@api/config';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg =
          configService.get<ConfigType<typeof accessJwtConfig>>('accessJwt');
        if (!cfg?.jwt) throw new Error('accessJwt config not loaded');
        return cfg.jwt;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,

    { provide: HASHING_SERVICE, useClass: Argon2Service },
    { provide: AuthRepository, useClass: PrismaAuthRepository },

    JwtStrategy,
    RefreshTokenStrategy,

    AccessTokensService,
    RefreshTokensService,
    CookiesService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

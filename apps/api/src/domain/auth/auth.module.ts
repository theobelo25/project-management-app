import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

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

import { AppConfigModule, getAccessJwtOptions } from '@api/config';
import { AuthRepository } from './repositories/auth.repository';
import { PrismaModule } from '@api/prisma';

import { OrganizationWorkspaceBootstrapModule } from '../organizations/organization-workspace-bootstrap.module';

import { RefreshTokenRepositoryFacade } from './repositories/refresh-token.repository';
import { AuthCookiesInterceptor } from './interceptors/auth-cookies.interceptor';
import { AuthorizedUserForOrgService } from './authorized-user-for-org.service';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    PassportModule,
    PrismaModule,

    OrganizationWorkspaceBootstrapModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getAccessJwtOptions(configService).jwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,

    { provide: HASHING_SERVICE, useClass: Argon2Service },
    { provide: AuthRepository, useClass: PrismaAuthRepository },

    RefreshTokenRepositoryFacade,
    AuthCookiesInterceptor,
    AuthorizedUserForOrgService,

    JwtStrategy,
    RefreshTokenStrategy,

    AccessTokensService,
    RefreshTokensService,
    CookiesService,
  ],
  exports: [AuthService, AccessTokensService, CookiesService],
})
export class AuthModule {}

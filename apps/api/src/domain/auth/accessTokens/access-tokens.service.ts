import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserView } from '@repo/types';
import { TokenPayload } from '../types/token-payload.interface';
import { AuthConfigService } from '@api/config';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AccessTokensService {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AccessTokensService.name);
  }

  private mapTokenPayload(user: UserView) {
    const tokenPayload: TokenPayload = {
      sub: user.id,
      orgId: user.orgId,
    };

    return tokenPayload;
  }

  private getAccessExpiresAt(): Date {
    return new Date(Date.now() + this.authConfig.access.ttlMs);
  }

  sign(user: UserView) {
    const accessToken = this.jwtService.sign(
      this.mapTokenPayload(user),
      this.authConfig.access.jwtSign,
    );

    this.logger.debug({ userId: user.id }, 'Access token issued');

    return {
      accessToken,
      accessTokenExpiresAt: this.getAccessExpiresAt(),
    };
  }
}

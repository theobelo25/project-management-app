import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserView } from '@repo/types';
import { TokenPayload } from '../types/token-payload.interface';
import { AuthConfigService } from '@api/config';

@Injectable()
export class AccessTokensService {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private mapTokenPayload(user: UserView) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
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

    return {
      accessToken,
      accessTokenExpiresAt: this.getAccessExpiresAt(),
    };
  }
}

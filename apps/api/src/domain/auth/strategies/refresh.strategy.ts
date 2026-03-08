import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthConfigService } from '@api/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfig: AuthConfigService,
  ) {
    super();
  }

  async validate(request: Request): Promise<{ rawRefreshToken: string }> {
    const cookieName = this.authConfig.cookies.refresh.name;
    const rawRefreshToken = request.cookies?.[cookieName];

    if (!rawRefreshToken)
      throw new UnauthorizedException('Refresh token missing');

    await this.authService.authenticateRefreshToken(rawRefreshToken);

    return {
      rawRefreshToken,
    };
  }
}

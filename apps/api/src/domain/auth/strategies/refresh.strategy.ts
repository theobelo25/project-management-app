import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthConfigService } from '@api/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private readonly authConfig: AuthConfigService) {
    super();
  }

  validate(request: Request): { rawRefreshToken: string } {
    const cookieName = this.authConfig.cookies.refresh.name;
    const jar = request.cookies as Record<string, string> | undefined;
    const rawRefreshToken = jar?.[cookieName];

    if (!rawRefreshToken)
      throw new UnauthorizedException('Refresh token missing');

    return {
      rawRefreshToken,
    };
  }
}

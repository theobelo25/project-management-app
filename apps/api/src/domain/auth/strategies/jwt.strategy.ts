import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.interface';
import { Injectable } from '@nestjs/common';
import { AuthConfigService } from '@api/config';
import { UserView } from '@repo/types';
import { AuthorizedUserForOrgService } from '../authorized-user-for-org.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly authorizedUserForOrg: AuthorizedUserForOrgService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.[authConfig.cookies.access.name],
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig.access.secret,
      issuer: authConfig.access.issuer,
      audience: authConfig.access.audience,
    });
  }

  async validate(payload: TokenPayload): Promise<UserView> {
    return this.authorizedUserForOrg.fromTokenPayload(payload);
  }
}

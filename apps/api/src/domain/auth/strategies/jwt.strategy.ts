import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.interface';
import { UsersService } from '@api/domain/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserView } from '@repo/types';
import { AuthConfigService } from '@api/config/auth-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly usersService: UsersService,
  ) {
    const options = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.[authConfig.cookies.access.name],
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig.access.jwt.secret,
      issuer: authConfig.access.jwt.signOptions.issuer,
      audience: authConfig.access.jwt.signOptions.audience,
    };

    super(options);
  }

  async validate(payload: TokenPayload): Promise<UserView> {
    const user = await this.usersService.findById(payload.userId);
    if (!user) throw new UnauthorizedException('Unauthorized');
    return user;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.interface';
import { UsersService } from '@api/domain/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserView } from '@repo/types';
import { AuthConfigService } from '@api/config';
import { PrismaClient } from '@repo/database';
import { PRISMA } from '@api/prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly usersService: UsersService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
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
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Unauthorized');

    // Ensure token org is still a membership and fetch org name for display
    const membership = await this.prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: payload.orgId,
        },
      },
      include: { organization: { select: { name: true } } },
    });

    if (!membership) throw new UnauthorizedException('Unauthorized');

    return {
      ...user,
      orgId: payload.orgId,
      organizationName: membership.organization.name,
    };
  }
}

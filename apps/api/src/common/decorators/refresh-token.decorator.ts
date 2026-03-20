import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

type RefreshRequestUser = { rawRefreshToken: string };

export const CurrentRefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: RefreshRequestUser }>();

    const token = request.user?.rawRefreshToken;

    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return token;
  },
);

import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { COOKIE } from '@repo/types';

export const CurrentRefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[COOKIE.REFRESH];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Refresh token missing');
    }

    return token;
  },
);

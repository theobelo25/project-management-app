import { COOKIE } from '@api/domain/auth/cookies/cookies.constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentRefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[COOKIE.REFRESH];
    return typeof token === 'string' ? token : undefined;
  },
);

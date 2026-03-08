import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { COOKIE } from '@repo/types';

export const CurrentRefreshToken = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[COOKIE.REFRESH];
    return typeof token === 'string' ? token : undefined;
  },
);

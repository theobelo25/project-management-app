import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

type RefreshAuthUser = { rawRefreshToken: string };

export const CurrentRefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<{ user?: RefreshAuthUser }>();

    const token = user?.rawRefreshToken;
    if (typeof token !== 'string' || token.length === 0) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return token;
  },
);

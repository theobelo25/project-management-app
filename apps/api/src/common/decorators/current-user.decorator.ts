import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (authUser && typeof authUser === 'object' && 'user' in authUser) {
      return authUser.user;
    }

    return authUser;
  },
);

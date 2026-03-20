import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { ProjectWithRole } from '../types/projects.repository.types';

export const CURRENT_PROJECT_KEY = Symbol('CURRENT_PROJECT');

type RequestWithCurrentProject = Request & {
  [CURRENT_PROJECT_KEY]?: ProjectWithRole;
};

export const CurrentProject = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ProjectWithRole | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithCurrentProject>();
    return request[CURRENT_PROJECT_KEY];
  },
);

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ProjectRole } from '@repo/database';
import { REQUIRE_PROJECT_ROLE_KEY } from '../decorators/require-project-role.decorator';
import { ProjectAccessService } from '../policies/project-access.service';
import { getSingleParam } from '@api/common/utils/http.utils';
import { AuthUser } from '@repo/types';

type RequestWithUser = Request & {
  user: AuthUser;
};

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<ProjectRole>(
      REQUIRE_PROJECT_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const projectId = getSingleParam(request.params.id);

    if (!projectId || !user?.id || !user?.orgId) return false;

    await this.projectAccessService.requireRole(projectId, user, requiredRole);

    return true;
  }
}

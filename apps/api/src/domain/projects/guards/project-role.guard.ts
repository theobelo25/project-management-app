import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ProjectRole } from '@repo/database';
import { REQUIRE_PROJECT_ROLE_KEY } from '../decorators/require-project-role.decorator';
import { ProjectAccessService } from '../policies/project-access.service';
import { getSingleParam } from '@api/common/utils/http.utils';
import { AuthUser } from '@repo/types';
import { CURRENT_PROJECT_KEY } from '../decorators/current-project.decorator';
import { ProjectWithRole } from '../types/projects.repository.types';

type RequestWithUserAndParams = Request & {
  user: AuthUser;
  params: Record<string, string | string[] | undefined>;
  [CURRENT_PROJECT_KEY]?: ProjectWithRole;
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

    const request = context
      .switchToHttp()
      .getRequest<RequestWithUserAndParams>();

    const projectId = getSingleParam(request.params.id);
    const user = request.user;

    if (!projectId || !user?.id || !user?.orgId) return false;

    const project = await this.projectAccessService.requireRole(
      projectId,
      user,
      requiredRole,
    );

    request[CURRENT_PROJECT_KEY] = project;

    return true;
  }
}

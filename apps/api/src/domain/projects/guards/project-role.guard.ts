import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ProjectRole } from '@repo/database';
import { REQUIRE_PROJECT_ROLE_KEY } from '../decorators/require-project-role.decorator';
import { ProjectAccessService } from '../access/project-access.service';
import { getSingleParam } from '@api/common/utils/http.utils';

type RequestUser = {
  userId: string;
  email: string;
};

type RequestWithUser = Request & {
  user: RequestUser;
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
    const userId = request.user?.userId;
    const projectId = getSingleParam(request.params.id);

    if (!projectId || !userId) {
      return false;
    }

    await this.projectAccessService.requireRole(
      projectId,
      userId,
      requiredRole,
    );

    return true;
  }
}

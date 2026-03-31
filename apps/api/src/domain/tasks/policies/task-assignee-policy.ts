import { Injectable } from '@nestjs/common';
import { AuthUser } from '@repo/types';
import { UsersRepository } from '../../users/repositories/users.repository';
import { taskForbidden, taskNotFound } from '../errors/task-errors';
import {
  PROJECT_MEMBER_REPOSITORY,
  type ProjectMemberRepository,
} from '@api/domain/projects/repositories/projects.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class TaskAssigneePolicy {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projects: ProjectMemberRepository,
  ) {}

  async assertAssigneeInSameOrgOrThrow(
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    const assignee = await this.usersRepository.findById(assigneeUserId);

    if (!assignee) {
      throw taskNotFound('USER_NOT_FOUND', { assigneeUserId });
    }

    if (assignee.orgId !== currentUser.orgId) {
      throw taskForbidden('ASSIGN_USER_FORBIDDEN_OTHER_ORG', {
        assigneeUserId,
        assigneeOrgId: assignee.orgId,
        currentOrgId: currentUser.orgId,
      });
    }
  }

  async assertAssigneeCanBeAssignedToProjectOrThrow(
    assigneeUserId: string,
    projectId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    await this.assertAssigneeInSameOrgOrThrow(assigneeUserId, currentUser);

    const membership = await this.projects.findMembership(projectId, assigneeUserId);
    if (!membership) {
      throw taskForbidden('ASSIGN_USER_FORBIDDEN_NOT_PROJECT_MEMBER', {
        assigneeUserId,
        projectId,
      });
    }
  }
}

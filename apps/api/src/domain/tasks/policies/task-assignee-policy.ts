import { Injectable } from '@nestjs/common';
import { AuthUser } from '@repo/types';
import { UsersRepository } from '../../users/repositories/users.repository';
import { taskForbidden, taskNotFound } from '../errors/task-errors';

@Injectable()
export class TaskAssigneePolicy {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}

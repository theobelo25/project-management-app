import { Injectable } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { TaskAccessContext } from '../types/tasks.repository.types';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser } from '@repo/types';
import { TaskAccessRules } from './task-access.rules';
import { taskForbidden, taskNotFound } from '../errors/task-errors';
import { TaskAccessContextLoader } from './task-access-context.loader';

@Injectable()
export class TaskAccessService {
  constructor(
    private readonly contextLoader: TaskAccessContextLoader,
    private readonly logger: PinoLogger,
    private readonly rules: TaskAccessRules,
  ) {}

  async assertCanCreateInProject(
    user: AuthUser,
    projectId: string,
  ): Promise<void> {
    const project = await this.contextLoader.findProjectWithMemberRole(
      projectId,
      user.id,
      user.orgId,
    );

    if (!project) {
      this.logger.warn(
        {
          event: 'task.access.create_project.not_found',
          projectId,
          userId: user.id,
        },
        'Project not found during task create access check',
      );
      throw taskNotFound('PROJECT_NOT_FOUND', { projectId, userId: user.id });
    }

    const role =
      project.ownerId === user.id ? ProjectRole.OWNER : project.currentUserRole;

    if (!this.rules.canReadProject(role)) {
      this.logger.warn(
        {
          event: 'task.access.create_project.forbidden',
          projectId,
          userId: user.id,
        },
        'Task create access denied: user has no project access',
      );
      throw taskForbidden('CREATE_PROJECT_FORBIDDEN_NO_ACCESS', {
        projectId,
        userId: user.id,
      });
    }

    if (!this.rules.canCreateProject(role)) {
      this.logger.warn(
        {
          event: 'task.access.create_project.forbidden',
          projectId,
          userId: user.id,
        },
        'Task create access denied: user has no project access',
      );
      throw taskForbidden('CREATE_PROJECT_FORBIDDEN_NO_PERMISSION', {
        projectId,
        userId: user.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.create_project.allowed',
        projectId,
        userId: user.id,
        role,
      },
      'Task create access granted',
    );
  }

  async assertCanReadProject(user: AuthUser, projectId: string): Promise<void> {
    const project = await this.contextLoader.findProjectWithMemberRole(
      projectId,
      user.id,
      user.orgId,
    );

    if (!project) {
      this.logger.warn(
        {
          event: 'task.access.read_project.not_found',
          projectId,
          userId: user.id,
        },
        'Project not found during task project read access check',
      );
      throw taskNotFound('PROJECT_NOT_FOUND', { projectId, userId: user.id });
    }

    const role =
      project.ownerId === user.id ? ProjectRole.OWNER : project.currentUserRole;

    this.logger.debug(
      {
        event: 'task.access.read_project.allowed',
        projectId,
        userId: user.id,
        role,
      },
      'Task project read access granted',
    );
  }

  async getAccessibleTaskOrThrow(
    taskId: string,
    user: AuthUser,
  ): Promise<TaskAccessContext> {
    const task = await this.contextLoader.findTaskAccessContext(
      taskId,
      user.id,
    );

    if (!task) {
      this.logger.warn(
        {
          event: 'task.access.read.not_found',
          taskId,
          userId: user.id,
        },
        'Task not found during access check',
      );
      throw taskNotFound('TASK_NOT_FOUND', { taskId, userId: user.id });
    }

    const isOrgMember = task.project.orgId === user.orgId;
    const canRead = this.rules.canReadTask(task, user.id);

    if (!isOrgMember || !canRead) {
      this.logger.warn(
        {
          event: 'task.access.read.forbidden',
          taskId,
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          ownerId: task.project.ownerId,
        },
        'Task read access denied',
      );
      throw taskForbidden('READ_TASK_FORBIDDEN', {
        taskId,
        projectId: task.projectId,
        userId: user.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.read.allowed',
        taskId,
        userId: user.id,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task read access granted',
    );

    return task;
  }

  async assertCanRead(taskId: string, user: AuthUser): Promise<void> {
    await this.getAccessibleTaskOrThrow(taskId, user);
  }

  async assertCanUpdate(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);

    if (!this.rules.canUpdateTask(task, user.id)) {
      this.logger.warn(
        {
          event: 'task.access.update.forbidden',
          taskId,
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task update access denied',
      );
      throw taskForbidden('UPDATE_TASK_FORBIDDEN', {
        taskId,
        projectId: task.projectId,
        userId: user.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.update.allowed',
        taskId,
        userId: user.id,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task update access granted',
    );
  }

  async assertCanDelete(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);

    if (!this.rules.canDeleteTask(task, user.id)) {
      this.logger.warn(
        {
          event: 'task.access.delete.forbidden',
          taskId,
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task delete access denied',
      );
      throw taskForbidden('DELETE_TASK_FORBIDDEN', {
        taskId,
        projectId: task.projectId,
        userId: user.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.delete.allowed',
        taskId,
        userId: user.id,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task delete access granted',
    );
  }

  async assertCanAssign(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);

    if (!this.rules.canManageTask(task, user.id)) {
      this.logger.warn(
        {
          event: 'task.access.assign.forbidden',
          taskId,
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access denied',
      );
      throw taskForbidden('ASSIGN_TASK_FORBIDDEN', {
        taskId,
        projectId: task.projectId,
        userId: user.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.assign.allowed',
        taskId,
        userId: user.id,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task assignment access granted',
    );
  }

  async assertCanUnassign(
    taskId: string,
    currentUser: AuthUser,
    assigneeUserId: string,
  ): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, currentUser);

    const isUnassigningSelf = assigneeUserId === currentUser.id;

    if (isUnassigningSelf) {
      if (!this.rules.canUnassignOwnTask(task, currentUser.id)) {
        this.logger.warn(
          {
            event: 'task.access.unassign.self.forbidden',
            taskId,
            userId: currentUser.id,
            projectId: task.projectId,
          },
          'Task self-unassign denied: user is not assigned',
        );
        throw taskForbidden('UNASSIGN_TASK_FORBIDDEN', {
          taskId,
          projectId: task.projectId,
          userId: currentUser.id,
        });
      }

      this.logger.debug(
        {
          event: 'task.access.unassign.self.allowed',
          taskId,
          userId: currentUser.id,
          projectId: task.projectId,
        },
        'Task self-unassign allowed',
      );
      return;
    }

    if (!this.rules.canManageTask(task, currentUser.id)) {
      this.logger.warn(
        {
          event: 'task.access.unassign.forbidden',
          taskId,
          userId: currentUser.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          targetAssigneeUserId: assigneeUserId,
        },
        'Task unassign denied',
      );
      throw taskForbidden('UNASSIGN_TASK_FORBIDDEN', {
        taskId,
        projectId: task.projectId,
        userId: currentUser.id,
      });
    }

    this.logger.debug(
      {
        event: 'task.access.unassign.allowed',
        taskId,
        userId: currentUser.id,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
        targetAssigneeUserId: assigneeUserId,
      },
      'Task unassign allowed',
    );
  }
}

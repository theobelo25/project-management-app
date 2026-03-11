import { ProjectsRepository } from '@api/domain/projects/repositories/projects.repository';
import { TasksRepository } from '../repositories/tasks.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { TaskAccessContext } from '../types/tasks.repository.types';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TaskAccessService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly logger: PinoLogger,
  ) {}

  async assertCanCreateInProject(
    userId: string,
    projectId: string,
  ): Promise<void> {
    const project = await this.projectsRepository.findByIdWithMemberRole(
      projectId,
      userId,
    );

    if (!project) {
      this.logger.warn(
        {
          event: 'task.access.create_project.not_found',
          projectId,
          userId,
        },
        'Project not found during task create access check',
      );

      throw new NotFoundException('Project not found');
    }

    const role =
      project.ownerId === userId ? ProjectRole.OWNER : project.currentUserRole;

    if (!role) {
      this.logger.warn(
        {
          event: 'task.access.create_project.forbidden',
          projectId,
          userId,
        },
        'Task create access denied: user has no project access',
      );

      throw new ForbiddenException('You do not have access to the project');
    }

    if (
      ![ProjectRole.OWNER, ProjectRole.ADMIN, ProjectRole.MEMBER].includes(role)
    ) {
      this.logger.warn(
        {
          event: 'task.access.create_project.forbidden',
          projectId,
          userId,
          role,
        },
        'Task create access denied: insufficient project role',
      );

      throw new ForbiddenException(
        'You do not have permission to create tasks in this project',
      );
    }

    this.logger.debug(
      {
        event: 'task.access.create_project.allowed',
        projectId,
        userId,
        role,
      },
      'Task create access granted',
    );
  }

  async assertCanReadProject(userId: string, projectId: string): Promise<void> {
    const project = await this.projectsRepository.findByIdWithMemberRole(
      projectId,
      userId,
    );

    if (!project) {
      this.logger.warn(
        {
          event: 'task.access.read_project.not_found',
          projectId,
          userId,
        },
        'Project not found during task project read access check',
      );

      throw new NotFoundException('Project not found');
    }

    if (!project.currentUserRole) {
      this.logger.warn(
        {
          event: 'task.access.read_project.forbidden',
          projectId,
          userId,
        },
        'Task project read access denied',
      );

      throw new ForbiddenException('You do not have access to this project');
    }

    this.logger.debug(
      {
        event: 'task.access.read_project.allowed',
        projectId,
        userId,
        role: project.currentUserRole,
      },
      'Task project read access granted',
    );
  }

  async getAccessibleTaskOrThrow(
    taskId: string,
    userId: string,
  ): Promise<TaskAccessContext> {
    const task = await this.tasksRepository.findByIdWithAccessContext(
      taskId,
      userId,
    );

    if (!task) {
      this.logger.warn(
        {
          event: 'task.access.read.not_found',
          taskId,
          userId,
        },
        'Task not found during access check',
      );

      throw new NotFoundException('Task not found');
    }

    const canRead = this.canReadTask(task, userId);

    if (!canRead) {
      this.logger.warn(
        {
          event: 'task.access.read.forbidden',
          taskId,
          userId,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          ownerId: task.project.ownerId,
        },
        'Task read access denied',
      );

      throw new ForbiddenException('You do not have access to this task');
    }

    this.logger.debug(
      {
        event: 'task.access.read.allowed',
        taskId,
        userId,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task read access granted',
    );

    return task;
  }

  async assertCanRead(taskId: string, userId: string): Promise<void> {
    await this.getAccessibleTaskOrThrow(taskId, userId);
  }

  async assertCanUpdate(taskId: string, userId: string): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, userId);

    const canUpdate = this.canUpdateTask(task, userId);

    if (!canUpdate) {
      this.logger.warn(
        {
          event: 'task.access.update.forbidden',
          taskId,
          userId,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task update access denied',
      );

      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    this.logger.debug(
      {
        event: 'task.access.update.allowed',
        taskId,
        userId,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task update access granted',
    );
  }

  async assertCanDelete(taskId: string, userId: string): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, userId);

    const canDelete = this.canDeleteTask(task, userId);

    if (!canDelete) {
      this.logger.warn(
        {
          event: 'task.access.delete.forbidden',
          taskId,
          userId,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task delete access denied',
      );

      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    this.logger.debug(
      {
        event: 'task.access.delete.allowed',
        taskId,
        userId,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task delete access granted',
    );
  }

  async assertCanAssign(taskId: string, userId: string): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, userId);

    const canAssign = this.canManageTask(task, userId);

    if (!canAssign) {
      this.logger.warn(
        {
          event: 'task.access.assign.forbidden',
          taskId,
          userId,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access denied',
      );

      throw new ForbiddenException(
        'You do not have permission to assign this task',
      );
    }

    this.logger.debug(
      {
        event: 'task.access.assign.allowed',
        taskId,
        userId,
        projectId: task.projectId,
        currentUserRole: task.project.currentUserRole,
      },
      'Task assignment access granted',
    );
  }

  private canReadTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;
    return !!task.project.currentUserRole;
  }

  private canUpdateTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;

    if (task.project.currentUserRole === ProjectRole.ADMIN) return true;

    if (task.assignees.some((assignee) => assignee.userId === userId))
      return true;

    return false;
  }

  private canDeleteTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;

    if (task.project.currentUserRole === ProjectRole.ADMIN) return true;

    if (task.createdById === userId) return true;

    return false;
  }

  private canManageTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;

    return task.project.currentUserRole === ProjectRole.ADMIN;
  }
}

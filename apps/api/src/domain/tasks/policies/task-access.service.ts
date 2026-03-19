import {
  PROJECT_TASK_CONTEXT_REPOSITORY,
  type ProjectTaskContextRepository,
} from '@api/domain/projects/repositories/projects.repository';
import { TasksRepository } from '../repositories/tasks.repository';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { TaskAccessContext } from '../types/tasks.repository.types';
import { PinoLogger } from 'nestjs-pino';
import { AuthUser } from '@repo/types';

@Injectable()
export class TaskAccessService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    @Inject(PROJECT_TASK_CONTEXT_REPOSITORY)
    private readonly projectContext: ProjectTaskContextRepository,
    private readonly logger: PinoLogger,
  ) {}

  async assertCanCreateInProject(
    user: AuthUser,
    projectId: string,
  ): Promise<void> {
    const project = await this.projectContext.findByIdWithMemberRole(
      projectId,
      user.id,
      user.orgId,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const role =
      project.ownerId === user.id ? ProjectRole.OWNER : project.currentUserRole;

    if (!role) {
      throw new ForbiddenException('You do not have access to the project');
    }

    if (
      ![ProjectRole.OWNER, ProjectRole.ADMIN, ProjectRole.MEMBER].includes(role)
    ) {
      throw new ForbiddenException(
        'You do not have permission to create tasks in this project',
      );
    }
  }

  async assertCanReadProject(user: AuthUser, projectId: string): Promise<void> {
    const project = await this.projectContext.findByIdWithMemberRole(
      projectId,
      user.id,
      user.orgId,
    );

    if (!project) throw new NotFoundException('Project not found');

    if (!project.currentUserRole) {
      throw new ForbiddenException('You do not have access to this project');
    }
  }

  async getAccessibleTaskOrThrow(
    taskId: string,
    user: AuthUser,
  ): Promise<TaskAccessContext> {
    const task = await this.tasksRepository.findByIdWithAccessContext(
      taskId,
      user.id,
    );

    if (!task) throw new NotFoundException('Task not found');

    if (task.project.orgId !== user.orgId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    if (!this.canReadTask(task, user.id)) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async assertCanRead(taskId: string, user: AuthUser): Promise<void> {
    await this.getAccessibleTaskOrThrow(taskId, user);
  }

  async assertCanUpdate(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);
    if (!this.canUpdateTask(task, user.id)) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }
  }

  async assertCanDelete(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);
    if (!this.canDeleteTask(task, user.id)) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }
  }

  async assertCanAssign(taskId: string, user: AuthUser): Promise<void> {
    const task = await this.getAccessibleTaskOrThrow(taskId, user);
    if (!this.canManageTask(task, user.id)) {
      throw new ForbiddenException(
        'You do not have permission to assign this task',
      );
    }
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

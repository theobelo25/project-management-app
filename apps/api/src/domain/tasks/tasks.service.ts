import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  toCreateTaskInput,
  toTaskView,
  toTaskViews,
  toUpdateTaskInput,
} from './mappers/tasks.mapper';
import {
  AuthUser,
  TaskView,
  PaginationResult,
  TaskAssignmentView,
} from '@repo/types';
import { toTaskAssignmentView } from './mappers/task-assignment.mapper';
import { TaskAccessService } from './policies/task-access.service';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { UsersRepository } from '../users/repositories/users.repository';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskAccessService: TaskAccessService,
    private readonly tasksRepository: TasksRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly logger: PinoLogger,
  ) {}

  async create(user: AuthUser, dto: CreateTaskDto): Promise<TaskView> {
    await this.taskAccessService.assertCanCreateInProject(user, dto.projectId);

    const input = toCreateTaskInput(dto, user.id);
    const task = await this.tasksRepository.create(input);

    this.logger.info(
      {
        event: 'task.created',
        taskId: task.id,
        createdById: task.createdById,
        projectId: task.projectId,
      },
      'Task created successfully',
    );

    return toTaskView(task);
  }

  async update(
    taskId: string,
    user: AuthUser,
    dto: UpdateTaskDto,
  ): Promise<TaskView> {
    await this.taskAccessService.assertCanUpdate(taskId, user);

    const input = toUpdateTaskInput(dto);
    const task = await this.tasksRepository.update(taskId, input);

    this.logger.info(
      {
        event: 'task.updated',
        taskId: task.id,
        updatedById: user.id,
        projectId: task.projectId,
      },
      'Task updated successfully',
    );

    return toTaskView(task);
  }

  async findById(taskId: string, user: AuthUser): Promise<TaskView> {
    await this.taskAccessService.assertCanRead(taskId, user);
    const task = await this.tasksRepository.findByIdOrThrow(taskId);
    return toTaskView(task);
  }

  async findMany(
    user: AuthUser,
    query: FindTasksQueryDto,
  ): Promise<PaginationResult<TaskView>> {
    await this.taskAccessService.assertCanReadProject(user, query.projectId);

    const result = await this.tasksRepository.findMany({
      orgId: user.orgId,
      ...query,
    });

    return {
      ...result,
      data: toTaskViews(result.data),
    };
  }

  async delete(taskId: string, user: AuthUser): Promise<void> {
    await this.taskAccessService.assertCanDelete(taskId, user);

    await this.tasksRepository.delete(taskId);

    this.logger.info(
      {
        event: 'task.deleted',
        taskId,
        deletedById: user.id,
      },
      'Task deleted successfully',
    );
  }

  async assignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<TaskAssignmentView> {
    await this.taskAccessService.assertCanAssign(taskId, currentUser);

    const assignee = await this.usersRepository.findById(assigneeUserId);
    if (!assignee) throw new NotFoundException('User not found');

    if (assignee.orgId !== currentUser.orgId) {
      throw new ForbiddenException(
        'Cannot assign users from another organization',
      );
    }

    const assignment = await this.tasksRepository.assignUser(
      taskId,
      assigneeUserId,
    );

    // Create a notification for the assignee (skip self-assignment noise)
    if (assigneeUserId !== currentUser.id) {
      const task = await this.tasksRepository.findByIdOrThrow(taskId);
      await this.notificationsService.notifyTaskAssigned(assigneeUserId, {
        taskId,
        taskTitle: task.title,
        projectId: task.projectId,
        assignedById: currentUser.id,
      });
    }

    this.logger.info(
      {
        event: 'task.assignee.added',
        taskId,
        userId: assigneeUserId,
        updatedById: currentUser.id,
      },
      'Task assignee added successfully',
    );

    return toTaskAssignmentView(assignment);
  }

  async unassignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    await this.taskAccessService.assertCanAssign(taskId, currentUser);

    await this.tasksRepository.unassignUser(taskId, assigneeUserId);

    this.logger.info(
      {
        event: 'task.assignee.removed',
        taskId,
        userId: assigneeUserId,
        updatedById: currentUser.id,
      },
      'Task assignee removed successfully',
    );
  }
}

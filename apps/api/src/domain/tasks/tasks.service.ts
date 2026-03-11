import { Injectable } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import {
  CreateTaskInput,
  FindTasksInput,
  UpdateTaskInput,
} from './types/tasks.repository.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PinoLogger } from 'nestjs-pino';
import {
  toCreateTaskInput,
  toTaskView,
  toTaskViews,
  toUpdateTaskInput,
} from './mappers/tasks.mapper';
import { TaskView, PaginationResult, TaskAssignmentView } from '@repo/types';
import { toTaskAssignmentView } from './mappers/task-assignment.mapper';
import { TaskAccessService } from './policies/task-access.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskAccessService: TaskAccessService,
    private readonly tasksRepository: TasksRepository,
    private readonly logger: PinoLogger,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<TaskView> {
    await this.taskAccessService.assertCanCreateInProject(
      userId,
      dto.projectId,
    );

    const input = toCreateTaskInput(dto, userId);

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
    userId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskView> {
    await this.taskAccessService.assertCanUpdate(taskId, userId);

    const input = toUpdateTaskInput(dto);

    const task = await this.tasksRepository.update(taskId, input);

    this.logger.info(
      {
        event: 'task.updated',
        taskId: task.id,
        updatedById: userId,
        projectId: task.projectId,
      },
      'Task updated successfully',
    );

    return toTaskView(task);
  }

  async findById(taskId: string, userId: string): Promise<TaskView> {
    await this.taskAccessService.assertCanRead(taskId, userId);
    const task = await this.tasksRepository.findByIdOrThrow(taskId);
    return toTaskView(task);
  }

  async findMany(
    userId: string,
    input: FindTasksInput,
  ): Promise<PaginationResult<TaskView>> {
    await this.taskAccessService.assertCanReadProject(userId, input.projectId);

    const result = await this.tasksRepository.findMany(input);

    return {
      ...result,
      data: toTaskViews(result.data),
    };
  }

  async delete(taskId: string, userId: string): Promise<void> {
    await this.taskAccessService.assertCanDelete(taskId, userId);

    await this.tasksRepository.delete(taskId);

    this.logger.info(
      {
        event: 'task.deleted',
        taskId,
        deletedById: userId,
      },
      'Task deleted successfully',
    );
  }

  async assignUser(
    taskId: string,
    assigneeUserId: string,
    currentUserId: string,
  ): Promise<TaskAssignmentView> {
    await this.taskAccessService.assertCanAssign(taskId, currentUserId);

    const assignment = await this.tasksRepository.assignUser(
      taskId,
      assigneeUserId,
    );

    this.logger.info(
      {
        event: 'task.assignee.added',
        taskId,
        userId: assigneeUserId,
        updatedById: currentUserId,
      },
      'Task assignee added successfully',
    );

    return toTaskAssignmentView(assignment);
  }

  async unassignUser(
    taskId: string,
    assigneeUserId: string,
    currentUserId: string,
  ): Promise<void> {
    await this.taskAccessService.assertCanAssign(taskId, currentUserId);

    await this.tasksRepository.unassignUser(taskId, assigneeUserId);

    this.logger.info(
      {
        event: 'task.assignee.removed',
        taskId,
        userId: assigneeUserId,
        updatedById: currentUserId,
      },
      'Task assignee removed successfully',
    );
  }
}

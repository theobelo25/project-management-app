import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import {
  CreateTaskInput,
  FindTasksInput,
} from './types/tasks.repository.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { PinoLogger } from 'nestjs-pino';
import { toTaskView, toTaskViews } from './mappers/tasks.mapper';
import { TaskView, PaginationResult, TaskAssignmentView } from '@repo/types';
import { TaskAssignee } from '@repo/database';
import { toTaskAssignmentView } from './mappers/task-assignee.mapper';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly logger: PinoLogger,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<TaskView> {
    const input: CreateTaskInput = {
      ...dto,
      createdById: userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    };

    const task = await this.tasksRepository.create(input);

    this.logger.info(
      {
        event: 'task.created',
        createdById: task.createdById,
        projectId: task.projectId,
      },
      'Project created successfully',
    );

    return toTaskView(task);
  }

  async findById(taskId: string): Promise<TaskView> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Project not found');

    return toTaskView(task);
  }

  async findMany(input: FindTasksInput): Promise<PaginationResult<TaskView>> {
    const result = await this.tasksRepository.findMany(input);

    return {
      ...result,
      data: toTaskViews(result.data),
    };
  }

  async delete(taskId: string): Promise<void> {
    await this.tasksRepository.delete(taskId);
  }

  async assignUser(
    taskId: string,
    userId: string,
  ): Promise<TaskAssignmentView> {
    const assignment = await this.tasksRepository.assignUser(taskId, userId);
    return toTaskAssignmentView(assignment);
  }

  async unassignUser(taskId: string, userId: string): Promise<void> {
    await this.tasksRepository.unassignUser(taskId, userId);
  }
}

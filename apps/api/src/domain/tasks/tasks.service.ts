import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import {
  CreateTaskInput,
  FindTasksInput,
} from './types/tasks.repository.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { PinoLogger } from 'nestjs-pino';
import { toTaskView, toTaskViews } from './mappers/tasks.mapper';
import { PaginationResult } from '@api/common';
import { TaskView } from 'packages/types/dist';
import { TaskAssignee } from 'packages/database/dist/src';

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

  async assignUser(taskId: string, userId: string): Promise<TaskAssignee> {
    return this.tasksRepository.assignUser(taskId, userId);
  }

  async unassignUser(taskId: string, userId: string): Promise<void> {
    await this.tasksRepository.unassignUser(taskId, userId);
  }
}

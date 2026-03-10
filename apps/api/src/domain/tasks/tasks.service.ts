import { Injectable } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateTaskInput } from './types/tasks.repository.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { PinoLogger } from 'nestjs-pino';
import { toTaskView } from './mappers/tasks.mapper';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly logger: PinoLogger,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
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
}

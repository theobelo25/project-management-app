import { Injectable } from '@nestjs/common';
import { AuthUser, TaskView } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import { toTaskView } from '../mappers/tasks.mapper';
import { throwTaskNotFoundOnPrismaP2025 } from '../utils/task-prisma-error-mapper';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(taskId: string, user: AuthUser): Promise<TaskView> {
    let task;
    try {
      task = await this.tasksRepository.findByIdOrThrow(taskId);
    } catch (err) {
      throwTaskNotFoundOnPrismaP2025(err, { taskId, userId: user.id });
    }

    return toTaskView(task);
  }
}

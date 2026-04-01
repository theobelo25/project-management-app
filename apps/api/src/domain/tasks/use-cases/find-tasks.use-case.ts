import { Injectable } from '@nestjs/common';
import { AuthUser, PaginationResult, TaskView } from '@repo/types';
import { TasksRepository } from '../repositories/tasks.repository';
import type { FindTasksQueryCommand } from '../application/task-application.types';
import { toTaskViews } from '../mappers/tasks.mapper';

@Injectable()
export class FindTasksUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(
    user: AuthUser,
    query: FindTasksQueryCommand,
  ): Promise<PaginationResult<TaskView>> {
    const result = await this.tasksRepository.findMany({
      orgId: user.orgId,
      ...query,
    });

    return {
      ...result,
      data: toTaskViews(result.data),
    };
  }
}

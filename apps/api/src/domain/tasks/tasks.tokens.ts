import type { InjectionToken } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';

export const TASKS_REPOSITORY: InjectionToken<TasksRepository> =
  Symbol('TASKS_REPOSITORY');

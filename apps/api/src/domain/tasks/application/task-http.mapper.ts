import type { CreateTaskDto } from '../dto/create-task.dto';
import type { UpdateTaskDto } from '../dto/update-task.dto';
import type { FindTasksQueryDto } from '../dto/find-tasks-query.dto';
import type {
  CreateTaskCommand,
  FindTasksQueryCommand,
  UpdateTaskCommand,
} from './task-application.types';

export function toCreateTaskCommand(dto: CreateTaskDto): CreateTaskCommand {
  return { ...dto };
}

export function toUpdateTaskCommand(dto: UpdateTaskDto): UpdateTaskCommand {
  return { ...dto };
}

export function toFindTasksQueryCommand(
  dto: FindTasksQueryDto,
): FindTasksQueryCommand {
  return { ...dto };
}

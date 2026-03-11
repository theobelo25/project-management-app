import {
  toIsoString,
  toIsoStringOrNull,
} from '@api/common/mappers/mapper.utils';
import {
  TaskWithAssignees,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/tasks.repository.types';
import { TaskView } from '@repo/types';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export function toTaskView(task: TaskWithAssignees): TaskView {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: toIsoStringOrNull(task.dueDate),
    position: task.position,
    createdAt: toIsoString(task.createdAt),
    updatedAt: toIsoString(task.updatedAt),
    createdById: task.createdById,
    assignees: task.assignees.map((assignee) => ({
      userId: assignee.userId,
      assignedAt: toIsoString(assignee.assignedAt),
      user: {
        id: assignee.user.id,
        name: assignee.user.name,
        email: assignee.user.email,
      },
    })),
  };
}

export function toTaskViews(tasks: TaskWithAssignees[]): TaskView[] {
  return tasks.map(toTaskView);
}

export function toCreateTaskInput(
  dto: CreateTaskDto,
  userId: string,
): CreateTaskInput {
  return {
    ...dto,
    createdById: userId,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
  };
}

export function toUpdateTaskInput(dto: UpdateTaskDto): UpdateTaskInput {
  return {
    ...dto,
    dueDate:
      dto.dueDate !== undefined
        ? dto.dueDate === null
          ? null
          : new Date(dto.dueDate)
        : undefined,
  };
}

import {
  toIsoString,
  toIsoStringOrNull,
} from '@api/common/mappers/mapper.utils';
import { TaskLabelColor } from '@repo/database';
import {
  CreateTaskInput,
  UpdateTaskRepositoryInput,
} from '../types/tasks.repository.types';
import { TaskView, TaskAssigneeView } from '@repo/types';
import type { TaskEntity } from '../domain/task.entity';
import type {
  CreateTaskCommand,
  UpdateTaskCommand,
} from '../application/task-application.types';

export function toTaskView(task: TaskEntity): TaskView {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    labelColor: task.labelColor ?? TaskLabelColor.NONE,
    dueDate: toIsoStringOrNull(task.dueDate),
    position: task.position,
    createdAt: toIsoString(task.createdAt),
    updatedAt: toIsoString(task.updatedAt),
    createdById: task.createdById,
    assignees: task.assignees.map(
      (assignee): TaskAssigneeView => ({
        userId: assignee.userId,
        assignedAt: toIsoString(assignee.assignedAt),
        user: {
          id: assignee.user.id,
          name: assignee.user.name,
          email: assignee.user.email,
        },
      }),
    ),
  };
}

export function toTaskViews(tasks: TaskEntity[]): TaskView[] {
  return tasks.map(toTaskView);
}

export function commandToCreateTaskInput(
  command: CreateTaskCommand,
  userId: string,
): CreateTaskInput {
  return {
    ...command,
    createdById: userId,
    dueDate: command.dueDate ? new Date(command.dueDate) : null,
  };
}

export function commandToUpdateTaskRepositoryInput(
  command: UpdateTaskCommand,
): UpdateTaskRepositoryInput {
  return {
    ...command,
    dueDate:
      command.dueDate !== undefined
        ? command.dueDate === null
          ? null
          : new Date(command.dueDate)
        : undefined,
  };
}

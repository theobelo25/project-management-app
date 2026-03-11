import {
  toIsoString,
  toIsoStringOrNull,
} from '@api/common/mappers/mapper.utils';
import { TaskWithAssignees } from '../types/tasks.repository.types';
import { TaskView } from '@repo/types';

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

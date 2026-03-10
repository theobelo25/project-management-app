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
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    position: task.position,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    createdById: task.createdById,
    assignees: task.assignees.map((assignee) => ({
      userId: assignee.userId,
      assignedAt: assignee.assignedAt.toISOString(),
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

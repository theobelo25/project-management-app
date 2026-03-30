import type { TaskView } from '@repo/types';
import type { BoardTask } from './types';

export function taskViewToBoardTask(task: TaskView): BoardTask {
  const firstAssignee = task.assignees?.[0];
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority,
    labelColor: task.labelColor,
    assignee: firstAssignee?.user.name,
  };
}

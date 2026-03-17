import type { TaskListItem } from "@web/components/projects/tasks";
import type { TaskView } from "@repo/types";

export function taskViewToListItem(task: TaskView): TaskListItem {
  const firstAssignee = task.assignees?.[0];
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    assignee: firstAssignee
      ? {
          id: firstAssignee.user.id,
          name: firstAssignee.user.name,
          email: firstAssignee.user.email ?? null,
        }
      : null,
    updatedAt: task.updatedAt,
    dueDate: task.dueDate ?? null,
  };
}

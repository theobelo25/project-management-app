import { TaskAssignee } from '@repo/database';
import { TaskAssignmentView } from '@repo/types';

export function toTaskAssignmentView(
  assignee: TaskAssignee,
): TaskAssignmentView {
  return {
    taskId: assignee.taskId,
    userId: assignee.userId,
    assignedAt: assignee.assignedAt.toISOString(),
  };
}

export function toTaskAssigneeViews(
  assignees: TaskAssignee[],
): TaskAssignmentView[] {
  return assignees.map(toTaskAssignmentView);
}

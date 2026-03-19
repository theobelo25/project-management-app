import { TaskAssignee } from '@repo/database';
import { TaskAssignmentView } from '@repo/types';
import type { TaskAssigneeWithUserAndTaskInfo } from '../types/tasks.repository.types';

/**
 * Maps persistence model → API view.
 * Accepts `TaskAssigneeWithUserAndTaskInfo` (what assign APIs return) or plain `TaskAssignee`.
 */
export function toTaskAssignmentView(
  assignment: TaskAssigneeWithUserAndTaskInfo | TaskAssignee,
): TaskAssignmentView {
  return {
    taskId: assignment.taskId,
    userId: assignment.userId,
    assignedAt: assignment.assignedAt.toISOString(),
  };
}

export function toTaskAssigneeViews(
  assignees: (TaskAssigneeWithUserAndTaskInfo | TaskAssignee)[],
): TaskAssignmentView[] {
  return assignees.map(toTaskAssignmentView);
}

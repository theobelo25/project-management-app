import { TaskAssignee } from '@repo/database';
import { TaskAssignmentView } from '@repo/types';
import type { TaskAssignmentWithContextEntity } from '../domain/task.entity';

/**
 * Maps domain assignment → API view.
 * Accepts domain assignment entity or plain Prisma `TaskAssignee` (minimal fields).
 */
export function toTaskAssignmentView(
  assignment: TaskAssignmentWithContextEntity | TaskAssignee,
): TaskAssignmentView {
  return {
    taskId: assignment.taskId,
    userId: assignment.userId,
    assignedAt: assignment.assignedAt.toISOString(),
  };
}

export function toTaskAssigneeViews(
  assignees: (TaskAssignmentWithContextEntity | TaskAssignee)[],
): TaskAssignmentView[] {
  return assignees.map(toTaskAssignmentView);
}

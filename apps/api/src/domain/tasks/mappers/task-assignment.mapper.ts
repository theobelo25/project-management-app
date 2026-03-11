import { TaskAssignee } from '@repo/database';
import { TaskAssignmentView } from '@repo/types';

export function toTaskAssignmentView(
  assignment: TaskAssignee,
): TaskAssignmentView {
  return {
    taskId: assignment.taskId,
    userId: assignment.userId,
    assignedAt: assignment.assignedAt.toISOString(),
  };
}

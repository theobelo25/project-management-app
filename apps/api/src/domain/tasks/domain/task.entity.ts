import type { TaskLabelColor, TaskPriority, TaskStatus } from '@repo/database';

/**
 * Task aggregate in the domain layer — no Prisma model types.
 * Populated at the repository boundary from persistence rows.
 */
export interface TaskAssigneeEntity {
  userId: string;
  assignedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TaskEntity {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  labelColor: TaskLabelColor | null;
  dueDate: Date | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  assignees: TaskAssigneeEntity[];
}

/** Assignee row returned from assign/unassign flows (includes task slice for events). */
export interface TaskAssignmentWithContextEntity {
  taskId: string;
  userId: string;
  assignedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  task: {
    title: string;
    projectId: string;
  };
}

export type TaskAssignmentResultEntity = {
  assignment: TaskAssignmentWithContextEntity;
  created: boolean;
};

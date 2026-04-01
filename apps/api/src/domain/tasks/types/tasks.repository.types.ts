import {
  Prisma,
  Task,
  TaskAssignee,
  TaskLabelColor,
  TaskPriority,
  TaskStatus,
  User,
} from '@repo/database';
import { PaginationQuery, PaginationResult, ProjectRole } from '@repo/types';
import type { TaskEntity } from '../domain/task.entity';

export const taskWithAssigneesInclude = {
  assignees: { include: { user: true } },
} satisfies Prisma.TaskInclude;

export type TaskAssigneeWithUser = TaskAssignee & {
  user: User;
};

export type TaskAssigneeWithUserAndTaskInfo = TaskAssigneeWithUser & {
  task: Pick<Task, 'title' | 'projectId'>;
};

/** Raw assign result from Prisma before mapping to `TaskAssignmentResultEntity`. */
export type TaskAssignmentPersistenceResult = {
  assignment: TaskAssigneeWithUserAndTaskInfo;
  created: boolean;
};

export type TaskWithAssignees = Task & {
  assignees: TaskAssigneeWithUser[];
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  labelColor?: TaskLabelColor;
  createdById: string;
  dueDate?: Date | null;
  position?: number;
  assigneeIds?: string[];
};

/** Patch shape for Prisma `task.update` (persistence layer). */
export type UpdateTaskRepositoryInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  labelColor?: TaskLabelColor;
  dueDate?: Date | null;
  position?: number;
};

export type FindTasksInput = {
  orgId: string;
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  labelColor?: TaskLabelColor;
  assigneeId?: string;
  search?: string;
  sort?: 'updated-desc' | 'created-desc' | 'title-asc' | 'status-asc';
} & PaginationQuery;

export type PaginatedTasksResult = PaginationResult<TaskEntity>;

export type TaskAccessContext = {
  id: string;
  createdById: string;
  projectId: string;
  assignees: { userId: string }[];
  project: {
    orgId: string;
    ownerId: string;
    currentUserRole?: ProjectRole | null;
  };
};

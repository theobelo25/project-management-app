import {
  Prisma,
  Task,
  TaskAssignee,
  TaskPriority,
  TaskStatus,
  User,
} from '@repo/database';
import { PaginationQuery, PaginationResult, ProjectRole } from '@repo/types';

export const taskWithAssigneesInclude = {
  assignees: { include: { user: true } },
} satisfies Prisma.TaskInclude;

export type TaskAssigneeWithUser = TaskAssignee & {
  user: User;
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
  createdById: string;
  dueDate?: Date | null;
  position?: number;
  assigneeIds?: string[];
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  position?: number;
};

export type FindTasksInput = {
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  sort?: 'updated-desc' | 'created-desc' | 'title-asc' | 'status-asc';
} & PaginationQuery;

export type PaginatedTasksResult = PaginationResult<TaskWithAssignees>;

export type TaskAccessContext = {
  id: string;
  createdById: string;
  projectId: string;
  assignees: { userId: string }[];
  project: {
    ownerId: string;
    currentUserRole?: ProjectRole | null;
  };
};

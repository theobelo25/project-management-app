import {
  Task,
  TaskAssignee,
  TaskPriority,
  TaskStatus,
  User,
} from '@repo/database';

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
  limit: number;
  cursor?: string;
};

export type PaginatedTasksResult = {
  items: TaskWithAssignees[];
  nextCursor: string | null;
};

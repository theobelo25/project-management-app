import type { TaskLabelColor, TaskPriority, TaskStatus } from '@repo/types';

export type TaskAssignee = {
  id: string;
  name: string;
  email?: string | null;
};

export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  labelColor: TaskLabelColor;
  assignee: TaskAssignee | null;
  updatedAt: string | Date;
  dueDate: string | null;
};

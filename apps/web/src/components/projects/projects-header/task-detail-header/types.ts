import type { TaskView } from '@repo/types';

export type TaskForHeaderTask = Pick<TaskView, 'title' | 'status'>;

export type TaskForHeader = {
  projectId: string;
  task: TaskForHeaderTask;
} | null;

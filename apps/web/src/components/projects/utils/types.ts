import type { ProjectRole, TaskStatus } from '@repo/types';

export type ProjectTask = {
  id: string;
  title: string;
  status: TaskStatus;
};

export type MemberWithRole = {
  id: string;
  name: string;
  email?: string | null;
  role: ProjectRole;
};

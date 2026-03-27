import type { ProjectRole } from '@repo/types';

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
};

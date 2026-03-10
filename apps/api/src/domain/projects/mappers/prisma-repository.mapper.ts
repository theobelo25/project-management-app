import { ProjectRole } from '@repo/database';
import { ProjectWithRole } from '../types/projects.repository.types';

type PrismaProjectWithMemberRole = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  members?: { role: ProjectRole }[];
};

export function toProjectWithRole(
  project: PrismaProjectWithMemberRole,
  userId: string,
): ProjectWithRole {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    archivedAt: project.archivedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    currentUserRole:
      project.ownerId === userId
        ? ProjectRole.OWNER
        : project.members?.[0]?.role,
  };
}

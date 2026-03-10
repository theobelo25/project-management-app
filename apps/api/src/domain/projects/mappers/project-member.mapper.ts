import { ProjectMemberView, ProjectMembersView } from '@repo/types';
import { ProjectMemberWithUser } from '../types/projects.repository.types';

export function toProjectMemberView(
  member: ProjectMemberWithUser,
): ProjectMemberView {
  return {
    userId: member.userId,
    role: member.role,
    joinedAt: member.createdAt.toISOString(),
  };
}

export function toProjectMembersView(
  members: ProjectMemberWithUser[],
): ProjectMembersView {
  return {
    items: members.map(toProjectMemberView),
  };
}

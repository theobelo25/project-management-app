import { ProjectMemberView, ProjectMembersView } from '@repo/types';
import { ProjectMemberWithUser } from '../repositories/projects.repository';

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

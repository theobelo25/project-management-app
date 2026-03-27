import { ProjectMemberView, ProjectMembersView } from '@repo/types';
import { ProjectMemberWithUser } from '../types/projects.repository.types';
import { toIsoString } from '@api/common/mappers/mapper.utils';

export function toProjectMemberView(
  member: ProjectMemberWithUser,
): ProjectMemberView {
  return {
    userId: member.userId,
    role: member.role,
    joinedAt: toIsoString(member.createdAt),
  };
}

export function toProjectMembersView(
  members: ProjectMemberWithUser[],
): ProjectMembersView {
  return {
    items: members.map(toProjectMemberView),
  };
}

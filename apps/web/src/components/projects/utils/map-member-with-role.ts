import type {
  ProjectRole,
  ProjectDetailView,
  ProjectMembersView,
} from '@repo/types';

export type MemberWithRole = {
  id: string;
  name: string;
  email?: string;
  role: ProjectRole;
};

export function mapMembersWithRole(params: {
  projectMembers?: ProjectDetailView['members'];
  membersItems?: ProjectMembersView['items'];
}): MemberWithRole[] {
  const { projectMembers, membersItems } = params;

  if (!projectMembers || !membersItems) return [];

  return projectMembers.map((member) => {
    const roleItem = membersItems.find((i) => i.userId === member.id);

    return {
      id: member.id,
      name: member.name,
      email: 'email' in member ? member.email : undefined,
      role: roleItem?.role ?? 'MEMBER',
    };
  });
}

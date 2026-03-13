"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  changeProjectMemberRole,
  removeProjectMember,
} from "@web/lib/api/client";
import { PROJECT_MEMBERS_QUERY_KEY } from "@web/lib/api/queries";

import { InviteMemberDialog } from "@web/components/projects/members/invite-member-dialog";
import { ProjectMembersTable } from "@web/components/projects/members/project-members-table";
import type {
  ProjectMember,
  ProjectRole,
} from "@web/components/projects/members/types";

type ProjectMembersManagerProps = {
  projectId: string;
  members: ProjectMember[];
  currentUserRole: ProjectRole;
  showCardHeader?: boolean;
  title?: string;
  description?: string;
};

export function ProjectMembersManager({
  projectId,
  members,
  currentUserRole,
  title = "Members",
  description = "Manage who has access to this project and what they can do.",
}: ProjectMembersManagerProps) {
  const queryClient = useQueryClient();
  const [optimisticMembers, setOptimisticMembers] = useState(members);

  const canManageMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const changeRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: Exclude<ProjectRole, "OWNER">;
    }) => changeProjectMemberRole(projectId, memberId, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
    },
    onError: (error: Error) => {
      console.error(error);
      setOptimisticMembers(members);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeProjectMember(projectId, memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
    },
    onError: (error: Error) => {
      console.error(error);
      setOptimisticMembers(members);
    },
  });

  const handleChangeRole = (
    memberId: string,
    role: Exclude<ProjectRole, "OWNER">,
  ) => {
    setOptimisticMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role } : member,
      ),
    );

    changeRoleMutation.mutate({ memberId, role });
  };

  const handleRemove = (memberId: string) => {
    setOptimisticMembers((prev) =>
      prev.filter((member) => member.id !== memberId),
    );

    removeMemberMutation.mutate(memberId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {canManageMembers ? <InviteMemberDialog projectId={projectId} /> : null}
      </div>

      <ProjectMembersTable
        members={optimisticMembers}
        currentUserRole={currentUserRole}
        onChangeRole={canManageMembers ? handleChangeRole : undefined}
        onRemove={canManageMembers ? handleRemove : undefined}
      />
    </div>
  );
}

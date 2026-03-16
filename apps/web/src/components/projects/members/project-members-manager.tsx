"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  InviteMemberDialog,
  type ProjectMember,
  ProjectMembersTable,
} from "@web/components/projects/members";
import {
  removeProjectMember,
  updateProjectMemberRole,
} from "@web/lib/api/client";
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from "@web/lib/api/queries";
import type { ProjectRole } from "@repo/types";

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
  title,
  description,
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
    }) => updateProjectMemberRole(projectId, memberId, { role }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      await queryClient.refetchQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success("Role updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role.");
      setOptimisticMembers(members);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeProjectMember(projectId, memberId),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      await queryClient.refetchQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success("Member removed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove member");
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

  useEffect(() => {
    setOptimisticMembers(members);
  }, [members]);

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-col gap-4 sm:flex-row sm:items-start ${title != null || description != null ? "sm:justify-between" : "sm:justify-end"}`}
      >
        {title != null || description != null ? (
          <div className="space-y-1">
            {title != null && (
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            )}
            {description != null && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        ) : null}
        {canManageMembers ? (
          <InviteMemberDialog
            projectId={projectId}
            currentMemberIds={members.map((m) => m.id)}
          />
        ) : null}
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

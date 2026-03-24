'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  InviteMemberDialog,
  type ProjectMember,
  ProjectMembersTable,
} from '@web/components/projects/members';
import type { ProjectRole } from '@repo/types';
import { cn } from '@web/lib/utils';
import { useRemoveProjectMember } from '@web/lib/api/mutations/use-remove-project-member';
import { useUpdateProjectMemberRole } from '@web/lib/api/mutations/use-update-project-member-role';

type ProjectMembersManagerProps = {
  projectId: string;
  members: ProjectMember[];
  currentUserRole?: ProjectRole;
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
  const [optimisticMembers, setOptimisticMembers] = useState(members);

  const canManageMembers =
    currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const changeRoleMutation = useUpdateProjectMemberRole(projectId, {
    onError: () => {
      setOptimisticMembers(members);
    },
  });

  const removeMemberMutation = useRemoveProjectMember(projectId, {
    onError: () => {
      setOptimisticMembers(members);
    },
  });

  const isMutating =
    changeRoleMutation.isPending || removeMemberMutation.isPending;

  const handleChangeRole = useCallback(
    (memberId: string, role: Exclude<ProjectRole, 'OWNER'>) => {
      setOptimisticMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role } : member,
        ),
      );
      changeRoleMutation.mutate({ memberId, role });
    },
    [changeRoleMutation],
  );

  const handleRemove = useCallback(
    (memberId: string) => {
      setOptimisticMembers((prev) =>
        prev.filter((member) => member.id !== memberId),
      );
      removeMemberMutation.mutate(memberId);
    },
    [removeMemberMutation],
  );

  useEffect(() => {
    setOptimisticMembers(members);
  }, [members]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-start',
          title != null || description != null
            ? 'sm:justify-between'
            : 'sm:justify-end',
        )}
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
        isMutating={isMutating}
      />
    </div>
  );
}

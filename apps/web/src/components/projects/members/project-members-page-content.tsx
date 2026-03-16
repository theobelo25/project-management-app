"use client";

import {
  InvalidProjectMessage,
  PageErrorMessage,
  PageLoadingMessage,
} from "@web/components/projects";
import {
  type ProjectMember,
  ProjectMembersManager,
} from "@web/components/projects/members";
import { useProjectMembersQuery, useProjectQuery } from "@web/lib/api/queries";
import type { ProjectRole } from "@repo/types";

function mergeMembersWithRoles(
  projectMembers: { id: string; name: string; email?: string }[],
  membersDataItems: { userId: string; role: ProjectRole }[],
): ProjectMember[] {
  return projectMembers.map((m) => {
    const roleItem = membersDataItems.find((i) => i.userId === m.id);
    return {
      id: m.id,
      name: m.name,
      email: m.email ?? "",
      role: roleItem?.role ?? "MEMBER",
    };
  });
}

type ProjectMembersPageContentProps = {
  projectId: string;
};

export function ProjectMembersPageContent({
  projectId,
}: ProjectMembersPageContentProps) {
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useProjectQuery(projectId);

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useProjectMembersQuery(projectId);

  const members =
    project?.members && membersData?.items
      ? mergeMembersWithRoles(project.members, membersData.items)
      : [];
  const currentUserRole = project?.currentUserRole ?? "MEMBER";

  const isLoading = isProjectLoading || isMembersLoading;
  const isError = isProjectError || isMembersError;
  const errorMessage =
    projectError?.message ?? membersError?.message ?? "Something went wrong";

  return (
    <>
      <div className="flex flex-col gap-8">
        {!projectId ? (
          <InvalidProjectMessage />
        ) : isLoading && !project && !membersData ? (
          <div className="flex flex-col gap-4">
            <PageLoadingMessage />
          </div>
        ) : isError || !project ? (
          <div className="flex flex-col gap-4">
            <PageErrorMessage message={errorMessage} />
          </div>
        ) : (
          <ProjectMembersManager
            projectId={project.id}
            members={members}
            currentUserRole={currentUserRole}
          />
        )}
      </div>
    </>
  );
}

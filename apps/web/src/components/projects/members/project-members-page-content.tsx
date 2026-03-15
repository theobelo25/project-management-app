"use client";

import { useProjectMembersQuery, useProjectQuery } from "@web/lib/api/queries";
import {
  type ProjectMember,
  type ProjectRole,
  ProjectMembersManager,
} from "@web/components/projects/members";
import type { ProjectDetailView, ProjectMembersView } from "@repo/types";
import { BackLink } from "../back-link";
import { ROUTES } from "@web/lib/routes";
import {
  PageLoadingMessage,
  PageErrorMessage,
  InvalidProjectMessage,
} from "@web/components/projects";

function mergeMembersWithRoles(
  projectMembers: { id: string; name: string; email?: string }[],
  membersDataItems: { userId: string; role: ProjectRole }[],
): ProjectMember[] {
  return projectMembers.map((m) => {
    const roleItem = membersDataItems.find((i) => i.userId === m.id);
    return {
      id: m.id,
      name: m.name,
      email: "email" in m && m.email != null ? m.email : "",
      role: roleItem?.role ?? "MEMBER",
    };
  });
}

type ProjectMembersPageContentProps = {
  projectId: string;
  initialProject: ProjectDetailView | null;
  initialMembers: ProjectMembersView | null;
};

export function ProjectMembersPageContent({
  projectId,
  initialProject,
  initialMembers,
}: ProjectMembersPageContentProps) {
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useProjectQuery(projectId, {
    initialData: initialProject ?? undefined,
    initialDataUpdatedAt: initialProject ? Date.now() : undefined,
  });

  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useProjectMembersQuery(projectId, {
    initialData: initialMembers ?? undefined,
    initialDataUpdatedAt: initialMembers ? Date.now() : undefined,
  });

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
      <div className="flex flex-col gap-8 my-4">
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
          <>
            <div className="flex flex-col gap-4">
              <div>
                <BackLink href={`${ROUTES.projects}/${project.id}`}>
                  Back to Project
                </BackLink>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Members
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage access for{" "}
                  <span className="font-medium">{project!.name}</span>.
                </p>
              </div>
            </div>
            <ProjectMembersManager
              projectId={project!.id}
              members={members}
              currentUserRole={currentUserRole}
              title="Project Members"
              description="Invite teammates, update roles, and manage access to this project."
            />
          </>
        )}
      </div>
    </>
  );
}

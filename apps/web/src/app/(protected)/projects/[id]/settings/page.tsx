"use client";
import { useParams } from "next/navigation";
import { useProjectMembersQuery, useProjectQuery } from "@web/lib/api/queries";

import {
  GeneralSettingsCard,
  MemberSettingsCard,
  DangerZoneCard,
  PermissionsSummaryCard,
} from "@web/components/projects/settings";

type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export default function ProjectSettingsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const { data: project, isLoading, isError, error } = useProjectQuery(id);
  const { data: membersData } = useProjectMembersQuery(id);

  const membersWithRole =
    project?.members && membersData?.items
      ? project.members.map((m) => {
          const roleItem = membersData.items.find((i) => i.userId === m.id);
          return {
            id: m.id,
            name: m.name,
            email: "email" in m ? (m as { email?: string }).email : undefined,
            role: roleItem?.role ?? ("MEMBER" as ProjectRole),
          };
        })
      : [];

  const canManageMembers =
    project?.currentUserRole === "OWNER" ||
    project?.currentUserRole === "ADMIN";

  const canDeleteProject = project?.currentUserRole === "OWNER";

  if (!id) return null;
  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div
          className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }
  if (isError || !project) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12 text-destructive">
          {error?.message ?? "Project not found"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 mb-4">
        <GeneralSettingsCard project={project} />
        <MemberSettingsCard
          project={project}
          canManageMembers={canManageMembers}
          membersWithRole={membersWithRole}
        />
        <DangerZoneCard project={project} canDeleteProject={canDeleteProject} />
        <PermissionsSummaryCard project={project} />
      </div>
    </>
  );
}

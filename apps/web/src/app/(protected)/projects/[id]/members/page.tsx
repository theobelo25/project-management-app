"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectMembersManager } from "@web/components/projects/members/project-members-manager";
import { Button } from "@web/components/ui/button";
import { useParams } from "next/navigation";
import { useProjectMembersQuery, useProjectQuery } from "@web/lib/api/queries";
import type {
  ProjectMember,
  ProjectRole,
} from "@web/components/projects/members/types";

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

export default function ProjectMembersPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const { data: project, isLoading, isError, error } = useProjectQuery(id);
  const { data: membersData } = useProjectMembersQuery(id);

  const members =
    project?.members && membersData?.items
      ? mergeMembersWithRoles(project.members, membersData.items)
      : [];

  const currentUserRole = project?.currentUserRole ?? "MEMBER";

  if (!id) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">Invalid project.</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            Loading…
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center py-12 text-sm text-destructive">
            {error?.message ?? "Project not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href={`/projects/${project.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground">
            Manage access for{" "}
            <span className="font-medium">{project.name}</span>.
          </p>
        </div>
      </div>

      <ProjectMembersManager
        projectId={project.id}
        members={members}
        currentUserRole={currentUserRole}
        title="Project Members"
        description="Invite teammates, update roles, and manage access to this project."
      />
    </div>
  );
}

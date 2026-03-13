import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectMembersManager } from "@web/components/projects/members/project-members-manager";
import { Button } from "@web/components/ui/button";

async function getProjectMembers(id: string) {
  // Replace with your real API call later.
  return {
    id,
    name: "Project Management App",
    currentUserRole: "OWNER" as const,
    members: [
      {
        id: "1",
        name: "Theo Belo",
        email: "theo@example.com",
        role: "OWNER" as const,
      },
      {
        id: "2",
        name: "Kenzie Malone",
        email: "kenzie@example.com",
        role: "ADMIN" as const,
      },
      {
        id: "3",
        name: "Joel Smith",
        email: "joel@example.com",
        role: "MEMBER" as const,
      },
    ],
  };
}

export default async function ProjectMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectMembers(id);

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
        members={project.members}
        currentUserRole={project.currentUserRole}
        title="Project Members"
        description="Invite teammates, update roles, and manage access to this project."
      />
    </div>
  );
}

import { CreateTaskDialog } from "@web/components/projects/tasks/create-task-dialog";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { ProjectListItemView, ProjectRole } from "@repo/types";

function formatRole(role: ProjectRole | undefined): string {
  if (!role) return "Member";
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

export function ProjectDetailWelcome({
  project,
}: {
  project: ProjectListItemView;
}) {
  return (
    <section className="flex flex-col gap-4 my-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <Badge variant="secondary">
              {formatRole(project.currentUserRole)}
            </Badge>
          </div>

          <p className="max-w-3xl text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>

          <CreateTaskDialog projectId={project.id} />
        </div>
      </div>
    </section>
  );
}

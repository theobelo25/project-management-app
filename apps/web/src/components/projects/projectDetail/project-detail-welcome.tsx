import { CreateTaskDialog } from "@web/components/projects/tasks";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ProjectListItemView } from "@repo/types";
import { formatProjectRole } from "@web/components/projects/utils";
import { ROUTES } from "@web/lib/routes";
import { PageHeader, BackLink } from "@web/components/projects";

export function ProjectDetailWelcome({
  project,
}: {
  project: ProjectListItemView;
}) {
  return (
    <PageHeader
      backLink={<BackLink href={ROUTES.projects}>Back to Projects</BackLink>}
      title={project.name}
      badge={
        <Badge variant="secondary">
          {formatProjectRole(project.currentUserRole)}
        </Badge>
      }
      description={project.description || "No description provided."}
      actions={
        <>
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <CreateTaskDialog projectId={project.id} />
        </>
      }
    />
  );
}

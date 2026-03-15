import { FolderKanban } from "lucide-react";

import { EmptyStateCard, CreateProjectDialog } from "@web/components/projects";

type ProjectsEmptyStateProps = {
  title?: string;
  description?: string;
};

export function ProjectsEmptyState({
  title = "No projects yet",
  description = "Create your first project to start organizing tasks and collaborating with your team.",
}: ProjectsEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={<FolderKanban className="h-6 w-6 text-muted-foreground" />}
      title={title}
      description={description}
    >
      <CreateProjectDialog />
    </EmptyStateCard>
  );
}

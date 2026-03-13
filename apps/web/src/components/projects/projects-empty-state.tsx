import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { Button } from "@web/components/ui/button";

type ProjectsEmptyStateProps = {
  title?: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
};

export function ProjectsEmptyState({
  title = "No projects yet",
  description = "Create your first project to start organizing tasks and collaborating with your team.",
  createHref = "/projects/new",
  createLabel = "Create Project",
}: ProjectsEmptyStateProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border">
        <FolderKanban className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>

      <Button asChild className="mt-6">
        <Link href={createHref}>{createLabel}</Link>
      </Button>
    </div>
  );
}

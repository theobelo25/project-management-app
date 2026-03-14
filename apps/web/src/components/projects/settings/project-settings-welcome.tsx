import { Button } from "@web/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectDetailView } from "@repo/types";

type ProjectSettingsWelcomeProps = {
  project: Pick<ProjectDetailView, "id" | "name">;
};

export function ProjectSettingsWelcome({
  project,
}: ProjectSettingsWelcomeProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href={`/projects/${project.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Project Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage project details, members, and administrative actions for{" "}
          <span className="font-medium">{project.name}</span>.
        </p>
      </div>
    </section>
  );
}

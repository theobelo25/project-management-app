import { CreateTaskDialog } from "@web/components/projects/tasks/create-task-dialog";
import { Button } from "@web/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type TasksWelcomeProps = {
  project: {
    id: string;
    name: string;
  };
};

export function TasksWelcome({ project }: TasksWelcomeProps) {
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage all tasks in{" "}
            <span className="font-medium">{project.name}</span>.
          </p>
        </div>

        <CreateTaskDialog projectId={project.id} />
      </div>
    </section>
  );
}

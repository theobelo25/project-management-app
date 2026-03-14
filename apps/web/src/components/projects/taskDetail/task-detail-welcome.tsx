import { Button } from "@web/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { TaskView } from "@repo/types";
import { Badge } from "@web/components/ui/badge";

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "DONE":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    default:
      return "outline";
  }
}

function formatTaskStatus(status: string) {
  switch (status) {
    case "TODO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

type TaskDetailWelcomeProps = {
  projectId: string;
  setEditOpen: (open: boolean) => void;
  task: Pick<TaskView, "title" | "status">;
};

export function TaskDetailWelcome({
  projectId,
  setEditOpen,
  task,
}: TaskDetailWelcomeProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href={`/projects/${projectId}/tasks`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {task.title}
            </h1>
            <Badge variant={getStatusBadgeVariant(task.status)}>
              {formatTaskStatus(task.status)}
            </Badge>
          </div>

          <p className="max-w-3xl text-sm text-muted-foreground">
            View task details, ownership, and status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Task
          </Button>
        </div>
      </div>
    </section>
  );
}

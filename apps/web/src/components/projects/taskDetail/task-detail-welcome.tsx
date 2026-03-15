import { Button } from "@web/components/ui/button";
import { Pencil } from "lucide-react";
import { TaskView } from "@repo/types";
import { Badge } from "@web/components/ui/badge";
import {
  formatTaskStatus,
  getStatusBadgeVariant,
} from "@web/components/projects/utils";
import { ROUTES } from "@web/lib/routes";
import { PageHeader, BackLink } from "@web/components/projects";

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
    <PageHeader
      backLink={
        <BackLink href={`${ROUTES.projects}/${projectId}/tasks`}>
          Back to Tasks
        </BackLink>
      }
      title={task.title}
      badge={
        <Badge variant={getStatusBadgeVariant(task.status)}>
          {formatTaskStatus(task.status)}
        </Badge>
      }
      description="View task details, ownership, and status."
      actions={
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Task
        </Button>
      }
    />
  );
}

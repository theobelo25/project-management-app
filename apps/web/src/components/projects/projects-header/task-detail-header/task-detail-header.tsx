"use client";

import { Pencil } from "lucide-react";

import { PageHeader } from "@web/components/projects";
import {
  formatTaskStatus,
  getStatusBadgeVariant,
} from "@web/components/projects/utils";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { ROUTES } from "@web/lib/routes";
import { useTaskDetail } from "./task-detail-context";
import type { TaskForHeaderTask } from "./types";

type TaskDetailHeaderProps = {
  projectId: string;
  task: TaskForHeaderTask;
};

export function TaskDetailHeader({ projectId, task }: TaskDetailHeaderProps) {
  const { setEditOpen } = useTaskDetail();

  return (
    <PageHeader
      backHref={`${ROUTES.projects}/${projectId}/tasks`}
      backLabel="Back to Tasks"
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

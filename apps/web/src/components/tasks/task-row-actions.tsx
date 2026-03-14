"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { EditTaskDialog } from "@web/components/tasks/edit-task-dialog";
import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";

type TaskRowActionsProps = {
  projectId: string;
  taskId: string;
  task: {
    id: string;
    title: string;
    description: string | null;
  };
  onDelete?: (taskId: string) => void;
};

export function TaskRowActions({
  projectId,
  taskId,
  task,
  onDelete,
}: TaskRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open task actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/projects/${projectId}/tasks/${taskId}`}>
              View task
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit task
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete?.(taskId)}
          >
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskDialog
        projectId={projectId}
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

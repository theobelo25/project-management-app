"use client";

import { useState } from "react";
import Link from "next/link";

import {
  DestructiveDropdownItem,
  RowActionsMenu,
} from "@web/components/projects/row-actions-menu";
import { EditTaskDialog } from "@web/components/projects/tasks";
import { DropdownMenuItem } from "@web/components/ui/dropdown-menu";

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
      <RowActionsMenu ariaLabel="Open task actions">
        <DropdownMenuItem asChild>
          <Link href={`/projects/${projectId}/tasks/${taskId}`}>View task</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setEditOpen(true);
          }}
        >
          Edit task
        </DropdownMenuItem>

        <DestructiveDropdownItem onClick={() => onDelete?.(taskId)}>
          Delete task
        </DestructiveDropdownItem>
      </RowActionsMenu>

      <EditTaskDialog
        projectId={projectId}
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

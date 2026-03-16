"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { TaskForm } from "@web/components/projects/tasks";
import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";
import { useUpdateTask } from "@web/lib/api/mutations/use-update-task";

type EditTaskDialogProps = {
  projectId: string;
  task: {
    id: string;
    title: string;
    description: string | null;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export function EditTaskDialog({
  projectId,
  task,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: EditTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const updateTaskMutation = useUpdateTask(projectId, task.id, {
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button type="button" variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Update this task’s title and description.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          submitLabel="Save Changes"
          isLoading={updateTaskMutation.isPending}
          errorMessage={updateTaskMutation.error?.message ?? null}
          defaultValues={{
            projectId,
            title: task.title,
            description: task.description ?? "",
          }}
          onSubmit={async (values) => {
            await updateTaskMutation.mutateAsync(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

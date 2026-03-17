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
import { UpdateTaskSchema, type UpdateTaskInput } from "@repo/types";

type EditTaskDialogProps = {
  projectId: string;
  task: {
    id: string;
    title: string;
    description: string | null;
    dueDate?: string | null;
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
            Update this task’s title, description, and due date.
          </DialogDescription>
        </DialogHeader>

        <TaskForm<UpdateTaskInput>
          projectId={projectId}
          schema={UpdateTaskSchema}
          submitLabel="Save Changes"
          isLoading={updateTaskMutation.isPending}
          errorMessage={updateTaskMutation.error?.message ?? null}
          defaultValues={
            {
              title: task.title,
              description: task.description ?? "",
              dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
            } as unknown as Partial<UpdateTaskInput>
          }
          onSubmit={async (values) => {
            const payload = UpdateTaskSchema.parse(values) as UpdateTaskInput;
            await updateTaskMutation.mutateAsync(payload);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

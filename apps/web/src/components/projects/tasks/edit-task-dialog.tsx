"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

import { updateTask } from "@web/lib/api/client";
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from "@web/lib/api/queries";

import type { CreateTaskDto, TaskView } from "@repo/types";

import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";

import { TaskForm } from "@web/components/projects/tasks";
import { toast } from "sonner";

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

  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (values: CreateTaskDto) =>
      updateTask(projectId, task.id, values),
    onSuccess: (_updatedTask: TaskView) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: TASK_QUERY_KEY(task.id),
      });
      toast.success("Task updated successfully!");
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task.");
    },
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

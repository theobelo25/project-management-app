"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { createTask } from "@web/lib/api/client";
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
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

import { TaskForm } from "@web/components/projects/tasks/task-form";
import { toast } from "sonner";

type CreateTaskDialogProps = {
  projectId: string;
};

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (values: CreateTaskDto) => createTask(projectId, values),
    onSuccess: (task: TaskView) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success("Task created successfully!");
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add a new task to this project and keep work moving forward.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          submitLabel="Create Task"
          isLoading={createTaskMutation.isPending}
          errorMessage={createTaskMutation.error?.message ?? null}
          onSubmit={async (values) => {
            await createTaskMutation.mutateAsync(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@web/lib/api/client";
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
} from "@web/lib/api/queries";
import type { CreateTaskDto, TaskView } from "@repo/types";
import { CreateEntityDialog } from "@web/components/projects/create-entity-dialog";
import { TaskForm } from "@web/components/projects/tasks";
import { toast } from "sonner";

type CreateTaskDialogProps = {
  projectId: string;
};

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
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
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create task.");
    },
  });

  return (
    <CreateEntityDialog
      triggerLabel="New Task"
      dialogTitle="Create task"
      dialogDescription="Add a new task to this project and keep work moving forward."
    >
      {({ onSuccess }) => (
        <TaskForm
          projectId={projectId}
          submitLabel="Create Task"
          isLoading={createTaskMutation.isPending}
          errorMessage={createTaskMutation.error?.message ?? null}
          onSubmit={async (values) => {
            await createTaskMutation.mutateAsync(values);
            onSuccess();
          }}
        />
      )}
    </CreateEntityDialog>
  );
}

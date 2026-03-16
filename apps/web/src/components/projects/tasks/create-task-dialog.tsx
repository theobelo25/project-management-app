"use client";

import { CreateEntityDialog } from "@web/components/projects/create-entity-dialog";
import { TaskForm } from "@web/components/projects/tasks";
import { useCreateTask } from "@web/lib/api/mutations/use-create-task";
import { CreateTaskSchema, type CreateTaskDto } from "@repo/types";

type CreateTaskDialogProps = {
  projectId: string;
};

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const createTaskMutation = useCreateTask(projectId);

  return (
    <CreateEntityDialog
      triggerLabel="New Task"
      dialogTitle="Create task"
      dialogDescription="Add a new task to this project and keep work moving forward."
    >
      {({ onSuccess }) => (
        <TaskForm<CreateTaskDto>
          projectId={projectId}
          schema={CreateTaskSchema}
          submitLabel="Create Task"
          isLoading={createTaskMutation.isPending}
          errorMessage={createTaskMutation.error?.message ?? null}
          defaultValues={{ title: "", description: "" }}
          onSubmit={async (values) => {
            await createTaskMutation.mutateAsync(values);
            onSuccess();
          }}
        />
      )}
    </CreateEntityDialog>
  );
}

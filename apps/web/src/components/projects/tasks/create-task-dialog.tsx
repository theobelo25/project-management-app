'use client';

import { z } from 'zod';
import { CreateEntityDialog } from '@web/components/projects/create-entity-dialog';
import { TaskForm } from '@web/components/projects/tasks';
import { useCreateTask } from '@web/lib/api/mutations/use-create-task';
import { CreateTaskSchema, type CreateTaskDto } from '@repo/types';
import type { TaskStatus } from '@repo/types';

const CreateTaskFormSchema = CreateTaskSchema.extend({
  dueDate: z.string().optional().nullable(),
});

type CreateTaskFormValues = z.infer<typeof CreateTaskFormSchema>;

type CreateTaskDialogProps = {
  projectId: string;
  /** When provided, the new task is created in this status (e.g. for column "Add Task"). */
  defaultStatus?: TaskStatus;
  /** When provided, used as the dialog trigger instead of the default "New Task" button. */
  trigger?: React.ReactNode;
};

export function CreateTaskDialog({
  projectId,
  defaultStatus,
  trigger,
}: CreateTaskDialogProps) {
  const createTaskMutation = useCreateTask(projectId);

  return (
    <CreateEntityDialog
      triggerLabel="New Task"
      dialogTitle="Create task"
      dialogDescription="Add a new task to this project and keep work moving forward."
      trigger={trigger}
    >
      {({ onSuccess }) => (
        <TaskForm<CreateTaskFormValues>
          projectId={projectId}
          schema={CreateTaskFormSchema}
          submitLabel="Create Task"
          isLoading={createTaskMutation.isPending}
          errorMessage={createTaskMutation.error?.message ?? null}
          defaultValues={{
            title: '',
            description: '',
            dueDate: '',
            ...(defaultStatus != null && { status: defaultStatus }),
          }}
          onSubmit={async (values) => {
            const payload: CreateTaskDto = {
              ...values,
              dueDate:
                values.dueDate && values.dueDate.length === 10
                  ? `${values.dueDate}T12:00:00.000Z`
                  : null,
            };
            await createTaskMutation.mutateAsync(payload);
            onSuccess();
          }}
        />
      )}
    </CreateEntityDialog>
  );
}

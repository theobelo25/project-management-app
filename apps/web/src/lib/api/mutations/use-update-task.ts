import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTask } from '@web/lib/api/client';
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from '@web/lib/api/queries';
import type { UpdateTaskInput, TaskView } from '@repo/types';

type Options = {
  onSuccess?: (task: TaskView) => void;
  onError?: (error: Error) => void;
};

export function useUpdateTask(
  projectId: string,
  taskId: string,
  options: Options = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateTaskInput) =>
      updateTask(projectId, taskId, values),
    onSuccess: async (updatedTask) => {
      await queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: TASK_QUERY_KEY(taskId),
      });
      toast.success('Task updated successfully!');
      options.onSuccess?.(updatedTask);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task.');
      options.onError?.(error);
    },
  });
}

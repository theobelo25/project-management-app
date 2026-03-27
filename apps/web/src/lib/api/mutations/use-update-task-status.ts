import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTask } from '@web/lib/api/client';
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from '@web/lib/api/queries';
import type { TaskStatus } from '@repo/types';

type Variables = {
  taskId: string;
  status: TaskStatus;
};

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useUpdateTaskStatus(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: Variables) =>
      updateTask(projectId, taskId, { status, dueDate: undefined }),
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: TASK_QUERY_KEY(taskId),
      });
      toast.success('Task updated');
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update task');
      options.onError?.(error);
    },
  });
}

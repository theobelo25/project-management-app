import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unassignTaskUser } from '@web/lib/api/client';
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from '@web/lib/api/queries';

type Variables = {
  taskId: string;
  userId: string;
};

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useUnassignTaskUser(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, userId }: Variables) =>
      unassignTaskUser(taskId, userId),
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY(taskId) });
      await queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });

      toast.success('Assignee updated');
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update assignee');
      options.onError?.(error);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteTask } from '@web/lib/api/client';
import { PROJECT_TASKS_QUERY_KEY } from '@web/lib/api/queries';

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useDeleteTask(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      toast.success('Task deleted successfully!');
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task');
      options.onError?.(error);
    },
  });
}

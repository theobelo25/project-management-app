import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTask } from '@web/lib/api/client';
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
} from '@web/lib/api/queries';
import type { CreateTaskDto, TaskView } from '@repo/types';

type Options = {
  onSuccess?: (task: TaskView) => void;
  onError?: (error: Error) => void;
};

export function useCreateTask(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateTaskDto) => createTask(projectId, values),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success('Task created successfully!');
      options.onSuccess?.(task);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task.');
      options.onError?.(error);
    },
  });
}

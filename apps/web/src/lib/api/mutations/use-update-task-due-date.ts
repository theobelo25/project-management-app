import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTask } from "@web/lib/api/client";
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from "@web/lib/api/queries";

type Variables = {
  taskId: string;
  dueDate: string;
};

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useUpdateTaskDueDate(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, dueDate }: Variables) =>
      updateTask(projectId, taskId, {
        dueDate: new Date(`${dueDate}T12:00:00.000Z`),
      }),
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
      toast.success("Due date updated");
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update due date");
      options.onError?.(error);
    },
  });
}

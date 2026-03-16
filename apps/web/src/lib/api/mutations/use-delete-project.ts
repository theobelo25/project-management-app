import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProject } from "@web/lib/api/client";
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from "@web/lib/api/queries";
import { ROUTES } from "@web/lib/routes";

type UseDeleteProjectOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
};

export function useDeleteProject(
  projectId: string,
  {
    onSuccess,
    onError,
    redirectOnSuccess = true,
  }: UseDeleteProjectOptions = {},
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      await queryClient.removeQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success("Project deleted successfully.");

      if (redirectOnSuccess) {
        router.push(ROUTES.projects);
      }

      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project.");
      onError?.(error);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { archiveProject, unarchiveProject } from '@web/lib/api/client';
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from '@web/lib/api/queries';

export function useArchiveProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success('Project archived successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to archive project');
    },
  });
}

export function useUnarchiveProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unarchiveProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success('Project unarchived successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unarchive project');
    },
  });
}

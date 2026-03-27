import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProject } from '@web/lib/api/client';
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from '@web/lib/api/queries';

type UpdateProjectDto = { name?: string; description?: string | null };

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProjectDto) => updateProject(projectId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Update failed.');
    },
  });
}

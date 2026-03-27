import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProject } from '@web/lib/api/client';
import { PROJECTS_QUERY_KEY } from '@web/lib/api/queries';
import type { CreateProjectDto, ProjectView } from '@repo/types';

type Options = {
  onSuccess?: (project: ProjectView) => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
};

export function useCreateProject({
  onSuccess,
  onError,
  redirectOnSuccess = true,
}: Options = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(dto),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      onSuccess?.(project);
      toast.success('Project creted successfully!');
      if (redirectOnSuccess) {
        router.push(`/projects/${project.id}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
      onError?.(error);
    },
  });
}

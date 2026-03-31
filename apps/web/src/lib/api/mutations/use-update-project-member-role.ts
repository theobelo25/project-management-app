import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProjectMemberRole } from '@web/lib/api/client';
import {
  PROJECTS_QUERY_KEY,
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from '@web/lib/api/queries';
import type { ProjectRole } from '@repo/types';

type ChangeRolePayload = {
  memberId: string;
  role: Exclude<ProjectRole, 'OWNER'>;
};

type Options = {
  onError?: (error: Error) => void;
};

export function useUpdateProjectMemberRole(
  projectId: string,
  options: Options = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: ChangeRolePayload) =>
      updateProjectMemberRole(projectId, memberId, { role }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      await queryClient.refetchQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      await queryClient.invalidateQueries({
        queryKey: PROJECTS_QUERY_KEY,
      });
      toast.success('Role updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role.');
      options.onError?.(error);
    },
  });
}

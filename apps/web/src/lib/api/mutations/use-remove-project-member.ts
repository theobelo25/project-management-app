import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeProjectMember } from '@web/lib/api/client';
import {
  PROJECTS_QUERY_KEY,
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from '@web/lib/api/queries';

type UseRemoveProjectMemberOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useRemoveProjectMember(
  projectId: string,
  options: UseRemoveProjectMemberOptions = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeProjectMember(projectId, memberId),
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
      toast.success('Member removed successfully!');
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
      options.onError?.(error);
    },
  });
}

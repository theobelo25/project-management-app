import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addProjectMember } from '@web/lib/api/client';
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from '@web/lib/api/queries';
import type { AddProjectMemberDto } from '@repo/types';

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useAddProjectMember(projectId: string, options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddProjectMemberDto) => addProjectMember(projectId, dto),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      await queryClient.refetchQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success('Member added successfully!');
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add member.');
      options.onError?.(error);
    },
  });
}

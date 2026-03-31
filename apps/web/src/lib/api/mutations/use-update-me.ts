'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe } from '@web/lib/api/client';
import { ME_QUERY_KEY } from '@web/lib/api/queries';

export type UpdateMeInput = {
  name?: string;
  email?: string;
  themeMode?: 'light' | 'dark' | 'system';
  colorScheme?: 'default' | 'pastel-warm' | 'pastel-cool';
  password?: string;
  confirmPassword?: string;
};

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useUpdateMe(options: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateMeInput) => updateMe(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ME_QUERY_KEY,
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

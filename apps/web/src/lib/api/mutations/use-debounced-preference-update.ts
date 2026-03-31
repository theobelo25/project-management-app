'use client';

import * as React from 'react';
import { useUpdateMe, type UpdateMeInput } from './use-update-me';

type PreferenceUpdate = Pick<UpdateMeInput, 'themeMode' | 'colorScheme'>;

const DEFAULT_DEBOUNCE_MS = 400;

export function useDebouncedPreferenceUpdate(
  debounceMs: number = DEFAULT_DEBOUNCE_MS,
) {
  const updateMe = useUpdateMe();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = React.useRef<PreferenceUpdate>({});

  const queuePreferenceUpdate = React.useCallback(
    (next: PreferenceUpdate) => {
      pendingRef.current = { ...pendingRef.current, ...next };

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const payload = pendingRef.current;
        pendingRef.current = {};
        timeoutRef.current = null;
        if (Object.keys(payload).length > 0) {
          updateMe.mutate(payload);
        }
      }, debounceMs);
    },
    [debounceMs, updateMe],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { queuePreferenceUpdate };
}

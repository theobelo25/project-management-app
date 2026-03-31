'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  TASK_QUERY_KEY,
} from '@web/lib/api/queries';
import { getRealtimeSocket } from './socket';

type TaskEventPayload = {
  taskId?: string;
};

export function useProjectRealtime(projectId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;
    const socket = getRealtimeSocket();
    if (!socket) return;

    const invalidateProject = (payload?: TaskEventPayload) => {
      void queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      if (payload?.taskId) {
        void queryClient.invalidateQueries({
          queryKey: TASK_QUERY_KEY(payload.taskId),
        });
      }
    };

    const subscribe = () => {
      socket.emit('project.subscribe', { projectId });
    };

    if (socket.connected) {
      subscribe();
    }
    socket.on('connect', subscribe);
    socket.on('task.created', invalidateProject);
    socket.on('task.updated', invalidateProject);
    socket.on('task.deleted', invalidateProject);
    socket.on('task.assignee.added', invalidateProject);
    socket.on('task.assignee.removed', invalidateProject);

    return () => {
      socket.emit('project.unsubscribe', { projectId });
      socket.off('connect', subscribe);
      socket.off('task.created', invalidateProject);
      socket.off('task.updated', invalidateProject);
      socket.off('task.deleted', invalidateProject);
      socket.off('task.assignee.added', invalidateProject);
      socket.off('task.assignee.removed', invalidateProject);
    };
  }, [projectId, queryClient]);
}

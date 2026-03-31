'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMeQuery } from '@web/lib/api/queries';
import { getRealtimeSocket } from '@web/lib/realtime/socket';

export function RealtimeSetup() {
  const queryClient = useQueryClient();
  const { data: user } = useMeQuery();

  useEffect(() => {
    const socket = getRealtimeSocket();
    if (!socket || !user) return;

    const invalidateGlobal = () => {
      void queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['organizations', 'invites'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    };

    const onReconnect = () => {
      invalidateGlobal();
    };

    socket.on('connect', onReconnect);
    socket.on('notification.created', invalidateGlobal);
    socket.on('notification.cleared', invalidateGlobal);
    socket.on('invite.created', invalidateGlobal);
    socket.on('invite.accepted', invalidateGlobal);
    socket.on('invite.declined', invalidateGlobal);
    socket.on('invite.revoked', invalidateGlobal);
    socket.on('project.member.added', invalidateGlobal);
    socket.on('project.member.removed', invalidateGlobal);
    socket.on('project.member.role.updated', invalidateGlobal);
    socket.connect();

    return () => {
      socket.off('connect', onReconnect);
      socket.off('notification.created', invalidateGlobal);
      socket.off('notification.cleared', invalidateGlobal);
      socket.off('invite.created', invalidateGlobal);
      socket.off('invite.accepted', invalidateGlobal);
      socket.off('invite.declined', invalidateGlobal);
      socket.off('invite.revoked', invalidateGlobal);
      socket.off('project.member.added', invalidateGlobal);
      socket.off('project.member.removed', invalidateGlobal);
      socket.off('project.member.role.updated', invalidateGlobal);
      socket.disconnect();
    };
  }, [queryClient, user]);

  return null;
}

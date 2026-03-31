'use client';

import { io, type Socket } from 'socket.io-client';
import { getPublicApiBaseUrl } from '@web/lib/api/public-api-url';

let socket: Socket | null = null;

function isRealtimeEnabled(): boolean {
  return (process.env.NEXT_PUBLIC_REALTIME_ENABLED ?? '').trim() === 'true';
}

export function getRealtimeSocket(): Socket | null {
  if (!isRealtimeEnabled()) return null;
  if (socket) return socket;

  socket = io(`${getPublicApiBaseUrl()}/realtime`, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: false,
  });

  return socket;
}

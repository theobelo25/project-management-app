import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RealtimeSetup } from './realtime-setup';

type SocketHandler = (...args: unknown[]) => void;
type HandlerMap = Map<string, Set<SocketHandler>>;

function createMockSocket() {
  const handlers: HandlerMap = new Map();
  const socket = {
    connected: false,
    on: vi.fn((event: string, handler: SocketHandler) => {
      const set = handlers.get(event) ?? new Set<SocketHandler>();
      set.add(handler);
      handlers.set(event, set);
      return socket;
    }),
    off: vi.fn((event: string, handler: SocketHandler) => {
      handlers.get(event)?.delete(handler);
      return socket;
    }),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const trigger = (event: string, payload?: unknown) => {
    for (const handler of handlers.get(event) ?? []) {
      handler(payload);
    }
  };

  return { socket, trigger };
}

const useMeQueryMock = vi.fn();
const getRealtimeSocketMock = vi.fn();

vi.mock('@web/lib/api/queries', () => ({
  useMeQuery: () => useMeQueryMock(),
}));

vi.mock('@web/lib/realtime/socket', () => ({
  getRealtimeSocket: () => getRealtimeSocketMock(),
}));

describe('RealtimeSetup (integration)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('connects socket and invalidates key queries on realtime events', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { socket, trigger } = createMockSocket();

    useMeQueryMock.mockReturnValue({
      data: { id: 'user-1', orgId: 'org-1' },
    });
    getRealtimeSocketMock.mockReturnValue(socket);

    render(
      <QueryClientProvider client={queryClient}>
        <RealtimeSetup />
      </QueryClientProvider>,
    );

    expect(socket.connect).toHaveBeenCalledTimes(1);

    trigger('notification.created');

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['me'] });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['notifications'],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['organizations', 'invites'],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['projects'] });
    });
  });

  it('disconnects and unsubscribes listeners on unmount', () => {
    const queryClient = new QueryClient();
    const { socket } = createMockSocket();

    useMeQueryMock.mockReturnValue({
      data: { id: 'user-1', orgId: 'org-1' },
    });
    getRealtimeSocketMock.mockReturnValue(socket);

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <RealtimeSetup />
      </QueryClientProvider>,
    );

    unmount();

    expect(socket.off).toHaveBeenCalled();
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });
});

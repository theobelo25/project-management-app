import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useProjectRealtime } from './use-project-realtime';

type SocketHandler = (...args: unknown[]) => void;
type HandlerMap = Map<string, Set<SocketHandler>>;

function createMockSocket(connected = true) {
  const handlers: HandlerMap = new Map();
  const socket = {
    connected,
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
  };

  const trigger = (event: string, payload?: unknown) => {
    for (const handler of handlers.get(event) ?? []) {
      handler(payload);
    }
  };

  return { socket, trigger };
}

const { getRealtimeSocketMock } = vi.hoisted(() => ({
  getRealtimeSocketMock: vi.fn(),
}));

vi.mock('./socket', () => ({
  getRealtimeSocket: getRealtimeSocketMock,
}));

function ProjectRealtimeHarness({ projectId }: { projectId: string }) {
  useProjectRealtime(projectId);
  return null;
}

describe('useProjectRealtime (integration)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('subscribes to project room and invalidates project/task queries on events', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { socket, trigger } = createMockSocket(true);
    getRealtimeSocketMock.mockReturnValue(socket);

    const projectId = 'project-1';
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectRealtimeHarness projectId={projectId} />
      </QueryClientProvider>,
    );

    expect(socket.emit).toHaveBeenCalledWith('project.subscribe', {
      projectId,
    });

    trigger('task.updated', { taskId: 'task-123' });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['projects', projectId],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['projects', projectId, 'tasks'],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['projects', projectId, 'members'],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['tasks', 'task-123'],
      });
    });
  });

  it('unsubscribes from project room on cleanup', () => {
    const queryClient = new QueryClient();
    const { socket } = createMockSocket(true);
    getRealtimeSocketMock.mockReturnValue(socket);
    const projectId = 'project-1';

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <ProjectRealtimeHarness projectId={projectId} />
      </QueryClientProvider>,
    );

    unmount();
    expect(socket.emit).toHaveBeenCalledWith('project.unsubscribe', {
      projectId,
    });
    expect(socket.off).toHaveBeenCalled();
  });
});

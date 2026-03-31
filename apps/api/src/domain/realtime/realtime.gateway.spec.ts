import { WsException } from '@nestjs/websockets';
import { RealtimeGateway } from './realtime.gateway';

describe('RealtimeGateway', () => {
  const createGateway = () => {
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'APP_HOST') return '127.0.0.1';
        if (key === 'APP_PORT') return 3333;
        if (key === 'FRONTEND_ORIGIN') return 'http://localhost:3000';
        throw new Error(`Unexpected key ${key}`);
      }),
      get: jest.fn((key: string) =>
        key === 'REALTIME_ENABLED' ? true : undefined,
      ),
    };

    const authConfig = {
      cookies: { access: { name: 'Authentication' } },
      access: { secret: 'secret', issuer: 'issuer', audience: 'aud' },
    };

    const jwtService = { verifyAsync: jest.fn() };
    const authorizedUserForOrg = { fromTokenPayload: jest.fn() };
    const logger = { setContext: jest.fn(), debug: jest.fn(), warn: jest.fn() };
    const projectAuthRepository = { findAuthorizedById: jest.fn() };

    const gateway = new RealtimeGateway(
      configService as never,
      authConfig as never,
      jwtService as never,
      authorizedUserForOrg as never,
      logger as never,
      projectAuthRepository as never,
    );

    gateway.server = {
      to: jest.fn(() => ({ emit: jest.fn() })),
    } as never;

    return {
      gateway,
      projectAuthRepository,
      jwtService,
      authorizedUserForOrg,
    };
  };

  it('emits project events to project-scoped room', () => {
    const { gateway } = createGateway();
    const toSpy = gateway.server.to as unknown as jest.Mock;
    const roomEmitter = { emit: jest.fn() };
    toSpy.mockReturnValue(roomEmitter);

    gateway.emitToProject('project-1', 'task.updated', { taskId: 'task-1' });

    expect(toSpy).toHaveBeenCalledWith('project:project-1');
    expect(roomEmitter.emit).toHaveBeenCalledWith('task.updated', {
      taskId: 'task-1',
    });
  });

  it('rejects unauthorized project subscriptions', async () => {
    const { gateway, projectAuthRepository } = createGateway();
    const client = { id: 'socket-1' };

    // Seed connected user map
    (
      gateway as unknown as {
        connectedUsers: Map<string, { id: string; orgId: string }>;
      }
    ).connectedUsers.set('socket-1', { id: 'user-1', orgId: 'org-1' });

    projectAuthRepository.findAuthorizedById.mockResolvedValue(null);

    await expect(
      gateway.onProjectSubscribe(client as never, { projectId: 'project-1' }),
    ).rejects.toBeInstanceOf(WsException);
  });

  it('authenticates connection from cookie token and joins user/org rooms', async () => {
    const { gateway, jwtService, authorizedUserForOrg } = createGateway();
    const client = {
      id: 'socket-1',
      handshake: {
        headers: {
          cookie: 'Authentication=jwt-token; other=value',
        },
      },
      join: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', orgId: 'org-1' });
    authorizedUserForOrg.fromTokenPayload.mockResolvedValue({
      id: 'user-1',
      orgId: 'org-1',
    });

    await gateway.handleConnection(client as never);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('jwt-token', {
      secret: 'secret',
      issuer: 'issuer',
      audience: 'aud',
    });
    expect(client.join).toHaveBeenCalledWith('user:user-1');
    expect(client.join).toHaveBeenCalledWith('org:org-1');
    expect(client.emit).toHaveBeenCalledWith(
      'realtime.connected',
      expect.objectContaining({
        userId: 'user-1',
        orgId: 'org-1',
      }),
    );
    expect(client.disconnect).not.toHaveBeenCalled();
  });
});

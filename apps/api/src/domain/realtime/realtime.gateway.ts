import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthConfigService, getAppOptions } from '@api/config';
import { TokenPayload } from '@api/domain/auth/types/token-payload.interface';
import { AuthUser } from '@repo/types';
import { AuthorizedUserForOrgService } from '@api/domain/auth/authorized-user-for-org.service';
import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { realtimeRoom, REALTIME_EVENT } from './realtime.events';
import {
  PROJECT_AUTHORIZATION_REPOSITORY,
  type ProjectAuthorizationRepository,
} from '@api/domain/projects/repositories/ports/project-authorization.repository';

@Injectable()
@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server!: Server;

  private readonly connectedUsers = new Map<string, AuthUser>();

  constructor(
    private readonly configService: ConfigService,
    private readonly authConfig: AuthConfigService,
    private readonly jwtService: JwtService,
    private readonly authorizedUserForOrg: AuthorizedUserForOrgService,
    private readonly logger: PinoLogger,
    @Inject(PROJECT_AUTHORIZATION_REPOSITORY)
    private readonly projectAuthRepository: ProjectAuthorizationRepository,
  ) {
    this.logger.setContext(RealtimeGateway.name);
  }

  async handleConnection(client: Socket) {
    const appOpts = getAppOptions(this.configService);
    if (!appOpts.realtimeEnabled) {
      client.disconnect(true);
      return;
    }

    const user = await this.authenticateClient(client);
    if (!user) {
      client.disconnect(true);
      return;
    }

    this.connectedUsers.set(client.id, user);
    await client.join(realtimeRoom.user(user.id));
    await client.join(realtimeRoom.org(user.orgId));
    this.logger.debug(
      {
        event: 'realtime.connected',
        socketId: client.id,
        userId: user.id,
        orgId: user.orgId,
      },
      'Realtime client connected',
    );

    client.emit(REALTIME_EVENT.connected, {
      userId: user.id,
      orgId: user.orgId,
      emittedAt: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    this.logger.debug(
      {
        event: 'realtime.disconnected',
        socketId: client.id,
        userId: user?.id,
        orgId: user?.orgId,
      },
      'Realtime client disconnected',
    );
  }

  emitToUser(userId: string, event: string, payload: object) {
    this.server.to(realtimeRoom.user(userId)).emit(event, payload);
  }

  emitToOrg(orgId: string, event: string, payload: object) {
    this.server.to(realtimeRoom.org(orgId)).emit(event, payload);
  }

  emitToProject(projectId: string, event: string, payload: object) {
    this.server.to(realtimeRoom.project(projectId)).emit(event, payload);
  }

  emitToTask(taskId: string, event: string, payload: object) {
    this.server.to(realtimeRoom.task(taskId)).emit(event, payload);
  }

  @SubscribeMessage('project.subscribe')
  async onProjectSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { projectId?: string },
  ) {
    const user = this.connectedUsers.get(client.id);
    const projectId = body?.projectId?.trim();
    if (!user || !projectId) {
      throw new WsException('Invalid subscription request');
    }

    const project = await this.projectAuthRepository.findAuthorizedById(
      projectId,
      user.id,
      user.orgId,
    );
    if (!project) {
      throw new WsException('Forbidden');
    }

    await client.join(realtimeRoom.project(projectId));
    return { ok: true, projectId };
  }

  @SubscribeMessage('project.unsubscribe')
  async onProjectUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { projectId?: string },
  ) {
    const projectId = body?.projectId?.trim();
    if (!projectId) {
      throw new WsException('Invalid unsubscribe request');
    }

    await client.leave(realtimeRoom.project(projectId));
    return { ok: true, projectId };
  }

  private async authenticateClient(client: Socket): Promise<AuthUser | null> {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      const token = this.extractCookieValue(
        cookieHeader,
        this.authConfig.cookies.access.name,
      );
      if (!token) {
        return null;
      }

      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        token,
        {
          secret: this.authConfig.access.secret,
          issuer: this.authConfig.access.issuer,
          audience: this.authConfig.access.audience,
        },
      );
      return this.authorizedUserForOrg.fromTokenPayload(payload);
    } catch (error) {
      this.logger.warn(
        {
          event: 'realtime.auth.failed',
          socketId: client.id,
          error,
        },
        'Realtime client authentication failed',
      );
      return null;
    }
  }

  private extractCookieValue(
    cookieHeader: string | undefined,
    cookieName: string,
  ): string | null {
    if (!cookieHeader) return null;

    const parts = cookieHeader.split(';');
    for (const part of parts) {
      const [name, ...rest] = part.trim().split('=');
      if (name !== cookieName) continue;
      return decodeURIComponent(rest.join('='));
    }
    return null;
  }
}

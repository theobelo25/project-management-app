import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeEnvelope } from './realtime.events';

@Injectable()
export class RealtimePublisher {
  constructor(private readonly gateway: RealtimeGateway) {}

  toUser<TPayload extends object>(
    userId: string,
    event: string,
    payload: TPayload,
  ) {
    this.gateway.emitToUser(userId, event, this.withEnvelope(payload));
  }

  toOrg<TPayload extends object>(orgId: string, event: string, payload: TPayload) {
    this.gateway.emitToOrg(orgId, event, this.withEnvelope(payload));
  }

  toProject<TPayload extends object>(
    projectId: string,
    event: string,
    payload: TPayload,
  ) {
    this.gateway.emitToProject(projectId, event, this.withEnvelope(payload));
  }

  toTask<TPayload extends object>(taskId: string, event: string, payload: TPayload) {
    this.gateway.emitToTask(taskId, event, this.withEnvelope(payload));
  }

  private withEnvelope<TPayload extends object>(
    payload: TPayload,
  ): RealtimeEnvelope<TPayload> {
    return {
      ...payload,
      emittedAt: new Date().toISOString(),
    };
  }
}

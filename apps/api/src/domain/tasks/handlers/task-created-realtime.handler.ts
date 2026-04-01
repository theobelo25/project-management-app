import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RealtimePublisher } from '../../realtime/realtime.publisher';
import { REALTIME_EVENT } from '../../realtime/realtime.events';
import { TASK_DOMAIN_EVENT_NAME } from '../events/task-domain-event-names';
import type { TaskCreatedEvent } from '../events/task-domain.events';

@Injectable()
export class TaskCreatedRealtimeHandler {
  constructor(private readonly realtimePublisher: RealtimePublisher) {}

  @OnEvent(TASK_DOMAIN_EVENT_NAME.TaskCreated)
  handle(event: TaskCreatedEvent): void {
    this.realtimePublisher.toProject(
      event.projectId,
      REALTIME_EVENT.taskCreated,
      {
        taskId: event.taskId,
        projectId: event.projectId,
        updatedById: event.createdById,
        changedFields: ['created'],
      },
    );
  }
}

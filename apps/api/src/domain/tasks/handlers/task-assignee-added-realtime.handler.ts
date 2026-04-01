import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RealtimePublisher } from '../../realtime/realtime.publisher';
import { REALTIME_EVENT } from '../../realtime/realtime.events';
import { TASK_DOMAIN_EVENT_NAME } from '../events/task-domain-event-names';
import type { TaskAssigneeAddedEvent } from '../events/task-domain.events';

@Injectable()
export class TaskAssigneeAddedRealtimeHandler {
  constructor(private readonly realtimePublisher: RealtimePublisher) {}

  @OnEvent(TASK_DOMAIN_EVENT_NAME.TaskAssigneeAdded)
  handle(event: TaskAssigneeAddedEvent): void {
    const payload = {
      taskId: event.taskId,
      projectId: event.projectId,
      assigneeUserId: event.assigneeUserId,
      updatedById: event.updatedById,
      changedFields: ['assignees'] as const,
    };

    this.realtimePublisher.toProject(
      event.projectId,
      REALTIME_EVENT.taskAssigneeAdded,
      payload,
    );
    this.realtimePublisher.toTask(
      event.taskId,
      REALTIME_EVENT.taskAssigneeAdded,
      payload,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import type { TaskDomainEvent } from './task-domain.events';
import { TASK_DOMAIN_EVENT_NAME } from './task-domain-event-names';

/**
 * Application-layer port: publishes domain-shaped events after durable state changes.
 * Dispatches asynchronously so HTTP handlers are not blocked on notification/realtime listeners;
 * listener failures are logged and do not fail the request.
 */
@Injectable()
export class TaskDomainEventPublisher {
  constructor(
    private readonly emitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskDomainEventPublisher.name);
  }

  publish(event: TaskDomainEvent): void {
    void this.emitAllAsync(event).catch((err: unknown) => {
      this.logger.error(
        { err, eventTag: event._tag },
        'Task domain event listener failed',
      );
    });
  }

  private async emitAllAsync(event: TaskDomainEvent): Promise<void> {
    switch (event._tag) {
      case 'TaskCreated':
        await this.emitter.emitAsync(TASK_DOMAIN_EVENT_NAME.TaskCreated, event);
        return;
      case 'TaskUpdated':
        await this.emitter.emitAsync(TASK_DOMAIN_EVENT_NAME.TaskUpdated, event);
        return;
      case 'TaskDeleted':
        await this.emitter.emitAsync(TASK_DOMAIN_EVENT_NAME.TaskDeleted, event);
        return;
      case 'TaskAssigneeAdded':
        await this.emitter.emitAsync(
          TASK_DOMAIN_EVENT_NAME.TaskAssigneeAdded,
          event,
        );
        return;
      case 'TaskAssigneeRemoved':
        await this.emitter.emitAsync(
          TASK_DOMAIN_EVENT_NAME.TaskAssigneeRemoved,
          event,
        );
        return;
    }
  }
}

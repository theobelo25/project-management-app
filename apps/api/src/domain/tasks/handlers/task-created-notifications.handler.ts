import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { TASK_DOMAIN_EVENT_NAME } from '../events/task-domain-event-names';
import type { TaskCreatedEvent } from '../events/task-domain.events';
import { TaskAssignmentNotifier } from '../notifiers/task-assignment-notifier';

const LOG_CTX = {
  domain: 'tasks',
  component: 'TaskCreatedNotificationsHandler',
} as const;

@Injectable()
export class TaskCreatedNotificationsHandler {
  constructor(
    private readonly taskAssignmentNotifier: TaskAssignmentNotifier,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskCreatedNotificationsHandler.name);
  }

  @OnEvent(TASK_DOMAIN_EVENT_NAME.TaskCreated)
  async handle(event: TaskCreatedEvent): Promise<void> {
    for (const userId of event.assigneeUserIdsToNotify) {
      try {
        await this.taskAssignmentNotifier.notifyTaskAssigned(userId, {
          taskId: event.taskId,
          taskTitle: event.taskTitle,
          projectId: event.projectId,
          assignedById: event.createdById,
        });
      } catch (err) {
        this.logger.warn(
          {
            ...LOG_CTX,
            event: 'task.created.assignee_notification_failed',
            taskId: event.taskId,
            userId,
            createdById: event.createdById,
            err,
          },
          'Failed to notify task assignee on create',
        );
      }
    }
  }
}

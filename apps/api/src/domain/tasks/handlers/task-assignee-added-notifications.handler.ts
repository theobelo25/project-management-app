import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { TASK_DOMAIN_EVENT_NAME } from '../events/task-domain-event-names';
import type { TaskAssigneeAddedEvent } from '../events/task-domain.events';
import { TaskAssignmentNotifier } from '../notifiers/task-assignment-notifier';

const LOG_CTX = {
  domain: 'tasks',
  component: 'TaskAssigneeAddedNotificationsHandler',
} as const;

@Injectable()
export class TaskAssigneeAddedNotificationsHandler {
  constructor(
    private readonly taskAssignmentNotifier: TaskAssignmentNotifier,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskAssigneeAddedNotificationsHandler.name);
  }

  @OnEvent(TASK_DOMAIN_EVENT_NAME.TaskAssigneeAdded)
  async handle(event: TaskAssigneeAddedEvent): Promise<void> {
    if (!event.notifyAssignee) return;

    try {
      await this.taskAssignmentNotifier.notifyTaskAssigned(
        event.assigneeUserId,
        {
          taskId: event.taskId,
          taskTitle: event.taskTitle,
          projectId: event.projectId,
          assignedById: event.updatedById,
        },
      );
    } catch (err) {
      this.logger.warn(
        {
          ...LOG_CTX,
          event: 'task.assignee.notification_failed',
          taskId: event.taskId,
          userId: event.assigneeUserId,
          updatedById: event.updatedById,
          err,
        },
        'Failed to notify task assignee',
      );
    }
  }
}

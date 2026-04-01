import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { TASK_DOMAIN_EVENT_NAME } from '../events/task-domain-event-names';
import type { TaskUpdatedEvent } from '../events/task-domain.events';
import { TASK_UPDATE_FIELD_LABELS } from '../events/task-update-field-labels';
import { TaskAssignmentNotifier } from '../notifiers/task-assignment-notifier';
import {
  PROJECT_MEMBER_REPOSITORY,
  type ProjectMemberRepository,
} from '../../projects/repositories/projects.repository';

const LOG_CTX = {
  domain: 'tasks',
  component: 'TaskUpdatedNotificationsHandler',
} as const;

@Injectable()
export class TaskUpdatedNotificationsHandler {
  constructor(
    private readonly taskAssignmentNotifier: TaskAssignmentNotifier,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMembersRepository: ProjectMemberRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskUpdatedNotificationsHandler.name);
  }

  @OnEvent(TASK_DOMAIN_EVENT_NAME.TaskUpdated)
  async handle(event: TaskUpdatedEvent): Promise<void> {
    const members = await this.projectMembersRepository.findMembersByProjectId(
      event.projectId,
    );

    const changedLabels = event.changedFieldKeys.map(
      (field) => TASK_UPDATE_FIELD_LABELS[field] ?? field,
    );

    for (const member of members) {
      if (member.userId === event.updatedById) continue;
      try {
        await this.taskAssignmentNotifier.notifyTaskUpdated(member.userId, {
          taskId: event.taskId,
          taskTitle: event.taskTitle,
          projectId: event.projectId,
          updatedById: event.updatedById,
          changedFields: changedLabels,
        });
      } catch (err) {
        this.logger.warn(
          {
            ...LOG_CTX,
            event: 'task.updated.assignee_notification_failed',
            taskId: event.taskId,
            userId: member.userId,
            updatedById: event.updatedById,
            err,
          },
          'Failed to notify project member on task update',
        );
      }
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';
import { NotificationView } from '@repo/types';
import type { Prisma } from '@repo/database';
import { TaskAssignedNotificationPayload } from './notifications.payloads';
import { TaskUpdatedNotificationPayload } from './notifications.payloads';
import { ProjectMemberAddedNotificationPayload } from './notifications.payloads';
import { ProjectMemberRemovedNotificationPayload } from './notifications.payloads';
import { ProjectMemberRoleChangedNotificationPayload } from './notifications.payloads';
import { toNotificationViews } from './mappers/notification.mapper';
import { NOTIFICATION_TEMPLATES } from './notifications.templates';
import { RealtimePublisher } from '../realtime/realtime.publisher';
import { REALTIME_EVENT } from '../realtime/realtime.events';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly realtimePublisher: RealtimePublisher,
  ) {}

  async listForUser(userId: string): Promise<NotificationView[]> {
    const rows = await this.notificationsRepository.findActiveByUserId(userId);

    return toNotificationViews(rows);
  }

  async clearForUser(userId: string, notificationId: string): Promise<void> {
    const clearedCount = await this.notificationsRepository.clear(
      notificationId,
      userId,
    );

    if (clearedCount === 0) {
      throw new NotFoundException('Notification not found');
    }

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCleared, {
      notificationId,
      userId,
    });
  }

  async notifyTaskAssigned(
    userId: string,
    payload: TaskAssignedNotificationPayload,
  ): Promise<void> {
    const created = await this.notificationsRepository.create({
      userId,
      type: 'task_assigned',
      title: NOTIFICATION_TEMPLATES.task_assigned.title,
      body: NOTIFICATION_TEMPLATES.task_assigned.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCreated, {
      notificationId: created.id,
      userId,
      type: created.type,
      title: created.title,
      body: created.body,
      projectId: payload.projectId,
      taskId: payload.taskId,
    });
  }

  async notifyTaskUpdated(
    userId: string,
    payload: TaskUpdatedNotificationPayload,
  ): Promise<void> {
    const created = await this.notificationsRepository.create({
      userId,
      type: 'task_updated',
      title: NOTIFICATION_TEMPLATES.task_updated.title,
      body: NOTIFICATION_TEMPLATES.task_updated.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCreated, {
      notificationId: created.id,
      userId,
      type: created.type,
      title: created.title,
      body: created.body,
      projectId: payload.projectId,
      taskId: payload.taskId,
    });
  }

  async notifyProjectMemberAdded(
    userId: string,
    payload: ProjectMemberAddedNotificationPayload,
  ): Promise<void> {
    const created = await this.notificationsRepository.create({
      userId,
      type: 'project_member_added',
      title: NOTIFICATION_TEMPLATES.project_member_added.title,
      body: NOTIFICATION_TEMPLATES.project_member_added.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCreated, {
      notificationId: created.id,
      userId,
      type: created.type,
      title: created.title,
      body: created.body,
      projectId: payload.projectId,
    });
  }

  async notifyProjectMemberRemoved(
    userId: string,
    payload: ProjectMemberRemovedNotificationPayload,
  ): Promise<void> {
    const created = await this.notificationsRepository.create({
      userId,
      type: 'project_member_removed',
      title: NOTIFICATION_TEMPLATES.project_member_removed.title,
      body: NOTIFICATION_TEMPLATES.project_member_removed.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCreated, {
      notificationId: created.id,
      userId,
      type: created.type,
      title: created.title,
      body: created.body,
      projectId: payload.projectId,
    });
  }

  async notifyProjectMemberRoleChanged(
    userId: string,
    payload: ProjectMemberRoleChangedNotificationPayload,
  ): Promise<void> {
    const created = await this.notificationsRepository.create({
      userId,
      type: 'project_member_role_changed',
      title: NOTIFICATION_TEMPLATES.project_member_role_changed.title,
      body: NOTIFICATION_TEMPLATES.project_member_role_changed.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });

    this.realtimePublisher.toUser(userId, REALTIME_EVENT.notificationCreated, {
      notificationId: created.id,
      userId,
      type: created.type,
      title: created.title,
      body: created.body,
      projectId: payload.projectId,
    });
  }
}

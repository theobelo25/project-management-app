import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';
import { NotificationView } from '@repo/types';
import type { Prisma } from '@repo/database';
import { TaskAssignedNotificationPayload } from './notifications.payloads';
import { toNotificationViews } from './mappers/notification.mapper';
import { NOTIFICATION_TEMPLATES } from './notifications.templates';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async listForUser(userId: string): Promise<NotificationView[]> {
    const rows = await this.notificationsRepository.findActiveByUserId(userId);

    return toNotificationViews(rows);
  }

  async clearForUser(userId: string, notificationId: string): Promise<boolean> {
    const clearedCount = await this.notificationsRepository.clear(
      notificationId,
      userId,
    );

    return clearedCount > 0;
  }

  async notifyTaskAssigned(
    userId: string,
    payload: TaskAssignedNotificationPayload,
  ): Promise<void> {
    await this.notificationsRepository.create({
      userId,
      type: 'task_assigned',
      title: NOTIFICATION_TEMPLATES.task_assigned.title,
      body: NOTIFICATION_TEMPLATES.task_assigned.getBody(payload),
      meta: payload as Prisma.InputJsonValue,
    });
  }
}

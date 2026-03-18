import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';
import { Db } from '@api/prisma';
import { NotificationView } from '@repo/types';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async listForUser(userId: string, db?: Db): Promise<NotificationView[]> {
    const rows = await this.notificationsRepository.findActiveByUserId(
      userId,
      db,
    );
    return rows.map((n) => ({
      id: n.id,
      type: n.type as any,
      title: n.title,
      body: n.body,
      meta: (n.meta as any) ?? null,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  async clearForUser(
    userId: string,
    notificationId: string,
    db?: Db,
  ): Promise<void> {
    await this.notificationsRepository.clear(notificationId, userId, db);
  }

  async notifyTaskAssigned(
    userId: string,
    payload: {
      taskId: string;
      taskTitle: string;
      projectId: string;
      assignedById: string;
    },
    db?: Db,
  ): Promise<void> {
    await this.notificationsRepository.create(
      {
        userId,
        type: 'task_assigned',
        title: 'You were assigned a task',
        body: payload.taskTitle,
        meta: payload,
      },
      db,
    );
  }
}

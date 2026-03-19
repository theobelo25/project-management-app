import { Inject, Injectable } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import {
  CreateNotificationInput,
  NotificationRecord,
  NotificationsRepository,
} from './notifications.repository';
import { isNotificationType } from '../utils/notification-type-guard';

@Injectable()
export class PrismaNotificationsRepository extends NotificationsRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async create(
    input: CreateNotificationInput,
    db?: Db,
  ): Promise<NotificationRecord> {
    const prisma = db ?? this.prisma;

    const row = await prisma.userNotification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        meta: input.meta ?? undefined,
      },
    });

    if (!isNotificationType(row.type)) {
      // Data corruption / unexpected DB value
      throw new Error(`Unknown notification type: ${row.type}`);
    }

    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      title: row.title,
      body: row.body,
      meta: row.meta,
      createdAt: row.createdAt,
      clearedAt: row.clearedAt,
    };
  }

  async findActiveByUserId(
    userId: string,
    db?: Db,
  ): Promise<NotificationRecord[]> {
    const prisma = db ?? this.prisma;

    const rows = await prisma.userNotification.findMany({
      where: { userId, clearedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return rows.map((row) => {
      if (!isNotificationType(row.type)) {
        throw new Error(`Unknown notification type: ${row.type}`);
      }

      return {
        id: row.id,
        userId: row.userId,
        type: row.type,
        title: row.title,
        body: row.body,
        meta: row.meta,
        createdAt: row.createdAt,
        clearedAt: row.clearedAt,
      };
    });
  }

  async clear(
    notificationId: string,
    userId: string,
    db?: Db,
  ): Promise<number> {
    const prisma = db ?? this.prisma;

    const result = await prisma.userNotification.updateMany({
      where: { id: notificationId, userId, clearedAt: null },
      data: { clearedAt: new Date() },
    });

    return result.count;
  }
}

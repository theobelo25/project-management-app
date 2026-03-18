import { Inject, Injectable } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import {
  CreateNotificationInput,
  NotificationRecord,
  NotificationsRepository,
} from './notifications.repository';

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
        meta: (input.meta as any) ?? null,
      },
    });

    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      title: row.title,
      body: row.body,
      meta: row.meta as unknown,
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

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      type: row.type,
      title: row.title,
      body: row.body,
      meta: row.meta as unknown,
      createdAt: row.createdAt,
      clearedAt: row.clearedAt,
    }));
  }

  async clear(notificationId: string, userId: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;
    await prisma.userNotification.updateMany({
      where: { id: notificationId, userId, clearedAt: null },
      data: { clearedAt: new Date() },
    });
  }
}

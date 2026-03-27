import type { Prisma } from '@repo/database';
import type { NotificationType } from '@repo/types';
import { Db } from '@api/prisma';

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  meta?: Prisma.InputJsonValue;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  meta: Prisma.JsonValue | null;
  createdAt: Date;
  clearedAt: Date | null;
};

export abstract class NotificationsRepository {
  abstract create(
    input: CreateNotificationInput,
    db?: Db,
  ): Promise<NotificationRecord>;

  abstract findActiveByUserId(
    userId: string,
    db?: Db,
  ): Promise<NotificationRecord[]>;

  abstract clear(
    notificationId: string,
    userId: string,
    db?: Db,
  ): Promise<number>;
}

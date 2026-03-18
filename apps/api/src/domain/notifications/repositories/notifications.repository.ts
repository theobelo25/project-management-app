import { Db } from '@api/prisma';

export type CreateNotificationInput = {
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  meta?: unknown | null;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  meta: unknown | null;
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
  ): Promise<void>;
}

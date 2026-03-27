import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../../notifications/notifications.service';
import { TaskAssignedNotificationPayload } from '../../notifications/notifications.payloads';

@Injectable()
export class TaskAssignmentNotifier {
  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyTaskAssigned(
    userId: string,
    payload: TaskAssignedNotificationPayload,
  ): Promise<void> {
    await this.notificationsService.notifyTaskAssigned(userId, payload);
  }
}

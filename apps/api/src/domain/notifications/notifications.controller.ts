import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import {
  AuthUser,
  ClearNotificationResponse,
  NotificationView,
} from '@repo/types';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser): Promise<NotificationView[]> {
    return this.notificationsService.listForUser(user.id);
  }

  @Post(':id/clear')
  async clear(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<ClearNotificationResponse> {
    await this.notificationsService.clearForUser(user.id, id);
    return { success: true };
  }
}

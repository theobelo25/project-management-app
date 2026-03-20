import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@api/common';
import { AuthUser, NotificationView } from '@repo/types';
import { NotificationIdParamDto } from './dto/notification-id-param.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser): Promise<NotificationView[]> {
    return this.notificationsService.listForUser(user.id);
  }

  @Post(':id/clear')
  @HttpCode(204)
  async clear(
    @CurrentUser() user: AuthUser,
    @Param() params: NotificationIdParamDto,
  ): Promise<void> {
    await this.notificationsService.clearForUser(user.id, params.id);
  }
}

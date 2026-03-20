import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import { AuthUser, NotificationView } from '@repo/types';
import { NotificationIdParamDto } from './dto/notification-id-param.dto';
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
  @HttpCode(204)
  async clear(
    @CurrentUser() user: AuthUser,
    @Param() params: NotificationIdParamDto,
  ): Promise<void> {
    const cleared = await this.notificationsService.clearForUser(
      user.id,
      params.id,
    );

    if (!cleared) throw new NotFoundException('Notification not found');
  }
}

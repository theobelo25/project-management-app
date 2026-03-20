import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { CurrentUser } from '@api/common';
import { AuthUser, NotificationView } from '@repo/types';
import { NotificationIdParamDto } from './dto/notification-id-param.dto';
import { NotificationsService } from './notifications.service';
import { NotificationListResponseDto } from '@api/common/swagger/response-dtos';

@ApiTags('notifications')
@ApiCookieAuth('Authentication')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ZodSerializerDto(NotificationListResponseDto)
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

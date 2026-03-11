import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  CurrentUser,
  JwtAuthGuard,
  PaginationQueryDto,
  PaginationResult,
} from '@api/common';
import { AuthUser, TaskView } from '@repo/types';
import { TaskAssignee } from 'packages/database/dist/src';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateTaskDto,
  ): Promise<TaskView> {
    return this.tasksService.create(user.id, body);
  }

  @Get(':taskId')
  async findById(@Param('taskId') taskId: string): Promise<TaskView> {
    return this.tasksService.findById(taskId);
  }

  @Get()
  async findMany(
    @Query() query: PaginationQueryDto,
    @Query('projectId') projectId: string,
  ): Promise<PaginationResult<TaskView>> {
    return this.tasksService.findMany({
      projectId,
      ...query,
    });
  }

  @Delete('id')
  async delete(@Param() taskId: string) {
    await this.tasksService.delete(taskId);
  }

  @Post(':taskId/assignees/:userId')
  async assignUser(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<TaskAssignee> {
    return this.tasksService.assignUser(taskId, userId);
  }

  @Delete(':taskId/assignees/:userId')
  async unassignUser(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.tasksService.unassignUser(taskId, userId);
  }
}

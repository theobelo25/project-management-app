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
import { CurrentUser, JwtAuthGuard } from '@api/common';
import {
  AuthUser,
  TaskView,
  PaginationResult,
  TaskAssignmentView,
} from '@repo/types';
import { TaskIdParamDto } from './dto/task-id-param.dto';
import { TaskAssigneeParamsDto } from './dto/task-assignee-params.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';

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
  async findById(@Param() params: TaskIdParamDto): Promise<TaskView> {
    return this.tasksService.findById(params.taskId);
  }

  @Get()
  async findMany(
    @Query() query: FindTasksQueryDto,
  ): Promise<PaginationResult<TaskView>> {
    return this.tasksService.findMany(query);
  }

  @Delete('id')
  async delete(@Param() params: TaskIdParamDto): Promise<void> {
    await this.tasksService.delete(params.taskId);
  }

  @Post(':taskId/assignees/:userId')
  async assignUser(
    @Param() params: TaskAssigneeParamsDto,
  ): Promise<TaskAssignmentView> {
    return this.tasksService.assignUser(params.taskId, params.userId);
  }

  @Delete(':taskId/assignees/:userId')
  async unassignUser(@Param() params: TaskAssigneeParamsDto): Promise<void> {
    await this.tasksService.unassignUser(params.taskId, params.userId);
  }
}

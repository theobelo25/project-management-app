import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
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
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateTaskDto,
  ): Promise<TaskView> {
    return this.tasksService.create(user.id, body);
  }

  @Get(':taskId')
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
  ): Promise<TaskView> {
    return this.tasksService.findById(params.taskId, user.id);
  }

  @Get()
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: FindTasksQueryDto,
  ): Promise<PaginationResult<TaskView>> {
    return this.tasksService.findMany(user.id, query);
  }

  @Patch(':taskId')
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskView> {
    return this.tasksService.update(params.taskId, user.id, body);
  }

  @Delete(':taskId')
  @HttpCode(204)
  async delete(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
  ): Promise<void> {
    await this.tasksService.delete(params.taskId, user.id);
  }

  @Post(':taskId/assignees/:userId')
  async assignUser(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskAssigneeParamsDto,
  ): Promise<TaskAssignmentView> {
    return this.tasksService.assignUser(params.taskId, params.userId, user.id);
  }

  @Delete(':taskId/assignees/:userId')
  @HttpCode(204)
  async unassignUser(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskAssigneeParamsDto,
  ): Promise<void> {
    await this.tasksService.unassignUser(params.taskId, params.userId, user.id);
  }
}

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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { TasksService } from './tasks.service';
import {
  toCreateTaskCommand,
  toFindTasksQueryCommand,
  toUpdateTaskCommand,
} from './application/task-http.mapper';
import { CreateTaskDto } from './dto/create-task.dto';
import { CurrentUser } from '@api/common';
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
import { TaskAccessGuard } from './guards/task-access.guard';
import { RequireTaskAccess } from './decorators/require-task-access.decorator';
import { Throttle } from '@nestjs/throttler';
import {
  TaskAssignmentResponseDto,
  TaskViewResponseDto,
} from '@api/common/swagger/response-dtos';

/**
 * Tasks HTTP API
 *
 * HTTP semantics (high level):
 * - `GET /tasks` — list tasks for a project (requires `projectId` query); **safe**, **idempotent**.
 * - `GET /tasks/:taskId` — fetch one task; **safe**, **idempotent**.
 * - `POST /tasks` — create task; **not idempotent** unless you add a client idempotency key (not implemented here).
 * - `PATCH /tasks/:taskId` — partial update; **not idempotent** in general (depends on body).
 * - `DELETE /tasks/:taskId` — delete task; **idempotent** (repeat delete → 404 or no-op depending on error mapping).
 * - `POST /tasks/:taskId/assignees/:userId` — add assignee; **idempotent** (duplicate assign → 200 with existing row semantics via repo).
 * - `DELETE /tasks/:taskId/assignees/:userId` — remove assignee; **idempotent** (repeat → 204, no-op at DB).
 *
 * Route order: static/collection routes before `:taskId` to avoid future foot-guns when adding paths like `export`.
 */

@Throttle({ global: { ttl: 60_000, limit: 60 } })
@Controller('tasks')
@ApiTags('tasks')
@ApiCookieAuth('Authentication')
@UseGuards(TaskAccessGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @RequireTaskAccess('createInProject')
  @ZodSerializerDto(TaskViewResponseDto)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateTaskDto,
  ): Promise<TaskView> {
    return this.tasksService.create(user, toCreateTaskCommand(body));
  }

  /**
   * List tasks in a project (pagination + filters via query).
   * 200 + JSON body.
   */
  @Get()
  @RequireTaskAccess('readProject')
  async findMany(
    @CurrentUser() user: AuthUser,
    @Query() query: FindTasksQueryDto,
  ): Promise<PaginationResult<TaskView>> {
    return this.tasksService.findMany(user, toFindTasksQueryCommand(query));
  }

  /**
   * Get a single task by id.
   * 200 + JSON body.
   */
  @Get(':taskId')
  @RequireTaskAccess('readTask')
  @ZodSerializerDto(TaskViewResponseDto)
  async findById(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
  ): Promise<TaskView> {
    return this.tasksService.findById(params.taskId, user);
  }

  @Patch(':taskId')
  @RequireTaskAccess('updateTask')
  @ZodSerializerDto(TaskViewResponseDto)
  async update(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskView> {
    return this.tasksService.update(
      params.taskId,
      user,
      toUpdateTaskCommand(body),
    );
  }

  /**
   * Delete task.
   * 204 No Content on success.
   */
  @Delete(':taskId')
  @HttpCode(204)
  @RequireTaskAccess('deleteTask')
  async delete(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskIdParamDto,
  ): Promise<void> {
    await this.tasksService.delete(params.taskId, user);
  }

  /**
   * Assign a user to a task.
   * 200 + assignment view. Idempotent at persistence layer (unique constraint + recovery).
   */
  @Post(':taskId/assignees/:userId')
  @RequireTaskAccess('assignTask')
  @ZodSerializerDto(TaskAssignmentResponseDto)
  async assignUser(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskAssigneeParamsDto,
  ): Promise<TaskAssignmentView> {
    return this.tasksService.assignUser(params.taskId, params.userId, user);
  }

  /**
   * Unassign a user from a task.
   * 204 No Content. Idempotent (second delete is a no-op).
   */
  @Delete(':taskId/assignees/:userId')
  @HttpCode(204)
  @RequireTaskAccess('unassignTask')
  async unassignUser(
    @CurrentUser() user: AuthUser,
    @Param() params: TaskAssigneeParamsDto,
  ): Promise<void> {
    await this.tasksService.unassignUser(params.taskId, params.userId, user);
  }
}

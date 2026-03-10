import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import { AuthUser } from '@repo/types';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async create(@CurrentUser() user: AuthUser, @Body() body: CreateTaskDto) {
    this.tasksService.create(user.id, body);
  }
}

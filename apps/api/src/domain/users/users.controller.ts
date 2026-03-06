import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, CreateUserInputSchema } from '@repo/types';
import { ZodBody } from '@api/common/decorators/zod-body.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@ZodBody(CreateUserInputSchema) body: CreateUserInput) {
    return this.usersService.create(body);
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findById(id);
  }
}

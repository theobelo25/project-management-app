import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserView } from '@repo/types';
import { CurrentUser } from '@api/common/';
import { JwtAuthGuard } from '@api/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: UserView) {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findById(id);
  }
}

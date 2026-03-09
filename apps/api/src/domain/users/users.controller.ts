import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@api/common';
import { UserIdParamDto } from './dto/user-id-param.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async findById(@Param() params: UserIdParamDto) {
    const user = await this.usersService.findById(params.id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}

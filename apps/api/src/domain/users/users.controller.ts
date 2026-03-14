import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@api/common';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { GetUsersQueryDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query.search);
  }

  @Get(':id')
  async findById(@Param() params: UserIdParamDto) {
    const user = await this.usersService.findById(params.id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}

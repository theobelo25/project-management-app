import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, JwtAuthGuard } from '@api/common';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { GetUsersQueryDto } from './dto';
import { AuthUser } from '@repo/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @CurrentUser() user: AuthUser,
    @Query() query: GetUsersQueryDto,
  ) {
    return this.usersService.getUsersForOrg(user.orgId, query.search);
  }

  @Get(':id')
  async findById(@Param() params: UserIdParamDto) {
    const user = await this.usersService.findById(params.id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '@api/common';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { GetUsersQueryDto, GlobalUsersSearchQueryDto } from './dto';
import { AuthUser, UserView } from '@repo/types';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @CurrentUser() user: AuthUser,
    @Query() query: GetUsersQueryDto,
  ): Promise<UserView[]> {
    return this.usersService.getUsersForOrg(user.orgId, query.search);
  }

  @Get('search')
  @Throttle({ global: { ttl: 60_000, limit: 30 } })
  async searchAllUsers(
    @Query() query: GlobalUsersSearchQueryDto,
  ): Promise<UserView[]> {
    return this.usersService.searchUsers(query.search);
  }

  @Get(':id')
  async findById(@Param() params: UserIdParamDto): Promise<UserView> {
    return this.usersService.requireById(params.id);
  }
}

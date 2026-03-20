import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { UsersService } from './users.service';
import { CurrentUser } from '@api/common';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { GetUsersQueryDto, GlobalUsersSearchQueryDto } from './dto';
import { AuthUser, UserView } from '@repo/types';
import { Throttle } from '@nestjs/throttler';
import {
  UserViewListResponseDto,
  UserViewResponseDto,
} from '@api/common/swagger/response-dtos';

@Controller('users')
@ApiTags('users')
@ApiCookieAuth('Authentication')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ZodSerializerDto(UserViewListResponseDto)
  async getUsers(
    @CurrentUser() user: AuthUser,
    @Query() query: GetUsersQueryDto,
  ): Promise<UserView[]> {
    return this.usersService.getUsersForOrg(user.orgId, query.search);
  }

  @Get('search')
  @Throttle({ global: { ttl: 60_000, limit: 30 } })
  @ZodSerializerDto(UserViewListResponseDto)
  async searchAllUsers(
    @Query() query: GlobalUsersSearchQueryDto,
  ): Promise<UserView[]> {
    return this.usersService.searchUsers(query.search);
  }

  @Get(':id')
  @ZodSerializerDto(UserViewResponseDto)
  async findById(@Param() params: UserIdParamDto): Promise<UserView> {
    return this.usersService.requireById(params.id);
  }
}

import { Module } from '@nestjs/common';
import { USERS_REPOSITORY } from './types/users.tokens';
import { PrismaUsersRepository } from './repositories/prisma-users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_REPOSITORY, useClass: PrismaUsersRepository },
  ],
  exports: [UsersService, USERS_REPOSITORY],
})
export class UsersModule {}

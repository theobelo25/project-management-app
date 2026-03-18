import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { Db } from '@api/prisma';
import {
  CreateUserDto,
  PrivateUser,
  UpdateUserInputDto,
  UserView,
} from '@repo/types';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {}

  async create(createUserDto: CreateUserDto, db?: Db): Promise<UserView> {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
      db,
    );
    if (existing) {
      this.logger.warn(
        { email: createUserDto.email },
        'User creation rejected because email is already in use',
      );
      throw new ConflictException('User already exists');
    }

    const user = await this.usersRepository.create(createUserDto, db);
    this.logger.info({ userId: user.id }, 'User created successfully');

    return user;
  }

  async update(
    id: string,
    data: UpdateUserInputDto,
    db?: Db,
  ): Promise<UserView> {
    const user = await this.usersRepository.update(id, data, db);
    this.logger.info({ userId: id }, 'User updated successfully');
    return user;
  }

  async findById(id: string, db?: Db): Promise<UserView | null> {
    return this.usersRepository.findById(id, db);
  }

  async findPrivateUserById(id: string, db?: Db): Promise<PrivateUser | null> {
    return this.usersRepository.findPrivateUserById(id, db);
  }

  async findPrivateUserByEmail(
    email: string,
    db?: Db,
  ): Promise<PrivateUser | null> {
    return this.usersRepository.findPrivateUserByEmail(email, db);
  }

  async getUsersForOrg(
    orgId: string,
    search?: string,
    db?: Db,
  ): Promise<UserView[]> {
    if (search?.trim()) {
      return this.usersRepository.searchUsersByOrgId(orgId, search.trim(), db);
    }
    return this.usersRepository.getUsersByOrgId(orgId, db);
  }

  async searchUsers(search: string, db?: Db): Promise<UserView[]> {
    return this.usersRepository.searchUsers(search, db);
  }
}

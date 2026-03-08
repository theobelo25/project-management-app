import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from './types/users.tokens';
import { UsersRepository } from './repositories/users.repository';
import { Db } from '@api/prisma';
import {
  CreateUserDto,
  PrivateUser,
  UpdateUserInputDto,
  UserView,
} from '@repo/types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto, db?: Db): Promise<UserView> {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
      db,
    );
    if (existing) throw new ConflictException('User already exists');

    return this.usersRepository.create(createUserDto, db);
  }

  async update(
    id: string,
    data: UpdateUserInputDto,
    db?: Db,
  ): Promise<UserView> {
    return this.usersRepository.update(id, data, db);
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

  async getAllUsers(): Promise<UserView[]> {
    return this.usersRepository.getAllUsers();
  }
}

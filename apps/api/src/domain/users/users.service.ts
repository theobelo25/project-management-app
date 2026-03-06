import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from './constants/users.tokens';
import { IUsersRepository } from './repositories/users.repository.interface';
import { Db } from '@api/prisma/types/db.type';
import { CreateUserInput, UpdateUserInputDto } from '@repo/types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserInput, db?: Db) {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
      db,
    );
    if (existing) throw new ConflictException('User already exists');

    return this.usersRepository.create(createUserDto, db);
  }

  async update(id: string, data: UpdateUserInputDto, db?: Db) {
    return this.usersRepository.update(id, data, db);
  }
  async updateRefreshToken(id: string, refreshToken: string, db?: Db) {
    return this.usersRepository.updateRefreshToken(id, refreshToken, db);
  }

  async findById(id: string, db?: Db) {
    return this.usersRepository.findById(id, db);
  }

  async findPrivateUserById(id: string, db?: Db) {
    return this.usersRepository.findPrivateUserById(id, db);
  }

  async findPrivateUserByEmail(email: string, db?: Db) {
    return this.usersRepository.findPrivateUserByEmail(email, db);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }
}

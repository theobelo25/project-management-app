import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from './constants/users.tokens';
import { IUsersRepository } from './repositories/users.repository.interface';
import { Db } from '@api/prisma/types/db.type';
import { CreateUserInput } from '@repo/types';

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

  async findById(id: string, db?: Db) {
    return this.usersRepository.findById(id, db);
  }
}

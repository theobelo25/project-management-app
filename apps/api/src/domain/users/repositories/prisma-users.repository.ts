import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreateUserDto,
  UpdateUserInputDto,
  PrivateUser,
  UserView,
} from '@repo/types';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import { toUserView } from '../mappers/user.mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async findById(id: string, tx?: Db): Promise<UserView | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;
    return toUserView(user);
  }

  async findByEmail(email: string, tx?: Db): Promise<UserView | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;
    return toUserView(user);
  }

  async findPrivateUserById(id: string, tx?: Db): Promise<PrivateUser | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;
    return user;
  }

  async findPrivateUserByEmail(
    email: string,
    tx?: Db,
  ): Promise<PrivateUser | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;
    return user;
  }

  async getAllUsers(tx?: Db): Promise<UserView[]> {
    const prisma = tx ?? this.prisma;

    const users = await prisma.user.findMany();

    return users.map((u) => toUserView(u));
  }

  async create(dto: CreateUserDto, tx?: Db): Promise<UserView> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.create({ data: dto });

    return toUserView(user);
  }

  async update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView> {
    const prisma = tx ?? this.prisma;

    const updatedUser = await prisma.user.update({ where: { id }, data: dto });

    return toUserView(updatedUser);
  }
}

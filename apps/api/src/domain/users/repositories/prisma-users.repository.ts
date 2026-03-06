import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { Db } from 'apps/api/src/prisma/types/db.type';
import { UpdateUserInputDto, User, UserView } from '@repo/types';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toView(user: any): UserView {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async findById(id: string, db?: Db): Promise<UserView | null> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;
    return this.toView(user);
  }

  async findByEmail(email: string, db?: Db): Promise<UserView | null> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;
    return this.toView(user);
  }

  async findPrivateUserById(id: string, db?: Db): Promise<User | null> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;
    return user;
  }

  async findPrivateUserByEmail(email: string, db?: Db): Promise<User | null> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;
    return user;
  }

  async getAllUsers(db?: Db): Promise<UserView[]> {
    const prisma = db ?? this.prisma;

    const users = await prisma.user.findMany();

    return users.map((u) => this.toView(u));
  }

  async create(
    data: { email: string; name?: string | null; password: string },
    db?: Db,
  ): Promise<UserView> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.create({ data });

    return this.toView(user);
  }

  async update(
    id: string,
    dto: UpdateUserInputDto,
    db?: Db,
  ): Promise<UserView> {
    const prisma = db ?? this.prisma;

    const updatedUser = await prisma.user.update({ where: { id }, data: dto });

    return this.toView(updatedUser);
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
    db?: Db,
  ): Promise<UserView> {
    const prisma = db ?? this.prisma;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { refreshToken },
    });

    return this.toView(updatedUser);
  }
}

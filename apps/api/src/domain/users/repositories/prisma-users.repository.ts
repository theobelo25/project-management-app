import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
import { Db } from 'apps/api/src/prisma/types/db.type';
import { UserView } from '@repo/types';

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

  async create(
    data: { email: string; name?: string | null },
    db?: Db,
  ): Promise<UserView> {
    const prisma = db ?? this.prisma;

    const user = await prisma.user.create({ data });

    return this.toView(user);
  }
}

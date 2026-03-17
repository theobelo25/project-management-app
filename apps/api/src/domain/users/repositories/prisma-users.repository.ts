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

    const user = await prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!user) return null;
    return toUserView(user as any);
  }

  async findByEmail(email: string, tx?: Db): Promise<UserView | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) return null;
    return toUserView(user as any);
  }

  async findPrivateUserById(id: string, tx?: Db): Promise<PrivateUser | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!user) return null;

    // Return shape expected by PrivateUser (includes orgId + org name)
    return {
      id: user.id,
      orgId: user.organizationId,
      organizationName: user.organization?.name ?? '(unknown organization)',
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findPrivateUserByEmail(
    email: string,
    tx?: Db,
  ): Promise<PrivateUser | null> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      orgId: user.organizationId,
      organizationName: user.organization?.name ?? '(unknown organization)',
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(tx?: Db): Promise<UserView[]> {
    const prisma = tx ?? this.prisma;
    const users = await prisma.user.findMany({
      include: { organization: true },
    });
    return users.map((user: any) => toUserView(user));
  }

  async getUsersByOrgId(orgId: string, tx?: Db): Promise<UserView[]> {
    const prisma = tx ?? this.prisma;

    const users = await prisma.user.findMany({
      where: { organizationId: orgId },
      include: { organization: true },
    });

    return users.map((user: any) => toUserView(user));
  }

  async create(dto: CreateUserDto, tx?: Db): Promise<UserView> {
    const prisma = tx ?? this.prisma;

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: dto.passwordHash,
        organizationId: dto.orgId,
      },
      include: { organization: true },
    });

    return toUserView(user as any);
  }

  async update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView> {
    const prisma = tx ?? this.prisma;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dto as any,
      include: { organization: true },
    });

    return toUserView(updatedUser as any);
  }

  async searchUsers(search: string, tx?: Db): Promise<UserView[]> {
    const prisma = tx ?? this.prisma;
    const term = search.trim();
    if (!term) return this.getAllUsers(tx);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: { organization: true },
    });

    return users.map((user: any) => toUserView(user));
  }

  async searchUsersByOrgId(
    orgId: string,
    search: string,
    tx?: Db,
  ): Promise<UserView[]> {
    const prisma = tx ?? this.prisma;
    const term = search.trim();
    if (!term) return this.getUsersByOrgId(orgId, tx);

    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: { organization: true },
    });

    return users.map((user: any) => toUserView(user));
  }
}

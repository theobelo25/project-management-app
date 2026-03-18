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

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  private toUserView(row: any): UserView {
    return {
      id: row.id,
      orgId: row.activeOrganizationId,
      organizationName:
        row.activeOrganization?.name ?? '(no active organization)',
      email: row.email,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findById(id: string, tx?: Db): Promise<UserView | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { activeOrganization: true },
    });

    if (!user) return null;
    return this.toUserView(user);
  }

  async findByEmail(email: string, tx?: Db): Promise<UserView | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { activeOrganization: true },
    });

    if (!user) return null;
    return this.toUserView(user);
  }

  async findPrivateUserById(id: string, tx?: Db): Promise<PrivateUser | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { activeOrganization: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      orgId: user.activeOrganizationId,
      organizationName:
        user.activeOrganization?.name ?? '(no active organization)',
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
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { activeOrganization: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      orgId: user.activeOrganizationId,
      organizationName:
        user.activeOrganization?.name ?? '(no active organization)',
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;
    const users = await prisma.user.findMany({
      include: { activeOrganization: true },
    });
    return users.map((u) => this.toUserView(u));
  }

  // Now org filtering is "users whose ACTIVE org matches"
  // (This matches your current UI expectations for /users listing in the active org)
  async getUsersByOrgId(orgId: string, tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const users = await prisma.user.findMany({
      where: { activeOrganizationId: orgId },
      include: { activeOrganization: true },
    });

    return users.map((u) => this.toUserView(u));
  }

  async create(dto: CreateUserDto, tx?: Db): Promise<UserView> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    // Create user with initial active org and default org
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: dto.passwordHash,
        activeOrganizationId: dto.orgId,
        defaultOrganizationId: dto.orgId,
        organizationMemberships: {
          create: { organizationId: dto.orgId, role: 'OWNER' },
        },
      },
      include: { activeOrganization: true },
    });

    return this.toUserView(user);
  }

  async update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dto as any,
      include: { activeOrganization: true },
    });

    return this.toUserView(updatedUser);
  }

  async searchUsers(search: string, tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;
    const term = search.trim();
    if (!term) return this.getAllUsers(tx);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: { activeOrganization: true },
    });

    return users.map((u) => this.toUserView(u));
  }

  async searchUsersByOrgId(
    orgId: string,
    search: string,
    tx?: Db,
  ): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;
    const term = search.trim();
    if (!term) return this.getUsersByOrgId(orgId, tx);

    const users = await prisma.user.findMany({
      where: {
        activeOrganizationId: orgId,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: { activeOrganization: true },
    });

    return users.map((u) => this.toUserView(u));
  }

  // Legacy method name kept; now it sets the ACTIVE org
  async updateOrganization(
    userId: string,
    organizationId: string,
    tx?: Db,
  ): Promise<void> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    await prisma.user.update({
      where: { id: userId },
      data: { activeOrganizationId: organizationId },
    });
  }
}

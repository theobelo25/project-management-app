import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreateUserDto,
  UpdateUserInputDto,
  PrivateUser,
  UserView,
} from '@repo/types';
import { PRISMA, Db } from '@api/prisma';
import { Prisma, PrismaClient } from '@repo/database';
import { toPrivateUser, toUserView } from '../mappers/user.mapper';

const GLOBAL_USER_SEARCH_LIMIT = 50;

type UserWithActiveOrg = Prisma.UserGetPayload<{
  include: { activeOrganization: true };
}>;

function toPrismaUserUpdate(dto: UpdateUserInputDto): Prisma.UserUpdateInput {
  const data: Prisma.UserUpdateInput = {};
  if (dto.email !== undefined) data.email = dto.email;
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.passwordHash !== undefined) data.passwordHash = dto.passwordHash;
  if (dto.themeMode !== undefined)
    data.themeMode =
      dto.themeMode === 'light'
        ? 'LIGHT'
        : dto.themeMode === 'dark'
          ? 'DARK'
          : 'SYSTEM';
  if (dto.colorScheme !== undefined)
    data.colorScheme =
      dto.colorScheme === 'default'
        ? 'DEFAULT'
        : dto.colorScheme === 'pastel-warm'
          ? 'PASTEL_WARM'
          : 'PASTEL_COOL';
  return data;
}

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async findById(id: string, tx?: Db): Promise<UserView | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { activeOrganization: true },
    });

    if (!user) return null;
    return toUserView(user);
  }

  async findByEmail(email: string, tx?: Db): Promise<UserView | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { activeOrganization: true },
    });

    if (!user) return null;
    return toUserView(user);
  }

  async findPrivateUserById(id: string, tx?: Db): Promise<PrivateUser | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { activeOrganization: true },
    });

    if (!user) return null;

    return toPrivateUser(user);
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

    return toPrivateUser(user);
  }

  async getAllUsers(tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;
    const users = await prisma.user.findMany({
      include: { activeOrganization: true },
    });
    return users.map((u: UserWithActiveOrg) => toUserView(u));
  }

  // Now org filtering is "users whose ACTIVE org matches"
  // (This matches your current UI expectations for /users listing in the active org)
  async getUsersByOrgId(orgId: string, tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const users = await prisma.user.findMany({
      where: { activeOrganizationId: orgId },
      include: { activeOrganization: true },
    });

    return users.map((u: UserWithActiveOrg) => toUserView(u));
  }

  async create(dto: CreateUserDto, tx?: Db): Promise<UserView> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

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

    return toUserView(user);
  }

  async update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: toPrismaUserUpdate(dto),
      include: { activeOrganization: true },
    });

    return toUserView(updatedUser);
  }

  async searchUsers(search: string, tx?: Db): Promise<UserView[]> {
    const prisma = (tx ?? this.prisma) as PrismaClient;
    const term = search.trim();
    if (!term) return []; // never call getAllUsers()
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: GLOBAL_USER_SEARCH_LIMIT,
      include: { activeOrganization: true },
    });
    return users.map((u: UserWithActiveOrg) => toUserView(u));
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

    return users.map((u: UserWithActiveOrg) => toUserView(u));
  }

  async updateOrganization(
    userId: string,
    organizationId: string,
    tx?: Db,
  ): Promise<void> {
    await this.updateUserOrganizationIds(
      userId,
      { activeOrganizationId: organizationId },
      tx,
    );
  }

  async findUserOrganizationIds(
    userId: string,
    tx?: Db,
  ): Promise<{
    id: string;
    activeOrganizationId: string;
    defaultOrganizationId: string | null;
  } | null> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        activeOrganizationId: true,
        defaultOrganizationId: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      activeOrganizationId: user.activeOrganizationId,
      defaultOrganizationId: user.defaultOrganizationId,
    };
  }

  async getUsersWithActiveOrganization(
    organizationId: string,
    tx?: Db,
  ): Promise<Array<{ id: string; defaultOrganizationId: string | null }>> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    const users = await prisma.user.findMany({
      where: { activeOrganizationId: organizationId },
      select: { id: true, defaultOrganizationId: true },
    });

    return users.map((u) => ({
      id: u.id,
      defaultOrganizationId: u.defaultOrganizationId,
    }));
  }

  async updateUserOrganizationIds(
    userId: string,
    data: { activeOrganizationId: string; defaultOrganizationId?: string },
    tx?: Db,
  ): Promise<void> {
    const prisma = (tx ?? this.prisma) as PrismaClient;

    await prisma.user.update({
      where: { id: userId },
      data: {
        activeOrganizationId: data.activeOrganizationId,
        ...(data.defaultOrganizationId
          ? { defaultOrganizationId: data.defaultOrganizationId }
          : {}),
      },
    });
  }

  async updateUsersOrganizationIds(
    updates: Array<{
      userId: string;
      activeOrganizationId: string;
      defaultOrganizationId?: string;
    }>,
    tx?: Db,
  ): Promise<void> {
    const run = async (client: Db) => {
      for (const u of updates) {
        await this.updateUserOrganizationIds(
          u.userId,
          {
            activeOrganizationId: u.activeOrganizationId,
            ...(u.defaultOrganizationId
              ? { defaultOrganizationId: u.defaultOrganizationId }
              : {}),
          },
          client,
        );
      }
    };

    if (tx) {
      await run(tx);
      return;
    }

    await this.prisma.$transaction(async (inner) => {
      await run(inner as Db);
    });
  }
}

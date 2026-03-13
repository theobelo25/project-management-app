import { Inject, Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  Project,
  ProjectMember,
  ProjectRole,
} from '@repo/database';
import { PRISMA, Db } from '@api/prisma';
import {
  AddProjectMemberInput,
  CreateProjectWithOwnerInput,
  FindManyForUserInput,
  PaginatedProjectsResult,
  ProjectListMemberWithUser,
  ProjectMemberWithUser,
  ProjectWithRole,
  UpdateProjectInput,
  UpdateProjectMemberRoleInput,
} from '../types/projects.repository.types';
import { ProjectsRepository } from './projects.repository';
import { toProjectWithRole } from '../mappers/prisma-repository.mapper';

@Injectable()
export class PrismaProjectsRepository extends ProjectsRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async createWithOwner(
    input: CreateProjectWithOwnerInput,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        ownerId: input.ownerId,
        members: {
          create: {
            userId: input.ownerId,
            role: ProjectRole.OWNER,
          },
        },
      },
    });

    return {
      ...project,
      currentUserRole: ProjectRole.OWNER,
    };
  }

  async findById(id: string, db?: Db): Promise<Project | null> {
    const prisma = db ?? this.prisma;
    return prisma.project.findUnique({
      where: { id },
    });
  }

  async findManyForUser(
    input: FindManyForUserInput,
    db?: Db,
  ): Promise<PaginatedProjectsResult> {
    const prisma = db ?? this.prisma;
    const skip = (input.page - 1) * input.pageSize;

    const baseWhere: Prisma.ProjectWhereInput = {
      OR: [
        { ownerId: input.userId },
        { members: { some: { userId: input.userId } } },
      ],
    };

    if (input.filter === 'archived') {
      (baseWhere as Prisma.ProjectWhereInput).archivedAt = { not: null };
    } else if (!input.includeArchived) {
      (baseWhere as Prisma.ProjectWhereInput).archivedAt = null;
    }

    if (input.filter === 'owned') {
      (baseWhere as Prisma.ProjectWhereInput).ownerId = input.userId;
    } else if (input.filter === 'member') {
      (baseWhere as Prisma.ProjectWhereInput).AND = [
        { members: { some: { userId: input.userId } } },
        { ownerId: { not: input.userId } },
      ];
      (baseWhere as Prisma.ProjectWhereInput).archivedAt = null;
    }

    if (input.search && input.search.length > 0) {
      const searchCondition: Prisma.ProjectWhereInput = {
        OR: [
          { name: { contains: input.search, mode: 'insensitive' } },
          { description: { contains: input.search, mode: 'insensitive' } },
        ],
      };
      baseWhere.AND = Array.isArray(baseWhere.AND)
        ? [...baseWhere.AND, searchCondition]
        : [searchCondition];
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      input.sort === 'name-asc'
        ? { name: 'asc' }
        : input.sort === 'created-desc'
          ? { createdAt: 'desc' }
          : { updatedAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where: baseWhere,
        skip,
        take: input.pageSize,
        orderBy,
        include: {
          members: {
            where: { userId: input.userId },
            select: { role: true },
            take: 1,
          },
        },
      }),
      prisma.project.count({ where: baseWhere }),
    ]);

    return {
      items: items.map((project: Project) =>
        toProjectWithRole(project, input.userId),
      ),
      total,
      page: input.page,
      pageSize: input.pageSize,
    };
  }

  async findAuthorizedById(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId },
            },
          },
        ],
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    });

    if (!project) return null;

    return toProjectWithRole(project, userId);
  }

  async findByIdWithMemberRole(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole | null> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    });

    if (!project) return null;

    return toProjectWithRole(project, userId);
  }

  async findMembership(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectMember | null> {
    const prisma = db ?? this.prisma;

    return prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async findMembersByProjectId(
    projectId: string,
    db?: Db,
  ): Promise<ProjectMemberWithUser[]> {
    const prisma = db ?? this.prisma;

    return prisma.projectMember.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      select: {
        userId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async addMember(
    input: AddProjectMemberInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser> {
    const prisma = db ?? this.prisma;

    return prisma.projectMember.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        role: input.role,
      },
      select: {
        userId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateOwner(
    projectId: string,
    ownerId: string,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.project.update({
      where: { id: projectId },
      data: { ownerId },
    });
  }

  async updateMemberRole(
    input: UpdateProjectMemberRoleInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser> {
    const prisma = db ?? this.prisma;

    return prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId: input.projectId,
          userId: input.userId,
        },
      },
      data: {
        role: input.role,
      },
      select: {
        userId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async removeMember(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<void> {
    const prisma = db ?? this.prisma;

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async updateForUser(
    id: string,
    userId: string,
    data: UpdateProjectInput,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name != undefined ? { name: data.name } : {}),
        ...(data.description != undefined
          ? { description: data.description }
          : {}),
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    });

    return toProjectWithRole(project, userId);
  }

  async archiveForUser(
    id: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    });

    return toProjectWithRole(project, userId);
  }

  async unarchiveForUser(
    id: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectWithRole> {
    const prisma = db ?? this.prisma;

    const project = await prisma.project.update({
      where: { id },
      data: {
        archivedAt: null,
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
          take: 1,
        },
      },
    });

    return toProjectWithRole(project, userId);
  }

  async delete(id: string, db?: Db): Promise<Project> {
    const prisma = db ?? this.prisma;

    return prisma.project.delete({
      where: { id },
    });
  }

  async findMembersWithUserByProjectIds(
    projectIds: string[],
    db?: Db,
  ): Promise<Map<string, ProjectListMemberWithUser[]>> {
    const prisma = db ?? this.prisma;
    if (projectIds.length === 0) return new Map();

    const members = await prisma.projectMember.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: [{ projectId: 'asc' }, { createdAt: 'asc' }],
      select: {
        projectId: true,
        userId: true,
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const map = new Map<string, ProjectListMemberWithUser[]>();
    for (const m of members) {
      const list = map.get(m.projectId) ?? [];
      list.push({
        userId: m.userId,
        name: m.user.name,
      });
      map.set(m.projectId, list);
    }
    return map;
  }
}

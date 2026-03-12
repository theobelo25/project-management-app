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

    const where: Prisma.ProjectWhereInput = {
      ...(input.includeArchived ? {} : { archivedAt: null }),
      OR: [
        { ownerId: input.userId },
        {
          members: {
            some: {
              userId: input.userId,
            },
          },
        },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          members: {
            where: { userId: input.userId },
            select: { role: true },
            take: 1,
          },
        },
      }),
      prisma.project.count({ where }),
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
}

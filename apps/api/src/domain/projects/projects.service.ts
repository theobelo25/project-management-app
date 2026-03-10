import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROJECTS_REPOSITORY } from './types/projects.tokens';
import {
  CreateProjectWithOwnerInput,
  ProjectsRepository,
  ProjectWithRole,
} from './repositories/projects.repository';
import {
  AddProjectMemberDto,
  CreateProjectDto,
  GetProjectsQueryDto,
  PaginatedProjectsView,
  ProjectMembersView,
  ProjectMemberView,
  ProjectView,
  TransferProjectOwnershipDto,
  UpdateProjectDto,
  UpdateProjectMemberRoleDto,
} from '@repo/types';
import {
  toPaginatedProjectsView,
  toProjectView,
} from './mappers/project.mapper';
import { ProjectAccessService } from './access/project-access.service';
import { ProjectRole } from '@repo/database';
import {
  toProjectMembersView,
  toProjectMemberView,
} from './mappers/project-member.mapper';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
    @Inject(UNIT_OF_WORK)
    private readonly uow: UnitOfWork,
  ) {}

  async create(ownerId: string, dto: CreateProjectDto): Promise<ProjectView> {
    const input: CreateProjectWithOwnerInput = {
      ownerId,
      name: dto.name,
      description: dto.description,
    };

    const project = await this.projectsRepository.createWithOwner(input);
    return toProjectView(project);
  }

  async findManyForUser(
    userId: string,
    query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsView> {
    const result = await this.projectsRepository.findManyForUser({
      userId,
      page: query.page,
      pageSize: query.pageSize,
      includeArchived: query.includeArchived,
    });

    return toPaginatedProjectsView(result);
  }

  async findById(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireMember(
      projectId,
      userId,
    );

    return toProjectView(project);
  }

  async update(
    projectId: string,
    userId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectView> {
    const project = await this.projectAccessService.requireRole(
      projectId,
      userId,
      ProjectRole.ADMIN,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Archived projects cannot be modified');

    const updatedProject = await this.projectsRepository.updateForUser(
      projectId,
      userId,
      {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
      },
    );

    return toProjectView(updatedProject);
  }

  async archive(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      userId,
    );

    if (project.archivedAt)
      throw new ForbiddenException('Project is already archived');

    const archivedProject = await this.projectsRepository.archiveForUser(
      projectId,
      userId,
    );

    return toProjectView(archivedProject);
  }

  async unarchive(projectId: string, userId: string): Promise<ProjectView> {
    const project = await this.projectAccessService.requireOwner(
      projectId,
      userId,
    );

    if (!project.archivedAt)
      throw new ForbiddenException('Project is not archived');

    const unarchivedProject = await this.projectsRepository.unarchiveForUser(
      projectId,
      userId,
    );

    return toProjectView(unarchivedProject);
  }

  async getMembers(
    projectId: string,
    userId: string,
  ): Promise<ProjectMembersView> {
    await this.projectAccessService.requireMember(projectId, userId);

    const members =
      await this.projectsRepository.findMembersByProjectId(projectId);
    return toProjectMembersView(members);
  }

  async addMember(
    projectId: string,
    actorUserId: string,
    dto: AddProjectMemberDto,
  ): Promise<ProjectMemberView> {
    await this.projectAccessService.requireOwner(projectId, actorUserId);

    if (dto.userId === actorUserId) {
      throw new ConflictException('Owner is already a member of this project');
    }

    const existingMember = await this.projectsRepository.findMembership(
      projectId,
      dto.userId,
    );

    if (existingMember) {
      throw new ConflictException('User is already a project member');
    }

    const member = await this.projectsRepository.addMember({
      projectId,
      userId: dto.userId,
      role: dto.role,
    });

    return toProjectMemberView(member);
  }

  async updateMemberRole(
    projectId: string,
    actorUserId: string,
    memberUserId: string,
    dto: UpdateProjectMemberRoleDto,
  ): Promise<ProjectMemberView> {
    await this.projectAccessService.requireOwner(projectId, actorUserId);

    if (memberUserId === actorUserId) {
      throw new ForbiddenException(
        'Owner role must be changed via ownership transfer',
      );
    }

    const existingMember = await this.projectsRepository.findMembership(
      projectId,
      memberUserId,
    );

    if (!existingMember) {
      throw new NotFoundException('Project member not found');
    }

    const member = await this.projectsRepository.updateMemberRole({
      projectId,
      userId: memberUserId,
      role: dto.role,
    });

    return toProjectMemberView(member);
  }

  async removeMember(
    projectId: string,
    actorUserId: string,
    memberUserId: string,
  ): Promise<void> {
    await this.projectAccessService.requireOwner(projectId, actorUserId);

    if (memberUserId === actorUserId) {
      throw new ForbiddenException('Project owner cannot be removed');
    }

    const existingMember = await this.projectsRepository.findMembership(
      projectId,
      memberUserId,
    );

    if (!existingMember) {
      throw new NotFoundException('Project member not found');
    }

    await this.projectsRepository.removeMember(projectId, memberUserId);
  }

  async transferOwnership(
    projectId: string,
    actorUserId: string,
    dto: TransferProjectOwnershipDto,
  ): Promise<ProjectView> {
    return this.uow.transaction(async (db) => {
      await this.projectAccessService.requireOwner(projectId, actorUserId, db);

      if (dto.userId === actorUserId) {
        throw new ConflictException('User is already the project owner');
      }

      const targetMembership = await this.projectsRepository.findMembership(
        projectId,
        dto.userId,
        db,
      );

      if (!targetMembership) {
        throw new NotFoundException('Target user is not a project member');
      }

      await this.projectsRepository.updateOwner(projectId, dto.userId, db);

      await this.projectsRepository.updateMemberRole(
        {
          projectId,
          userId: dto.userId,
          role: ProjectRole.OWNER,
        },
        db,
      );

      await this.projectsRepository.updateMemberRole(
        {
          projectId,
          userId: actorUserId,
          role: ProjectRole.ADMIN,
        },
        db,
      );

      const updatedProject = await this.projectsRepository.findAuthorizedById(
        projectId,
        dto.userId,
        db,
      );

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      return toProjectView(updatedProject);
    });
  }
}

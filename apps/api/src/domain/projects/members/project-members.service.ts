import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  toProjectMembersView,
  toProjectMemberView,
} from '../mappers/project-member.mapper';
import { AddProjectMemberDto, UpdateProjectMemberRoleDto } from '../dto';
import { ProjectMembersView, ProjectMemberView } from '@repo/types';
import { ProjectAccessService } from '../access/project-access.service';
import { ProjectsRepository } from '../repositories/projects.repository';
import { PROJECTS_REPOSITORY } from '../types/projects.tokens';

@Injectable()
export class ProjectMembersService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

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
}

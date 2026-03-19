import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  toProjectMembersView,
  toProjectMemberView,
} from '../mappers/project-member.mapper';
import { AddProjectMemberDto, UpdateProjectMemberRoleDto } from '../dto';
import { ProjectMembersView, ProjectMemberView, AuthUser } from '@repo/types';
import { ProjectAccessService } from '../policies/project-access.service';
import { ProjectsRepository } from '../repositories/projects.repository';
import { PinoLogger } from 'nestjs-pino';
import { UsersRepository } from '@api/domain/users/repositories/users.repository';
import { ProjectWithRole } from '../types/projects.repository.types';

@Injectable()
export class ProjectMembersService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectAccessService: ProjectAccessService,
    private readonly usersRepository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectMembersService.name);
  }

  async getMembers(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMembersView> {
    if (!authorizedProject) {
      await this.projectAccessService.requireMember(projectId, user);
    }

    const members =
      await this.projectsRepository.findMembersByProjectId(projectId);

    this.logger.debug(
      { projectId, userId: user.id },
      'Fetched project members',
    );

    return toProjectMembersView(members);
  }

  private async requireOwnerAndNotArchivedForMembershipChange(
    projectId: string,
    actor: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    if (authorizedProject) {
      this.projectAccessService.assertOwner(authorizedProject);
      this.projectAccessService.assertNotArchived(
        authorizedProject,
        'Archived projects cannot modify membership',
      );
      return;
    }

    await this.projectAccessService.requireOwnerAndNotArchived(
      projectId,
      actor,
    );
  }

  async addMember(
    projectId: string,
    actor: AuthUser,
    dto: AddProjectMemberDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    await this.requireOwnerAndNotArchivedForMembershipChange(
      projectId,
      actor,
      authorizedProject,
    );

    if (dto.userId === actor.id) {
      throw new ConflictException('Owner is already a member of this project');
    }

    const targetUser = await this.usersRepository.findById(dto.userId);
    if (!targetUser) throw new NotFoundException('User not found');

    if (targetUser.orgId !== actor.orgId) {
      throw new ForbiddenException(
        'Cannot add users from another organization',
      );
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

    this.logger.info(
      {
        event: 'project.member.added',
        projectId,
        actorUserId: actor.id,
        addedUserId: dto.userId,
        role: dto.role,
      },
      'Project member added',
    );

    return toProjectMemberView(member);
  }

  async updateMemberRole(
    projectId: string,
    actor: AuthUser,
    memberUserId: string,
    dto: UpdateProjectMemberRoleDto,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    await this.requireOwnerAndNotArchivedForMembershipChange(
      projectId,
      actor,
      authorizedProject,
    );

    if (memberUserId === actor.id) {
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

    this.logger.info(
      {
        event: 'project.member.role.updated',
        projectId,
        actorUserId: actor.id,
        memberUserId,
        newRole: dto.role,
      },
      'Project member role updated',
    );

    return toProjectMemberView(member);
  }

  async removeMember(
    projectId: string,
    actor: AuthUser,
    memberUserId: string,
    authorizedProject?: ProjectWithRole,
  ): Promise<void> {
    await this.requireOwnerAndNotArchivedForMembershipChange(
      projectId,
      actor,
      authorizedProject,
    );

    if (memberUserId === actor.id) {
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

    this.logger.info(
      {
        event: 'project.member.removed',
        projectId,
        actorUserId: actor.id,
        removedUserId: memberUserId,
      },
      'Project member removed',
    );
  }
}

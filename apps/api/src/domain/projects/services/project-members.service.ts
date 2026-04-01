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
import { ProjectMembersView, ProjectMemberView, AuthUser } from '@repo/types';
import { ProjectAccessService } from '../policies/project-access.service';
import {
  PROJECT_MEMBER_REPOSITORY,
  type ProjectMemberRepository,
} from '../repositories/projects.repository';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '@api/domain/users/users.service';
import { ProjectWithRole } from '../types/projects.repository.types';
import { NotificationsService } from '@api/domain/notifications/notifications.service';
import { RealtimePublisher } from '@api/domain/realtime/realtime.publisher';
import { REALTIME_EVENT } from '@api/domain/realtime/realtime.events';
import type {
  AddProjectMemberCommand,
  UpdateProjectMemberRoleCommand,
} from '../application/projects-application.types';

@Injectable()
export class ProjectMembersService {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projects: ProjectMemberRepository,
    private readonly projectAccessService: ProjectAccessService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly realtimePublisher: RealtimePublisher,
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

    const members = await this.projects.findMembersByProjectId(projectId);

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
    command: AddProjectMemberCommand,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectMemberView> {
    await this.requireOwnerAndNotArchivedForMembershipChange(
      projectId,
      actor,
      authorizedProject,
    );

    if (command.userId === actor.id) {
      throw new ConflictException('Owner is already a member of this project');
    }

    const targetUser = await this.usersService.findById(command.userId);
    if (!targetUser) throw new NotFoundException('User not found');

    if (targetUser.orgId !== actor.orgId) {
      throw new ForbiddenException(
        'Cannot add users from another organization',
      );
    }

    const existingMember = await this.projects.findMembership(
      projectId,
      command.userId,
    );

    if (existingMember) {
      throw new ConflictException('User is already a project member');
    }

    const member = await this.projects.addMember({
      projectId,
      userId: command.userId,
      role: command.role,
    });

    this.logger.info(
      {
        event: 'project.member.added',
        projectId,
        actorUserId: actor.id,
        addedUserId: command.userId,
        role: command.role,
      },
      'Project member added',
    );

    this.realtimePublisher.toOrg(
      actor.orgId,
      REALTIME_EVENT.projectMemberAdded,
      {
        projectId,
        userId: command.userId,
        actorUserId: actor.id,
        role: command.role,
      },
    );
    this.realtimePublisher.toUser(
      command.userId,
      REALTIME_EVENT.projectMemberAdded,
      {
        projectId,
        userId: command.userId,
        actorUserId: actor.id,
        role: command.role,
      },
    );

    try {
      await this.notificationsService.notifyProjectMemberAdded(command.userId, {
        projectId,
        addedById: actor.id,
      });
    } catch (error) {
      this.logger.warn(
        {
          event: 'project.member.added.notification_failed',
          projectId,
          actorUserId: actor.id,
          addedUserId: command.userId,
          error,
        },
        'Failed to notify newly added project member',
      );
    }

    return toProjectMemberView(member);
  }

  async updateMemberRole(
    projectId: string,
    actor: AuthUser,
    memberUserId: string,
    command: UpdateProjectMemberRoleCommand,
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

    const existingMember = await this.projects.findMembership(
      projectId,
      memberUserId,
    );

    if (!existingMember) {
      throw new NotFoundException('Project member not found');
    }

    const member = await this.projects.updateMemberRole({
      projectId,
      userId: memberUserId,
      role: command.role,
    });

    this.logger.info(
      {
        event: 'project.member.role.updated',
        projectId,
        actorUserId: actor.id,
        memberUserId,
        newRole: command.role,
      },
      'Project member role updated',
    );

    this.realtimePublisher.toOrg(
      actor.orgId,
      REALTIME_EVENT.projectMemberRoleUpdated,
      {
        projectId,
        userId: memberUserId,
        actorUserId: actor.id,
        newRole: command.role,
      },
    );
    this.realtimePublisher.toUser(
      memberUserId,
      REALTIME_EVENT.projectMemberRoleUpdated,
      {
        projectId,
        userId: memberUserId,
        actorUserId: actor.id,
        newRole: command.role,
      },
    );

    try {
      await this.notificationsService.notifyProjectMemberRoleChanged(
        memberUserId,
        {
          projectId,
          changedById: actor.id,
          newRole: command.role,
        },
      );
    } catch (error) {
      this.logger.warn(
        {
          event: 'project.member.role.updated.notification_failed',
          projectId,
          actorUserId: actor.id,
          memberUserId,
          newRole: command.role,
          error,
        },
        'Failed to notify project member role change',
      );
    }

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

    const existingMember = await this.projects.findMembership(
      projectId,
      memberUserId,
    );

    if (!existingMember) {
      throw new NotFoundException('Project member not found');
    }

    await this.projects.removeMember(projectId, memberUserId);

    this.logger.info(
      {
        event: 'project.member.removed',
        projectId,
        actorUserId: actor.id,
        removedUserId: memberUserId,
      },
      'Project member removed',
    );

    this.realtimePublisher.toOrg(
      actor.orgId,
      REALTIME_EVENT.projectMemberRemoved,
      {
        projectId,
        userId: memberUserId,
        actorUserId: actor.id,
      },
    );
    this.realtimePublisher.toUser(
      memberUserId,
      REALTIME_EVENT.projectMemberRemoved,
      {
        projectId,
        userId: memberUserId,
        actorUserId: actor.id,
      },
    );

    try {
      await this.notificationsService.notifyProjectMemberRemoved(memberUserId, {
        projectId,
        removedById: actor.id,
      });
    } catch (error) {
      this.logger.warn(
        {
          event: 'project.member.removed.notification_failed',
          projectId,
          actorUserId: actor.id,
          removedUserId: memberUserId,
          error,
        },
        'Failed to notify removed project member',
      );
    }
  }
}

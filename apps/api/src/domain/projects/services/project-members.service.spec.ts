import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import type { AuthUser } from '@repo/types';
import { PinoLogger } from 'nestjs-pino';

import { UsersService } from '@api/domain/users/users.service';
import { NotificationsService } from '@api/domain/notifications/notifications.service';
import { RealtimePublisher } from '@api/domain/realtime/realtime.publisher';
import { ProjectMembersService } from './project-members.service';
import { ProjectAccessService } from '../policies/project-access.service';
import type { ProjectMemberRepository } from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';

describe('ProjectMembersService', () => {
  let service: ProjectMembersService;

  const orgId = 'org-1';

  const actorOwner: AuthUser = { id: 'user-1', orgId };
  const actorMember: AuthUser = { id: 'user-2', orgId };

  const projectMemberRepository: jest.Mocked<
    Pick<
      ProjectMemberRepository,
      | 'findMembersByProjectId'
      | 'findMembership'
      | 'addMember'
      | 'updateMemberRole'
      | 'removeMember'
    >
  > = {
    findMembersByProjectId: jest.fn(),
    findMembership: jest.fn(),
    addMember: jest.fn(),
    updateMemberRole: jest.fn(),
    removeMember: jest.fn(),
  };

  const projectAccessService: jest.Mocked<
    Pick<
      ProjectAccessService,
      | 'requireMember'
      | 'requireOwnerAndNotArchived'
      | 'assertOwner'
      | 'assertNotArchived'
    >
  > = {
    requireMember: jest.fn(),
    requireOwnerAndNotArchived: jest.fn(),
    assertOwner: jest.fn(),
    assertNotArchived: jest.fn(),
  };

  const usersService: jest.Mocked<Pick<UsersService, 'findById'>> = {
    findById: jest.fn(),
  };

  const notificationsService: jest.Mocked<
    Pick<
      NotificationsService,
      | 'notifyProjectMemberAdded'
      | 'notifyProjectMemberRemoved'
      | 'notifyProjectMemberRoleChanged'
    >
  > = {
    notifyProjectMemberAdded: jest.fn(),
    notifyProjectMemberRemoved: jest.fn(),
    notifyProjectMemberRoleChanged: jest.fn(),
  };

  const realtimePublisher: jest.Mocked<
    Pick<RealtimePublisher, 'toOrg' | 'toUser'>
  > = {
    toOrg: jest.fn(),
    toUser: jest.fn(),
  };

  const makeProject = (
    overrides: Partial<ProjectWithRole> = {},
  ): ProjectWithRole => ({
    id: 'project-1',
    organizationId: 'org-row-1',
    name: 'Project Alpha',
    description: 'Test project',
    ownerId: 'user-1',
    archivedAt: null,
    createdAt: new Date('2026-03-09T12:00:00.000Z'),
    updatedAt: new Date('2026-03-09T12:00:00.000Z'),
    currentUserRole: ProjectRole.OWNER,
    ...overrides,
  });

  const makeUserView = (id: string, userOrgId: string = orgId) => ({
    id,
    orgId: userOrgId,
    organizationName: 'Test Org',
    email: `${id}@example.com`,
    name: `User ${id}`,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  });

  const logger: jest.Mocked<PinoLogger> = {
    setContext: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    level: 'info',
    child: jest.fn(),
  } as unknown as jest.Mocked<PinoLogger>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectMembersService(
      projectMemberRepository as unknown as ProjectMemberRepository,
      projectAccessService as unknown as ProjectAccessService,
      usersService as unknown as UsersService,
      notificationsService as unknown as NotificationsService,
      realtimePublisher as unknown as RealtimePublisher,
      logger,
    );
  });

  describe('getMembers', () => {
    it('returns project members for an authorized user', async () => {
      projectAccessService.requireMember.mockResolvedValue(
        makeProject({
          currentUserRole: ProjectRole.MEMBER,
        }),
      );

      projectMemberRepository.findMembersByProjectId.mockResolvedValue([
        {
          userId: 'user-1',
          role: ProjectRole.OWNER,
          createdAt: new Date('2026-03-09T12:00:00.000Z'),
        },
        {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
          createdAt: new Date('2026-03-09T13:00:00.000Z'),
        },
      ]);

      const result = await service.getMembers('project-1', actorMember);

      expect(projectAccessService.requireMember).toHaveBeenCalledWith(
        'project-1',
        actorMember,
      );

      expect(
        projectMemberRepository.findMembersByProjectId,
      ).toHaveBeenCalledWith('project-1');

      expect(logger.debug).toHaveBeenCalledWith(
        { projectId: 'project-1', userId: actorMember.id },
        'Fetched project members',
      );

      expect(result).toEqual({
        items: [
          {
            userId: 'user-1',
            role: ProjectRole.OWNER,
            joinedAt: '2026-03-09T12:00:00.000Z',
          },
          {
            userId: 'user-2',
            role: ProjectRole.MEMBER,
            joinedAt: '2026-03-09T13:00:00.000Z',
          },
        ],
      });
    });
  });

  describe('addMember', () => {
    it('allows owner to add a new member', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject({
          currentUserRole: ProjectRole.OWNER,
        }),
      );

      usersService.findById.mockResolvedValue(makeUserView('user-2'));
      projectMemberRepository.findMembership.mockResolvedValue(null);
      projectMemberRepository.addMember.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      const result = await service.addMember('project-1', actorOwner, {
        userId: 'user-2',
        role: ProjectRole.MEMBER,
      });

      expect(
        projectAccessService.requireOwnerAndNotArchived,
      ).toHaveBeenCalledWith('project-1', actorOwner);

      expect(usersService.findById).toHaveBeenCalledWith('user-2');

      expect(projectMemberRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectMemberRepository.addMember).toHaveBeenCalledWith({
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
      });

      expect(result).toEqual({
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        joinedAt: '2026-03-09T13:00:00.000Z',
      });

      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'project.member.added',
          projectId: 'project-1',
          actorUserId: actorOwner.id,
          addedUserId: 'user-2',
          role: ProjectRole.MEMBER,
        },
        'Project member added',
      );
      expect(notificationsService.notifyProjectMemberAdded).toHaveBeenCalledWith(
        'user-2',
        {
          projectId: 'project-1',
          addedById: actorOwner.id,
        },
      );
      expect(realtimePublisher.toOrg).toHaveBeenCalledWith(
        orgId,
        'project.member.added',
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'user-2',
          actorUserId: actorOwner.id,
        }),
      );
    });

    it('throws when user is already a member', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      usersService.findById.mockResolvedValue(makeUserView('user-2'));

      projectMemberRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      await expect(
        service.addMember('project-1', actorOwner, {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.addMember('project-1', actorOwner, {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow('User is already a project member');

      expect(projectMemberRepository.addMember).not.toHaveBeenCalled();
      expect(notificationsService.notifyProjectMemberAdded).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });

    it('throws when owner tries to add themselves', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      await expect(
        service.addMember('project-1', actorOwner, {
          userId: actorOwner.id,
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.addMember('project-1', actorOwner, {
          userId: actorOwner.id,
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow('Owner is already a member of this project');

      expect(usersService.findById).not.toHaveBeenCalled();
      expect(projectMemberRepository.findMembership).not.toHaveBeenCalled();
      expect(projectMemberRepository.addMember).not.toHaveBeenCalled();
      expect(notificationsService.notifyProjectMemberAdded).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });
  });

  describe('updateMemberRole', () => {
    it('allows owner to update a member role', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      projectMemberRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      projectMemberRepository.updateMemberRole.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      const result = await service.updateMemberRole(
        'project-1',
        actorOwner,
        'user-2',
        { role: ProjectRole.ADMIN },
      );

      expect(
        projectAccessService.requireOwnerAndNotArchived,
      ).toHaveBeenCalledWith('project-1', actorOwner);

      expect(projectMemberRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectMemberRepository.updateMemberRole).toHaveBeenCalledWith({
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.ADMIN,
      });

      expect(result).toEqual({
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        joinedAt: '2026-03-09T13:00:00.000Z',
      });

      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'project.member.role.updated',
          projectId: 'project-1',
          actorUserId: actorOwner.id,
          memberUserId: 'user-2',
          newRole: ProjectRole.ADMIN,
        },
        'Project member role updated',
      );
      expect(realtimePublisher.toOrg).toHaveBeenCalledWith(
        orgId,
        'project.member.role.updated',
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'user-2',
          actorUserId: actorOwner.id,
          newRole: ProjectRole.ADMIN,
        }),
      );
      expect(
        notificationsService.notifyProjectMemberRoleChanged,
      ).toHaveBeenCalledWith('user-2', {
        projectId: 'project-1',
        changedById: actorOwner.id,
        newRole: ProjectRole.ADMIN,
      });
    });

    it('throws when trying to update the owner through member role endpoint', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      await expect(
        service.updateMemberRole('project-1', actorOwner, actorOwner.id, {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.updateMemberRole('project-1', actorOwner, actorOwner.id, {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow('Owner role must be changed via ownership transfer');

      expect(projectMemberRepository.findMembership).not.toHaveBeenCalled();
      expect(projectMemberRepository.updateMemberRole).not.toHaveBeenCalled();
      expect(
        notificationsService.notifyProjectMemberRoleChanged,
      ).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });

    it('throws when project member does not exist', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );
      projectMemberRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.updateMemberRole('project-1', actorOwner, 'user-2', {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.updateMemberRole('project-1', actorOwner, 'user-2', {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow('Project member not found');

      expect(projectMemberRepository.updateMemberRole).not.toHaveBeenCalled();
      expect(
        notificationsService.notifyProjectMemberRoleChanged,
      ).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('allows owner to remove a member', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      projectMemberRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      projectMemberRepository.removeMember.mockResolvedValue(undefined);

      await service.removeMember('project-1', actorOwner, 'user-2');

      expect(
        projectAccessService.requireOwnerAndNotArchived,
      ).toHaveBeenCalledWith('project-1', actorOwner);

      expect(projectMemberRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectMemberRepository.removeMember).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'project.member.removed',
          projectId: 'project-1',
          actorUserId: actorOwner.id,
          removedUserId: 'user-2',
        },
        'Project member removed',
      );
      expect(
        notificationsService.notifyProjectMemberRemoved,
      ).toHaveBeenCalledWith('user-2', {
        projectId: 'project-1',
        removedById: actorOwner.id,
      });
      expect(realtimePublisher.toOrg).toHaveBeenCalledWith(
        orgId,
        'project.member.removed',
        expect.objectContaining({
          projectId: 'project-1',
          userId: 'user-2',
          actorUserId: actorOwner.id,
        }),
      );
    });

    it('throws when trying to remove the owner', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      await expect(
        service.removeMember('project-1', actorOwner, actorOwner.id),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.removeMember('project-1', actorOwner, actorOwner.id),
      ).rejects.toThrow('Project owner cannot be removed');

      expect(projectMemberRepository.findMembership).not.toHaveBeenCalled();
      expect(projectMemberRepository.removeMember).not.toHaveBeenCalled();
      expect(
        notificationsService.notifyProjectMemberRemoved,
      ).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });

    it('throws when project member does not exist', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );
      projectMemberRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.removeMember('project-1', actorOwner, 'user-2'),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.removeMember('project-1', actorOwner, 'user-2'),
      ).rejects.toThrow('Project member not found');

      expect(projectMemberRepository.removeMember).not.toHaveBeenCalled();
      expect(
        notificationsService.notifyProjectMemberRemoved,
      ).not.toHaveBeenCalled();
      expect(realtimePublisher.toOrg).not.toHaveBeenCalled();
    });
  });
});

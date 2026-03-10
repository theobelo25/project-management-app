import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { ProjectMembersService } from './project-members.service';
import { ProjectAccessService } from '../access/project-access.service';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';
import { PinoLogger } from 'nestjs-pino';
describe('ProjectMembersService', () => {
  let service: ProjectMembersService;

  const projectsRepository: jest.Mocked<ProjectsRepository> = {
    createWithOwner: jest.fn(),
    findManyForUser: jest.fn(),
    findById: jest.fn(),
    findAuthorizedById: jest.fn(),
    findMembership: jest.fn(),
    updateForUser: jest.fn(),
    archiveForUser: jest.fn(),
    unarchiveForUser: jest.fn(),
    delete: jest.fn(),
    findMembersByProjectId: jest.fn(),
    addMember: jest.fn(),
    updateMemberRole: jest.fn(),
    removeMember: jest.fn(),
    updateOwner: jest.fn(),
  };

  const projectAccessService: jest.Mocked<ProjectAccessService> = {
    getAuthorizedProject: jest.fn(),
    getUserRole: jest.fn(),
    requireMember: jest.fn(),
    requireRole: jest.fn(),
    requireOwner: jest.fn(),
    requireActiveProject: jest.fn(),
    requireUnarchivedProject: jest.fn(),
    requireArchivedProject: jest.fn(),
  } as unknown as jest.Mocked<ProjectAccessService>;

  const makeProject = (
    overrides: Partial<ProjectWithRole> = {},
  ): ProjectWithRole => ({
    id: 'project-1',
    name: 'Project Alpha',
    description: 'Test project',
    ownerId: 'user-1',
    archivedAt: null,
    createdAt: new Date('2026-03-09T12:00:00.000Z'),
    updatedAt: new Date('2026-03-09T12:00:00.000Z'),
    currentUserRole: ProjectRole.OWNER,
    ...overrides,
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
    child: jest.fn() as any,
  } as unknown as jest.Mocked<PinoLogger>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectMembersService(
      projectsRepository,
      projectAccessService,
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

      projectsRepository.findMembersByProjectId.mockResolvedValue([
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

      const result = await service.getMembers('project-1', 'user-2');

      expect(projectAccessService.requireMember).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectsRepository.findMembersByProjectId).toHaveBeenCalledWith(
        'project-1',
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
      projectAccessService.requireOwner.mockResolvedValue(
        makeProject({
          currentUserRole: ProjectRole.OWNER,
        }),
      );

      projectsRepository.findMembership.mockResolvedValue(null);
      projectsRepository.addMember.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      const result = await service.addMember('project-1', 'user-1', {
        userId: 'user-2',
        role: ProjectRole.MEMBER,
      });

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(projectsRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectsRepository.addMember).toHaveBeenCalledWith({
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
          actorUserId: 'user-1',
          addedUserId: 'user-2',
          role: ProjectRole.MEMBER,
        },
        'Project member added',
      );
    });

    it('throws when user is already a member', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      projectsRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      } as any);

      await expect(
        service.addMember('project-1', 'user-1', {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow(
        new ConflictException('User is already a project member'),
      );

      expect(projectsRepository.addMember).not.toHaveBeenCalled();
    });

    it('throws when owner tries to add themselves', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.addMember('project-1', 'user-1', {
          userId: 'user-1',
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow(
        new ConflictException('Owner is already a member of this project'),
      );

      expect(projectsRepository.findMembership).not.toHaveBeenCalled();
      expect(projectsRepository.addMember).not.toHaveBeenCalled();
    });
  });

  describe('updateMemberRole', () => {
    it('allows owner to update a member role', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      projectsRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      } as any);

      projectsRepository.updateMemberRole.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      const result = await service.updateMemberRole(
        'project-1',
        'user-1',
        'user-2',
        { role: ProjectRole.ADMIN },
      );

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(projectsRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectsRepository.updateMemberRole).toHaveBeenCalledWith({
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.ADMIN,
      });

      expect(result).toEqual({
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        joinedAt: '2026-03-09T13:00:00.000Z',
      });
    });

    it('throws when trying to update the owner through member role endpoint', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.updateMemberRole('project-1', 'user-1', 'user-1', {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow(
        new ForbiddenException(
          'Owner role must be changed via ownership transfer',
        ),
      );

      expect(projectsRepository.findMembership).not.toHaveBeenCalled();
      expect(projectsRepository.updateMemberRole).not.toHaveBeenCalled();
    });

    it('throws when project member does not exist', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());
      projectsRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.updateMemberRole('project-1', 'user-1', 'user-2', {
          role: ProjectRole.ADMIN,
        }),
      ).rejects.toThrow(new NotFoundException('Project member not found'));

      expect(projectsRepository.updateMemberRole).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('allows owner to remove a member', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      projectsRepository.findMembership.mockResolvedValue({
        id: 'pm-1',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      } as any);

      projectsRepository.removeMember.mockResolvedValue(undefined);

      await service.removeMember('project-1', 'user-1', 'user-2');

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(projectsRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(projectsRepository.removeMember).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'project.member.removed',
          projectId: 'project-1',
          actorUserId: 'user-1',
          removedUserId: 'user-2',
        },
        'Project member removed',
      );
    });

    it('throws when trying to remove the owner', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.removeMember('project-1', 'user-1', 'user-1'),
      ).rejects.toThrow(
        new ForbiddenException('Project owner cannot be removed'),
      );

      expect(projectsRepository.findMembership).not.toHaveBeenCalled();
      expect(projectsRepository.removeMember).not.toHaveBeenCalled();
    });

    it('throws when project member does not exist', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());
      projectsRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.removeMember('project-1', 'user-1', 'user-2'),
      ).rejects.toThrow(new NotFoundException('Project member not found'));

      expect(projectsRepository.removeMember).not.toHaveBeenCalled();
    });
  });
});

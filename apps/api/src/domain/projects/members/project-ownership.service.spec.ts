import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { ProjectOwnershipService } from './project-ownership.service';
import { ProjectAccessService } from '../access/project-access.service';
import { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';

describe('ProjectOwnershipService', () => {
  let service: ProjectOwnershipService;

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

  const unitOfWork = {
    transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProjectOwnershipService(
      projectsRepository,
      projectAccessService,
      unitOfWork as any,
    );

    unitOfWork.transaction.mockImplementation(async (fn) =>
      fn(undefined as any),
    );
  });

  describe('transferOwnership', () => {
    it('transfers ownership to an existing member', async () => {
      const updatedProject = makeProject({
        ownerId: 'user-2',
        currentUserRole: ProjectRole.OWNER,
      });

      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      projectsRepository.findMembership.mockResolvedValue({
        id: 'pm-2',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      } as any);

      projectsRepository.updateOwner.mockResolvedValue(undefined);
      projectsRepository.updateMemberRole.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.OWNER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(updatedProject);

      const result = await service.transferOwnership('project-1', 'user-1', {
        userId: 'user-2',
      });

      expect(unitOfWork.transaction).toHaveBeenCalled();

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        undefined,
      );

      expect(projectsRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );

      expect(projectsRepository.updateOwner).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );

      expect(projectsRepository.updateMemberRole).toHaveBeenNthCalledWith(
        1,
        {
          projectId: 'project-1',
          userId: 'user-2',
          role: ProjectRole.OWNER,
        },
        undefined,
      );

      expect(projectsRepository.updateMemberRole).toHaveBeenNthCalledWith(
        2,
        {
          projectId: 'project-1',
          userId: 'user-1',
          role: ProjectRole.ADMIN,
        },
        undefined,
      );

      expect(result).toEqual({
        id: 'project-1',
        name: 'Project Alpha',
        description: 'Test project',
        ownerId: 'user-2',
        archivedAt: null,
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.OWNER,
      });
    });

    it('throws when target user is already the owner', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.transferOwnership('project-1', 'user-1', {
          userId: 'user-1',
        }),
      ).rejects.toThrow(
        new ConflictException('User is already the project owner'),
      );

      expect(projectsRepository.findMembership).not.toHaveBeenCalled();
      expect(projectsRepository.updateOwner).not.toHaveBeenCalled();
    });

    it('throws when target user is not a project member', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());
      projectsRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.transferOwnership('project-1', 'user-1', {
          userId: 'user-2',
        }),
      ).rejects.toThrow(
        new NotFoundException('Target user is not a project member'),
      );

      expect(projectsRepository.updateOwner).not.toHaveBeenCalled();
    });

    it('throws when updated project cannot be found after transfer', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      projectsRepository.findMembership.mockResolvedValue({
        id: 'pm-2',
        projectId: 'project-1',
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      } as any);

      projectsRepository.findAuthorizedById.mockResolvedValue(null);

      await expect(
        service.transferOwnership('project-1', 'user-1', {
          userId: 'user-2',
        }),
      ).rejects.toThrow(new NotFoundException('Project not found'));
    });
  });
});

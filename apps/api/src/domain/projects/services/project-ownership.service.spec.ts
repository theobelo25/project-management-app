import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import type { AuthUser } from '@repo/types';
import { PinoLogger } from 'nestjs-pino';

import { ProjectOwnershipService } from './project-ownership.service';
import { ProjectAccessService } from '../policies/project-access.service';
import type {
  ProjectAuthorizationRepository,
  ProjectMemberRepository,
} from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';

describe('ProjectOwnershipService', () => {
  let service: ProjectOwnershipService;

  const orgId = 'org-1';
  const actor: AuthUser = { id: 'user-1', orgId };

  const membersRepository: jest.Mocked<
    Pick<
      ProjectMemberRepository,
      'findMembership' | 'updateOwner' | 'updateMemberRole'
    >
  > = {
    findMembership: jest.fn(),
    updateOwner: jest.fn(),
    updateMemberRole: jest.fn(),
  };

  const authProjectsRepository: jest.Mocked<
    Pick<ProjectAuthorizationRepository, 'findAuthorizedById'>
  > = {
    findAuthorizedById: jest.fn(),
  };

  const projectAccessService: jest.Mocked<
    Pick<
      ProjectAccessService,
      'requireOwnerAndNotArchived' | 'assertOwner' | 'assertNotArchived'
    >
  > = {
    requireOwnerAndNotArchived: jest.fn(),
    assertOwner: jest.fn(),
    assertNotArchived: jest.fn(),
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

  const makeProjectMember = () => ({
    id: 'pm-2',
    projectId: 'project-1',
    userId: 'user-2',
    role: ProjectRole.ADMIN,
    createdAt: new Date('2026-03-09T13:00:00.000Z'),
  });

  const unitOfWork = {
    transaction: jest.fn(),
  };

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

    service = new ProjectOwnershipService(
      membersRepository as unknown as ProjectMemberRepository,
      authProjectsRepository as unknown as ProjectAuthorizationRepository,
      projectAccessService as unknown as ProjectAccessService,
      unitOfWork as any,
      logger,
    );

    unitOfWork.transaction.mockImplementation(
      async (fn: (db: unknown) => unknown) => fn(undefined),
    );
  });

  describe('transferOwnership', () => {
    it('transfers ownership to an existing member', async () => {
      const updatedProject = makeProject({
        ownerId: 'user-2',
        currentUserRole: ProjectRole.OWNER,
      });

      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      membersRepository.findMembership.mockResolvedValue(makeProjectMember());
      membersRepository.updateOwner.mockResolvedValue(undefined);
      membersRepository.updateMemberRole.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.OWNER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });
      authProjectsRepository.findAuthorizedById.mockResolvedValue(
        updatedProject,
      );

      const result = await service.transferOwnership('project-1', actor, {
        userId: 'user-2',
      });

      expect(unitOfWork.transaction).toHaveBeenCalled();

      expect(
        projectAccessService.requireOwnerAndNotArchived,
      ).toHaveBeenCalledWith('project-1', actor, undefined);

      expect(membersRepository.findMembership).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );

      expect(membersRepository.updateOwner).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );

      expect(membersRepository.updateMemberRole).toHaveBeenNthCalledWith(
        1,
        {
          projectId: 'project-1',
          userId: 'user-2',
          role: ProjectRole.OWNER,
        },
        undefined,
      );

      expect(membersRepository.updateMemberRole).toHaveBeenNthCalledWith(
        2,
        {
          projectId: 'project-1',
          userId: 'user-1',
          role: ProjectRole.ADMIN,
        },
        undefined,
      );

      expect(authProjectsRepository.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        orgId,
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

      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'project.owner.transferred',
          projectId: 'project-1',
          previousOwnerId: 'user-1',
          newOwnerId: 'user-2',
        },
        'Project ownership transferred successfully',
      );
    });

    it('throws when target user is already the owner', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: actor.id,
        }),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: actor.id,
        }),
      ).rejects.toThrow('User is already the project owner');

      expect(membersRepository.findMembership).not.toHaveBeenCalled();
      expect(membersRepository.updateOwner).not.toHaveBeenCalled();
    });

    it('throws when target user is not a project member', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );
      membersRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: 'user-2',
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: 'user-2',
        }),
      ).rejects.toThrow('Target user is not a project member');

      expect(membersRepository.updateOwner).not.toHaveBeenCalled();
    });

    it('throws when updated project cannot be found after transfer', async () => {
      projectAccessService.requireOwnerAndNotArchived.mockResolvedValue(
        makeProject(),
      );

      membersRepository.findMembership.mockResolvedValue(makeProjectMember());
      membersRepository.updateOwner.mockResolvedValue(undefined);
      membersRepository.updateMemberRole.mockResolvedValue({
        userId: 'user-2',
        role: ProjectRole.OWNER,
        createdAt: new Date('2026-03-09T13:00:00.000Z'),
      });
      authProjectsRepository.findAuthorizedById.mockResolvedValue(null);

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: 'user-2',
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.transferOwnership('project-1', actor, {
          userId: 'user-2',
        }),
      ).rejects.toThrow('Project not found');
    });
  });
});

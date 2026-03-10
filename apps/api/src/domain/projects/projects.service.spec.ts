import { ForbiddenException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import type {
  CreateProjectDto,
  GetProjectsQueryDto,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectsService } from './projects.service';
import { ProjectAccessService } from './access/project-access.service';
import {
  CreateProjectWithOwnerInput,
  ProjectsRepository,
  ProjectWithRole,
} from './repositories/projects.repository';

describe('ProjectsService', () => {
  let service: ProjectsService;

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

    service = new ProjectsService(
      projectsRepository,
      projectAccessService,
      unitOfWork,
    );

    unitOfWork.transaction.mockImplementation(async (fn) =>
      fn(undefined as any),
    );
  });

  describe('create', () => {
    it('creates a project for the owner and returns a ProjectView', async () => {
      const dto: CreateProjectDto = {
        name: 'Project Alpha',
        description: 'Test project',
      };

      const project = makeProject();

      projectsRepository.createWithOwner.mockResolvedValue(project);

      const result = await service.create('user-1', dto);

      expect(projectsRepository.createWithOwner).toHaveBeenCalledWith({
        ownerId: 'user-1',
        name: dto.name,
        description: dto.description,
      } satisfies CreateProjectWithOwnerInput);

      expect(result).toEqual({
        id: 'project-1',
        name: 'Project Alpha',
        description: 'Test project',
        ownerId: 'user-1',
        archivedAt: null,
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.OWNER,
      });
    });
  });

  describe('findManyForUser', () => {
    it('returns paginated projects', async () => {
      const query: GetProjectsQueryDto = {
        page: 1,
        pageSize: 20,
        includeArchived: false,
      };

      projectsRepository.findManyForUser.mockResolvedValue({
        items: [makeProject()],
        total: 1,
        page: 1,
        pageSize: 20,
      });

      const result = await service.findManyForUser('user-1', query);

      expect(projectsRepository.findManyForUser).toHaveBeenCalledWith({
        userId: 'user-1',
        page: 1,
        pageSize: 20,
        includeArchived: false,
      });

      expect(result).toEqual({
        items: [
          {
            id: 'project-1',
            name: 'Project Alpha',
            description: 'Test project',
            ownerId: 'user-1',
            archivedAt: null,
            createdAt: '2026-03-09T12:00:00.000Z',
            updatedAt: '2026-03-09T12:00:00.000Z',
            currentUserRole: ProjectRole.OWNER,
          },
        ],
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('findById', () => {
    it('returns the project when the user is a member', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.MEMBER,
      });

      projectAccessService.requireMember.mockResolvedValue(project);

      const result = await service.findById('project-1', 'user-2');

      expect(projectAccessService.requireMember).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );

      expect(result).toEqual({
        id: 'project-1',
        name: 'Project Alpha',
        description: 'Test project',
        ownerId: 'user-1',
        archivedAt: null,
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.MEMBER,
      });
    });
  });

  describe('update', () => {
    it('allows ADMIN to update an active project', async () => {
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated description',
      };

      const authorizedProject = makeProject({
        currentUserRole: ProjectRole.ADMIN,
        archivedAt: null,
      });

      const updatedProject = makeProject({
        name: 'Updated Project',
        description: 'Updated description',
        currentUserRole: ProjectRole.ADMIN,
      });

      projectAccessService.requireRole.mockResolvedValue(authorizedProject);
      projectsRepository.updateForUser.mockResolvedValue(updatedProject);

      const result = await service.update('project-1', 'user-2', dto);

      expect(projectAccessService.requireRole).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        ProjectRole.ADMIN,
      );

      expect(projectsRepository.updateForUser).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        {
          name: 'Updated Project',
          description: 'Updated description',
        },
      );

      expect(result).toEqual({
        id: 'project-1',
        name: 'Updated Project',
        description: 'Updated description',
        ownerId: 'user-1',
        archivedAt: null,
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.ADMIN,
      });
    });

    it('throws when trying to update an archived project', async () => {
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      const archivedProject = makeProject({
        archivedAt: new Date('2026-03-09T13:00:00.000Z'),
        currentUserRole: ProjectRole.ADMIN,
      });

      projectAccessService.requireRole.mockResolvedValue(archivedProject);

      await expect(service.update('project-1', 'user-2', dto)).rejects.toThrow(
        new ForbiddenException('Archived projects cannot be modified'),
      );

      expect(projectsRepository.updateForUser).not.toHaveBeenCalled();
    });
  });

  describe('archive', () => {
    it('allows owner to archive an active project', async () => {
      const ownerProject = makeProject({
        archivedAt: null,
        currentUserRole: ProjectRole.OWNER,
      });

      const archivedProject = makeProject({
        archivedAt: new Date('2026-03-09T13:00:00.000Z'),
        currentUserRole: ProjectRole.OWNER,
      });

      projectAccessService.requireOwner.mockResolvedValue(ownerProject);
      projectsRepository.archiveForUser.mockResolvedValue(archivedProject);

      const result = await service.archive('project-1', 'user-1');

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(projectsRepository.archiveForUser).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(result).toEqual({
        id: 'project-1',
        name: 'Project Alpha',
        description: 'Test project',
        ownerId: 'user-1',
        archivedAt: '2026-03-09T13:00:00.000Z',
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.OWNER,
      });
    });

    it('throws when project is already archived', async () => {
      const archivedProject = makeProject({
        archivedAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      projectAccessService.requireOwner.mockResolvedValue(archivedProject);

      await expect(service.archive('project-1', 'user-1')).rejects.toThrow(
        new ForbiddenException('Project is already archived'),
      );

      expect(projectsRepository.archiveForUser).not.toHaveBeenCalled();
    });

    it('throws when a non-owner tries to archive the project', async () => {
      projectAccessService.requireOwner.mockRejectedValue(
        new ForbiddenException(
          'Only the project owner can perform this action',
        ),
      );

      await expect(service.archive('project-1', 'user-2')).rejects.toThrow(
        'Only the project owner can perform this action',
      );

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );
      expect(projectsRepository.archiveForUser).not.toHaveBeenCalled();
    });
  });

  describe('unarchive', () => {
    it('allows owner to unarchive an archived project', async () => {
      const archivedProject = makeProject({
        archivedAt: new Date('2026-03-09T13:00:00.000Z'),
      });

      const unarchivedProject = makeProject({
        archivedAt: null,
      });

      projectAccessService.requireOwner.mockResolvedValue(archivedProject);
      projectsRepository.unarchiveForUser.mockResolvedValue(unarchivedProject);

      const result = await service.unarchive('project-1', 'user-1');

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(projectsRepository.unarchiveForUser).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );

      expect(result).toEqual({
        id: 'project-1',
        name: 'Project Alpha',
        description: 'Test project',
        ownerId: 'user-1',
        archivedAt: null,
        createdAt: '2026-03-09T12:00:00.000Z',
        updatedAt: '2026-03-09T12:00:00.000Z',
        currentUserRole: ProjectRole.OWNER,
      });
    });

    it('throws when project is not archived', async () => {
      const activeProject = makeProject({
        archivedAt: null,
      });

      projectAccessService.requireOwner.mockResolvedValue(activeProject);

      await expect(service.unarchive('project-1', 'user-1')).rejects.toThrow(
        new ForbiddenException('Project is not archived'),
      );

      expect(projectsRepository.unarchiveForUser).not.toHaveBeenCalled();
    });

    it('throws when a non-owner tries to unarchive the project', async () => {
      projectAccessService.requireOwner.mockRejectedValue(
        new ForbiddenException(
          'Only the project owner can perform this action',
        ),
      );

      await expect(service.archive('project-1', 'user-2')).rejects.toThrow(
        'Only the project owner can perform this action',
      );

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );
      expect(projectsRepository.unarchiveForUser).not.toHaveBeenCalled();
    });
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
      ).rejects.toThrow('User is already a project member');

      expect(projectsRepository.addMember).not.toHaveBeenCalled();
    });

    it('throws when owner tries to add themselves', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.addMember('project-1', 'user-1', {
          userId: 'user-1',
          role: ProjectRole.MEMBER,
        }),
      ).rejects.toThrow('Owner is already a member of this project');

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
      ).rejects.toThrow('Owner role must be changed via ownership transfer');

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
      ).rejects.toThrow('Project member not found');

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
    });

    it('throws when trying to remove the owner', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());

      await expect(
        service.removeMember('project-1', 'user-1', 'user-1'),
      ).rejects.toThrow('Project owner cannot be removed');

      expect(projectsRepository.findMembership).not.toHaveBeenCalled();
      expect(projectsRepository.removeMember).not.toHaveBeenCalled();
    });

    it('throws when project member does not exist', async () => {
      projectAccessService.requireOwner.mockResolvedValue(makeProject());
      projectsRepository.findMembership.mockResolvedValue(null);

      await expect(
        service.removeMember('project-1', 'user-1', 'user-2'),
      ).rejects.toThrow('Project member not found');

      expect(projectsRepository.removeMember).not.toHaveBeenCalled();
    });
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
      ).rejects.toThrow('User is already the project owner');

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
      ).rejects.toThrow('Target user is not a project member');

      expect(projectsRepository.updateOwner).not.toHaveBeenCalled();
    });
  });
});

import { ForbiddenException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import type {
  CreateProjectDto,
  GetProjectsQueryDto,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectsService } from './projects.service';
import { ProjectAccessService } from './policies/project-access.service';
import { ProjectsRepository } from './repositories/projects.repository';
import {
  CreateProjectWithOwnerInput,
  ProjectWithRole,
} from './types/projects.repository.types';
import { PinoLogger } from 'nestjs-pino';

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

  const logger: jest.Mocked<PinoLogger> = {
    // core methods used in services
    setContext: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    // pino-logger specific extras (can be no-op)
    level: 'info',
    child: jest.fn() as any,
  } as unknown as jest.Mocked<PinoLogger>;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProjectsService(
      projectsRepository,
      projectAccessService,
      logger,
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

      expect(logger.info).toHaveBeenCalledWith(
        { event: 'project.created', ownerId: 'user-1', projectId: 'project-1' },
        'Project created successfully',
      );
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

      expect(logger.info).toHaveBeenCalledWith(
        { event: 'project.archived', userId: 'user-1', projectId: 'project-1' },
        'Project archived successfully',
      );
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

      await expect(service.unarchive('project-1', 'user-2')).rejects.toThrow(
        'Only the project owner can perform this action',
      );

      expect(projectAccessService.requireOwner).toHaveBeenCalledWith(
        'project-1',
        'user-2',
      );
      expect(projectsRepository.unarchiveForUser).not.toHaveBeenCalled();
    });
  });
});

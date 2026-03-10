import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { ProjectAccessService } from './project-access.service';
import type { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';
describe('ProjectAccessService', () => {
  let service: ProjectAccessService;
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
  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectAccessService(projectsRepository);
  });
  describe('getAuthorizedProject', () => {
    it('returns the project when the user is authorized', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.MEMBER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.getAuthorizedProject('project-1', 'user-2');
      expect(projectsRepository.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );
      expect(projectsRepository.findById).not.toHaveBeenCalled();
      expect(result).toBe(project);
    });
    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findAuthorizedById.mockResolvedValue(null);
      projectsRepository.findById.mockResolvedValue(null);
      await expect(
        service.getAuthorizedProject('project-1', 'user-2'),
      ).rejects.toThrow(NotFoundException);
      expect(projectsRepository.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );
      expect(projectsRepository.findById).toHaveBeenCalledWith(
        'project-1',
        undefined,
      );
    });
    it('throws ForbiddenException when the project exists but user is unauthorized', async () => {
      projectsRepository.findAuthorizedById.mockResolvedValue(null);
      projectsRepository.findById.mockResolvedValue(makeProject());
      await expect(
        service.getAuthorizedProject('project-1', 'user-2'),
      ).rejects.toThrow(ForbiddenException);
      expect(projectsRepository.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        undefined,
      );
      expect(projectsRepository.findById).toHaveBeenCalledWith(
        'project-1',
        undefined,
      );
    });
    it('passes db to both findAuthorizedById and findById when provided', async () => {
      const db = {} as any;
      projectsRepository.findAuthorizedById.mockResolvedValue(null);
      projectsRepository.findById.mockResolvedValue(null);
      await expect(
        service.getAuthorizedProject('project-1', 'user-2', db),
      ).rejects.toThrow(NotFoundException);
      expect(projectsRepository.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        'user-2',
        db,
      );
      expect(projectsRepository.findById).toHaveBeenCalledWith('project-1', db);
    });
  });
  describe('getUserRole', () => {
    it('returns the current user role', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.ADMIN,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.getUserRole('project-1', 'user-2');
      expect(result).toBe(ProjectRole.ADMIN);
    });
    it('returns null if currentUserRole is missing', async () => {
      const project = makeProject({
        currentUserRole: undefined,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.getUserRole('project-1', 'user-2');
      expect(result).toBeNull();
    });
  });
  describe('requireMember', () => {
    it('returns the authorized project', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.MEMBER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.requireMember('project-1', 'user-2');
      expect(result).toBe(project);
    });
  });
  describe('requireRole', () => {
    it('allows exact role match', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.ADMIN,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.requireRole(
        'project-1',
        'user-2',
        ProjectRole.ADMIN,
      );
      expect(result).toBe(project);
    });
    it('allows OWNER when ADMIN is required', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.OWNER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.requireRole(
        'project-1',
        'user-1',
        ProjectRole.ADMIN,
      );
      expect(result).toBe(project);
    });
    it('throws ForbiddenException when role is too low', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.MEMBER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      await expect(
        service.requireRole('project-1', 'user-2', ProjectRole.ADMIN),
      ).rejects.toThrow('Insufficient project permissions');
    });
    it('throws ForbiddenException when currentUserRole is missing', async () => {
      const project = makeProject({
        currentUserRole: undefined,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      await expect(
        service.requireRole('project-1', 'user-2', ProjectRole.MEMBER),
      ).rejects.toThrow(ForbiddenException);
    });
  });
  describe('requireOwner', () => {
    it('returns project for owner', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.OWNER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      const result = await service.requireOwner('project-1', 'user-1');
      expect(result).toBe(project);
    });
    it('throws ForbiddenException for admin', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.ADMIN,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      await expect(service.requireOwner('project-1', 'user-2')).rejects.toThrow(
        'Only the project owner can perform this action',
      );
    });
    it('throws ForbiddenException for member', async () => {
      const project = makeProject({
        currentUserRole: ProjectRole.MEMBER,
      });
      projectsRepository.findAuthorizedById.mockResolvedValue(project);
      await expect(service.requireOwner('project-1', 'user-2')).rejects.toThrow(
        'Only the project owner can perform this action',
      );
    });
  });
});

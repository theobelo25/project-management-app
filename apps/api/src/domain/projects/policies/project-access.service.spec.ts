import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProjectRole } from '@repo/database';
import { AuthUser } from '@repo/types';
import { ProjectAccessService } from './project-access.service';
import type { ProjectsRepository } from '../repositories/projects.repository';
import { ProjectWithRole } from '../types/projects.repository.types';

const user = (id: string, orgId = 'org-1'): AuthUser => ({ id, orgId });

describe('ProjectAccessService', () => {
  let service: ProjectAccessService;

  const repo: jest.Mocked<ProjectsRepository> = {
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

  const project = (overrides: Partial<ProjectWithRole> = {}): ProjectWithRole => ({
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
    service = new ProjectAccessService(repo);
  });

  describe('getAuthorizedProject', () => {
    it('returns row from findAuthorizedById when you have access', async () => {
      const row = project({ currentUserRole: ProjectRole.MEMBER });
      const u = user('user-2');
      repo.findAuthorizedById.mockResolvedValue(row);

      await expect(service.getAuthorizedProject('project-1', u)).resolves.toBe(
        row,
      );
      expect(repo.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        u.id,
        u.orgId,
        undefined,
      );
    });

    it('404 if neither authorized lookup nor raw project finds anything', async () => {
      const u = user('user-2');
      repo.findAuthorizedById.mockResolvedValue(null);
      repo.findById.mockResolvedValue(null);

      await expect(service.getAuthorizedProject('project-1', u)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('403 if project exists but you are not on it', async () => {
      const u = user('user-2');
      repo.findAuthorizedById.mockResolvedValue(null);
      repo.findById.mockResolvedValue(project());

      await expect(service.getAuthorizedProject('project-1', u)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('optional tx gets passed through', async () => {
      const tx = {} as any;
      const u = user('user-2');
      repo.findAuthorizedById.mockResolvedValue(null);
      repo.findById.mockResolvedValue(null);

      await expect(
        service.getAuthorizedProject('project-1', u, tx),
      ).rejects.toThrow(NotFoundException);

      expect(repo.findAuthorizedById).toHaveBeenCalledWith(
        'project-1',
        u.id,
        u.orgId,
        tx,
      );
    });
  });

  it('getUserRole: null when role missing on the row', async () => {
    repo.findAuthorizedById.mockResolvedValue(project({ currentUserRole: undefined }));
    expect(await service.getUserRole('project-1', user('2'))).toBeNull();
  });

  it('requireRole: owner can satisfy admin requirement', async () => {
    repo.findAuthorizedById.mockResolvedValue(project({ currentUserRole: ProjectRole.OWNER }));
    await expect(
      service.requireRole('project-1', user('1'), ProjectRole.ADMIN),
    ).resolves.toBeDefined();
  });

  it('requireRole: member cannot pass as admin', async () => {
    repo.findAuthorizedById.mockResolvedValue(project({ currentUserRole: ProjectRole.MEMBER }));
    await expect(
      service.requireRole('project-1', user('2'), ProjectRole.ADMIN),
    ).rejects.toThrow('Insufficient project permissions');
  });

  it('requireOwner: only owner role', async () => {
    repo.findAuthorizedById.mockResolvedValue(project({ currentUserRole: ProjectRole.OWNER }));
    await expect(
      service.requireOwner('project-1', user('1')),
    ).resolves.toBeDefined();

    repo.findAuthorizedById.mockResolvedValue(project({ currentUserRole: ProjectRole.ADMIN }));
    await expect(service.requireOwner('project-1', user('2'))).rejects.toThrow(
      'Only the project owner can perform this action',
    );
  });
});

import { Test } from '@nestjs/testing';
import { ProjectRole } from '@repo/database';
import type {
  CreateProjectDto,
  GetProjectsQueryDto,
  ProjectDetailView,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';

import { ProjectsController } from './projects.controller';
import { ProjectsFacade } from './projects.facade';
import { ProjectRoleGuard } from './guards/project-role.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const facade = {
    create: jest.fn(),
    findManyForUser: jest.fn(),
    findByIdDetail: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    getMembers: jest.fn(),
    addMember: jest.fn(),
    updateMemberRole: jest.fn(),
    removeMember: jest.fn(),
    transferOwnership: jest.fn(),
    delete: jest.fn(),
  };

  const user = { id: 'user-1', orgId: 'org-1' };

  const projectView: ProjectView = {
    id: 'project-1',
    name: 'Project Alpha',
    description: 'Test project',
    ownerId: 'user-1',
    archivedAt: null,
    createdAt: '2026-03-09T12:00:00.000Z',
    updatedAt: '2026-03-09T12:00:00.000Z',
    currentUserRole: ProjectRole.OWNER,
  };

  const detail: ProjectDetailView = {
    ...projectView,
    totalTasks: 2,
    completedTasks: 1,
    openTasks: 1,
    members: [],
    recentTasks: [],
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsFacade, useValue: facade }],
    })
      .overrideGuard(ProjectRoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = mod.get(ProjectsController);
    jest.clearAllMocks();
  });

  it('create + list + detail — thin wrappers', async () => {
    const dto: CreateProjectDto = { name: 'Project Alpha', description: 'Test' };
    facade.create.mockResolvedValue(projectView);
    expect(await controller.create(user as any, dto)).toBe(projectView);
    expect(facade.create).toHaveBeenCalledWith(user, dto);

    const query = {
      page: 1,
      pageSize: 20,
      includeArchived: false,
      filter: 'all',
      sort: 'updated-desc',
    } as GetProjectsQueryDto;

    const page = {
      items: [projectView],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    };
    facade.findManyForUser.mockResolvedValue(page);
    expect(await controller.findMany(user as any, query)).toBe(page);

    facade.findByIdDetail.mockResolvedValue(detail);
    expect(await controller.findById(user as any, { id: 'project-1' })).toBe(
      detail,
    );
    expect(facade.findByIdDetail).toHaveBeenCalledWith('project-1', user);
  });

  it('patch flows forward ids + user (+ optional current project)', async () => {
    const dto: UpdateProjectDto = { name: 'Updated' };
    facade.update.mockResolvedValue(projectView);
    await controller.update(user as any, { id: 'project-1' }, dto);
    expect(facade.update).toHaveBeenCalledWith('project-1', user, dto, undefined);

    facade.archive.mockResolvedValue(projectView);
    await controller.archive(user as any, { id: 'project-1' });
    expect(facade.archive).toHaveBeenCalledWith('project-1', user, undefined);

    facade.unarchive.mockResolvedValue(projectView);
    await controller.unarchive(user as any, { id: 'project-1' });
    expect(facade.unarchive).toHaveBeenCalledWith('project-1', user, undefined);

    facade.delete.mockResolvedValue(undefined);
    await controller.delete(user as any, { id: 'project-1' });
    expect(facade.delete).toHaveBeenCalledWith('project-1', user, undefined);
  });

  it('members + ownership — same idea', async () => {
    const membersPayload = {
      items: [
        {
          userId: 'user-1',
          role: ProjectRole.OWNER,
          joinedAt: '2026-03-09T12:00:00.000Z',
        },
      ],
    };
    facade.getMembers.mockResolvedValue(membersPayload);
    expect(
      await controller.getMembers(
        user as any,
        { id: 'project-1' } as any,
        projectView as any,
      ),
    ).toBe(membersPayload);

    const memberRow = {
      userId: 'user-2',
      role: ProjectRole.MEMBER,
      joinedAt: '2026-03-09T13:00:00.000Z',
    };
    facade.addMember.mockResolvedValue(memberRow);
    await controller.addMember(
      user as any,
      { id: 'project-1' },
      { userId: 'user-2', role: ProjectRole.MEMBER },
    );
    expect(facade.addMember).toHaveBeenCalledWith(
      'project-1',
      user,
      { userId: 'user-2', role: ProjectRole.MEMBER },
      undefined,
    );

    facade.updateMemberRole.mockResolvedValue({ ...memberRow, role: ProjectRole.ADMIN });
    await controller.updateMemberRole(
      user as any,
      { id: 'project-1', userId: 'user-2' },
      { role: ProjectRole.ADMIN },
    );

    facade.removeMember.mockResolvedValue(undefined);
    expect(
      await controller.removeMember(user as any, {
        id: 'project-1',
        userId: 'user-2',
      }),
    ).toBeUndefined();

    facade.transferOwnership.mockResolvedValue(projectView);
    await controller.transferOwnership(
      user as any,
      { id: 'project-1' },
      { userId: 'user-2' },
    );
    expect(facade.transferOwnership).toHaveBeenCalledWith(
      'project-1',
      user,
      { userId: 'user-2' },
      undefined,
    );
  });
});

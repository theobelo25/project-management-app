import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsFacade } from './projects.facade';
import { ProjectRole } from '@repo/database';
import type {
  CreateProjectDto,
  GetProjectsQueryDto,
  ProjectDetailView,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectRoleGuard } from './guards/project-role.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const projectsFacade = {
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

  const user = {
    id: 'user-1',
    orgId: 'org-1',
  };

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

  const projectDetailView: ProjectDetailView = {
    ...projectView,
    totalTasks: 2,
    completedTasks: 1,
    openTasks: 1,
    members: [],
    recentTasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsFacade,
          useValue: projectsFacade,
        },
      ],
    })
      .overrideGuard(ProjectRoleGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();
    controller = module.get<ProjectsController>(ProjectsController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('calls projectsFacade.create', async () => {
      const dto: CreateProjectDto = {
        name: 'Project Alpha',
        description: 'Test project',
      };

      projectsFacade.create.mockResolvedValue(projectView);

      const result = await controller.create(user as any, dto);

      expect(projectsFacade.create).toHaveBeenCalledWith(user, dto);
      expect(result).toEqual(projectView);
    });
  });

  describe('findMany', () => {
    it('calls projectsFacade.findManyForUser', async () => {
      const query: GetProjectsQueryDto = {
        page: 1,
        pageSize: 20,
        includeArchived: false,
        search: undefined,
        filter: 'all',
        sort: 'updated-desc',
      };

      const response = {
        items: [projectView],
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      };

      projectsFacade.findManyForUser.mockResolvedValue(response);

      const result = await controller.findMany(user as any, query);

      expect(projectsFacade.findManyForUser).toHaveBeenCalledWith(user, query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('calls projectsFacade.findByIdDetail', async () => {
      projectsFacade.findByIdDetail.mockResolvedValue(projectDetailView);

      const result = await controller.findById(user as any, {
        id: 'project-1',
      });

      expect(projectsFacade.findByIdDetail).toHaveBeenCalledWith(
        'project-1',
        user,
      );
      expect(result).toEqual(projectDetailView);
    });
  });

  describe('update', () => {
    it('calls projectsFacade.update', async () => {
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      projectsFacade.update.mockResolvedValue(projectView);

      const result = await controller.update(
        user as any,
        { id: 'project-1' },
        dto,
      );

      expect(projectsFacade.update).toHaveBeenCalledWith(
        'project-1',
        user,
        dto,
        undefined,
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('archive', () => {
    it('calls projectsFacade.archive', async () => {
      projectsFacade.archive.mockResolvedValue(projectView);

      const result = await controller.archive(user as any, { id: 'project-1' });

      expect(projectsFacade.archive).toHaveBeenCalledWith(
        'project-1',
        user,
        undefined,
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('unarchive', () => {
    it('calls projectsFacade.unarchive', async () => {
      projectsFacade.unarchive.mockResolvedValue(projectView);

      const result = await controller.unarchive(user as any, {
        id: 'project-1',
      });

      expect(projectsFacade.unarchive).toHaveBeenCalledWith(
        'project-1',
        user,
        undefined,
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('getMembers', () => {
    it('calls projectsFacade.getMembers', async () => {
      const response = {
        items: [
          {
            userId: 'user-1',
            role: ProjectRole.OWNER,
            joinedAt: '2026-03-09T12:00:00.000Z',
          },
        ],
      };

      projectsFacade.getMembers.mockResolvedValue(response);

      const result = await controller.getMembers(
        user as any,
        { id: 'project-1' } as any,
        projectView as any,
      );

      expect(projectsFacade.getMembers).toHaveBeenCalledWith(
        'project-1',
        user,
        projectView,
      );
      expect(result).toEqual(response);
    });
  });

  describe('addMember', () => {
    it('calls projectsFacade.addMember', async () => {
      const response = {
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        joinedAt: '2026-03-09T13:00:00.000Z',
      };

      projectsFacade.addMember.mockResolvedValue(response);

      const result = await controller.addMember(
        user as any,
        { id: 'project-1' },
        {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        },
      );

      expect(projectsFacade.addMember).toHaveBeenCalledWith(
        'project-1',
        user,
        {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        },
        undefined,
      );
      expect(result).toEqual(response);
    });
  });

  describe('updateMemberRole', () => {
    it('calls projectsFacade.updateMemberRole', async () => {
      const response = {
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        joinedAt: '2026-03-09T13:00:00.000Z',
      };

      projectsFacade.updateMemberRole.mockResolvedValue(response);

      const result = await controller.updateMemberRole(
        user as any,
        { id: 'project-1', userId: 'user-2' },
        { role: ProjectRole.ADMIN },
      );

      expect(projectsFacade.updateMemberRole).toHaveBeenCalledWith(
        'project-1',
        user,
        'user-2',
        { role: ProjectRole.ADMIN },
        undefined,
      );
      expect(result).toEqual(response);
    });
  });

  describe('removeMember', () => {
    it('calls projectsFacade.removeMember', async () => {
      projectsFacade.removeMember.mockResolvedValue(undefined);

      const result = await controller.removeMember(user as any, {
        id: 'project-1',
        userId: 'user-2',
      });

      expect(projectsFacade.removeMember).toHaveBeenCalledWith(
        'project-1',
        user,
        'user-2',
        undefined,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('transferOwnership', () => {
    it('calls projectsFacade.transferOwnership', async () => {
      projectsFacade.transferOwnership.mockResolvedValue(projectView);

      const result = await controller.transferOwnership(
        user as any,
        { id: 'project-1' },
        { userId: 'user-2' },
      );

      expect(projectsFacade.transferOwnership).toHaveBeenCalledWith(
        'project-1',
        user,
        { userId: 'user-2' },
        undefined,
      );
      expect(result).toEqual(projectView);
    });
  });
});

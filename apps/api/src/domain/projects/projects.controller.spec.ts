import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';
import { ProjectRole } from '@repo/database';
import type {
  CreateProjectDto,
  GetProjectsQueryDto,
  ProjectView,
  UpdateProjectDto,
} from '@repo/types';
import { ProjectRoleGuard } from './guards/project-role.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const projectsService = {
    create: jest.fn(),
    findManyForUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
  };

  const projectMembersService = {
    getMembers: jest.fn(),
    addMember: jest.fn(),
    updateMemberRole: jest.fn(),
    removeMember: jest.fn(),
  };

  const projectOwnershipService = {
    transferOwnership: jest.fn(),
  };

  const user = {
    id: 'user-1',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: projectsService,
        },
        {
          provide: ProjectMembersService,
          useValue: projectMembersService,
        },
        {
          provide: ProjectOwnershipService,
          useValue: projectOwnershipService,
        },
      ],
    })
      .overrideGuard(ProjectRoleGuard) // <-- override the guard
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();
    controller = module.get<ProjectsController>(ProjectsController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('calls projectsService.create', async () => {
      const dto: CreateProjectDto = {
        name: 'Project Alpha',
        description: 'Test project',
      };

      projectsService.create.mockResolvedValue(projectView);

      const result = await controller.create(user as any, dto);

      expect(projectsService.create).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(projectView);
    });
  });

  describe('findMany', () => {
    it('calls projectsService.findManyForUser', async () => {
      const query: GetProjectsQueryDto = {
        page: 1,
        pageSize: 20,
        includeArchived: false,
      };

      const response = {
        items: [projectView],
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      };

      projectsService.findManyForUser.mockResolvedValue(response);

      const result = await controller.findMany(user as any, query);

      expect(projectsService.findManyForUser).toHaveBeenCalledWith(
        'user-1',
        query,
      );
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('calls projectsService.findById', async () => {
      projectsService.findById.mockResolvedValue(projectView);

      const result = await controller.findById(user as any, {
        id: 'project-1',
      });

      expect(projectsService.findById).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('update', () => {
    it('calls projectsService.update', async () => {
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
      };

      projectsService.update.mockResolvedValue(projectView);

      const result = await controller.update(
        user as any,
        { id: 'project-1' },
        dto,
      );

      expect(projectsService.update).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        dto,
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('archive', () => {
    it('calls projectsService.archive', async () => {
      projectsService.archive.mockResolvedValue(projectView);

      const result = await controller.archive(user as any, { id: 'project-1' });

      expect(projectsService.archive).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('unarchive', () => {
    it('calls projectsService.unarchive', async () => {
      projectsService.unarchive.mockResolvedValue(projectView);

      const result = await controller.unarchive(user as any, {
        id: 'project-1',
      });

      expect(projectsService.unarchive).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );
      expect(result).toEqual(projectView);
    });
  });

  describe('getMembers', () => {
    it('calls projectMembersService.getMembers', async () => {
      const response = {
        items: [
          {
            userId: 'user-1',
            role: ProjectRole.OWNER,
            joinedAt: '2026-03-09T12:00:00.000Z',
          },
        ],
      };

      projectMembersService.getMembers.mockResolvedValue(response);

      const result = await controller.getMembers(user as any, {
        id: 'project-1',
      });

      expect(projectMembersService.getMembers).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );
      expect(result).toEqual(response);
    });
  });

  describe('addMember', () => {
    it('calls projectMembersService.addMember', async () => {
      const response = {
        userId: 'user-2',
        role: ProjectRole.MEMBER,
        joinedAt: '2026-03-09T13:00:00.000Z',
      };

      projectMembersService.addMember.mockResolvedValue(response);

      const result = await controller.addMember(
        user as any,
        { id: 'project-1' },
        {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        },
      );

      expect(projectMembersService.addMember).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        {
          userId: 'user-2',
          role: ProjectRole.MEMBER,
        },
      );
      expect(result).toEqual(response);
    });
  });

  describe('updateMemberRole', () => {
    it('calls projectMembersService.updateMemberRole', async () => {
      const response = {
        userId: 'user-2',
        role: ProjectRole.ADMIN,
        joinedAt: '2026-03-09T13:00:00.000Z',
      };

      projectMembersService.updateMemberRole.mockResolvedValue(response);

      const result = await controller.updateMemberRole(
        user as any,
        { id: 'project-1', userId: 'user-2' },
        { role: ProjectRole.ADMIN },
      );

      expect(projectMembersService.updateMemberRole).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        'user-2',
        { role: ProjectRole.ADMIN },
      );
      expect(result).toEqual(response);
    });
  });

  describe('removeMember', () => {
    it('calls projectMembersService.removeMember', async () => {
      projectMembersService.removeMember.mockResolvedValue(undefined);

      const result = await controller.removeMember(user as any, {
        id: 'project-1',
        userId: 'user-2',
      });

      expect(projectMembersService.removeMember).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        'user-2',
      );
      expect(result).toBeUndefined();
    });
  });

  describe('transferOwnership', () => {
    it('calls projectOwnershipService.transferOwnership', async () => {
      projectOwnershipService.transferOwnership.mockResolvedValue(projectView);

      const result = await controller.transferOwnership(
        user as any,
        { id: 'project-1' },
        { userId: 'user-2' },
      );

      expect(projectOwnershipService.transferOwnership).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        { userId: 'user-2' },
      );
      expect(result).toEqual(projectView);
    });
  });
});

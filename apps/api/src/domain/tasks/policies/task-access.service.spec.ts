import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectRole } from '@repo/database';

import { AuthUser } from '@repo/types';
import { TaskAccessService } from './task-access.service';
import { TaskAccessContext } from '../types/tasks.repository.types';
import { TaskAccessRules } from './task-access.rules';
import { TaskAccessContextLoader } from './task-access-context.loader';

describe('TaskAccessService', () => {
  let service: TaskAccessService;

  let tasksRepository: {
    findByIdWithAccessContext: jest.Mock;
  };

  let projectsRepository: {
    findByIdWithMemberRole: jest.Mock;
  };

  let logger: {
    warn: jest.Mock;
    debug: jest.Mock;
  };

  let contextLoader: {
    findProjectWithMemberRole: jest.Mock;
    findTaskAccessContext: jest.Mock;
  };

  const user: AuthUser = {
    id: 'user-1',
    orgId: 'org-1',
  };

  const makeTaskAccessContext = (
    overrides: Partial<TaskAccessContext> = {},
  ): TaskAccessContext =>
    ({
      id: 'task-1',
      projectId: 'project-1',
      createdById: 'creator-1',
      assignees: [],
      project: {
        orgId: user.orgId,
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.MEMBER,
      },
      ...overrides,
    }) as TaskAccessContext;

  beforeEach(() => {
    contextLoader = {
      findProjectWithMemberRole: jest.fn(),
      findTaskAccessContext: jest.fn(),
    };

    service = new TaskAccessService(
      contextLoader as unknown as TaskAccessContextLoader,
      logger as unknown as PinoLogger,
      new TaskAccessRules(),
    );

    tasksRepository = {
      findByIdWithAccessContext: jest.fn(),
    };

    projectsRepository = {
      findByIdWithMemberRole: jest.fn(),
    };

    logger = {
      warn: jest.fn(),
      debug: jest.fn(),
    };
  });

  describe('assertCanCreateInProject', () => {
    it('allows the project owner to create a task', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: user.id,
        currentUserRole: null,
      });

      await expect(
        service.assertCanCreateInProject(user, 'project-1'),
      ).resolves.toBeUndefined();

      expect(projectsRepository.findByIdWithMemberRole).toHaveBeenCalledWith(
        'project-1',
        user.id,
        user.orgId,
      );

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: user.id,
          role: ProjectRole.OWNER,
        },
        'Task create access granted',
      );
    });

    it('allows an admin to create a task', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.ADMIN,
      });

      await expect(
        service.assertCanCreateInProject(user, 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: user.id,
          role: ProjectRole.ADMIN,
        },
        'Task create access granted',
      );
    });

    it('allows a member to create a task', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.MEMBER,
      });

      await expect(
        service.assertCanCreateInProject(user, 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: user.id,
          role: ProjectRole.MEMBER,
        },
        'Task create access granted',
      );
    });

    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue(null);

      await expect(
        service.assertCanCreateInProject(user, 'project-1'),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.not_found',
          projectId: 'project-1',
          userId: user.id,
        },
        'Project not found during task create access check',
      );
    });

    it('throws ForbiddenException when the user has no project role', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'owner-1',
        currentUserRole: null,
      });

      await expect(
        service.assertCanCreateInProject(user, 'project-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.forbidden',
          projectId: 'project-1',
          userId: user.id,
        },
        'Task create access denied: user has no project access',
      );
    });
  });

  describe('assertCanReadProject', () => {
    it('allows a user with project access to read project tasks', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.MEMBER,
      });

      await expect(
        service.assertCanReadProject(user, 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.allowed',
          projectId: 'project-1',
          userId: user.id,
          role: ProjectRole.MEMBER,
        },
        'Task project read access granted',
      );
    });

    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue(null);

      await expect(
        service.assertCanReadProject(user, 'project-1'),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.not_found',
          projectId: 'project-1',
          userId: user.id,
        },
        'Project not found during task project read access check',
      );
    });

    it('throws ForbiddenException when the user has no role on the project', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'owner-1',
        currentUserRole: null,
      });

      await expect(
        service.assertCanReadProject(user, 'project-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.forbidden',
          projectId: 'project-1',
          userId: user.id,
        },
        'Task project read access denied',
      );
    });
  });

  describe('getAccessibleTaskOrThrow', () => {
    it('returns the task when the user is the project owner', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: user.id,
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', user),
      ).resolves.toEqual(task);

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task read access granted',
      );
    });

    it('returns the task when the user has a project role', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', user),
      ).resolves.toEqual(task);

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.MEMBER,
        },
        'Task read access granted',
      );
    });

    it('throws NotFoundException when the task does not exist', async () => {
      tasksRepository.findByIdWithAccessContext.mockResolvedValue(null);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', user),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read.not_found',
          taskId: 'task-1',
          userId: user.id,
        },
        'Task not found during access check',
      );
    });

    it('throws ForbiddenException when the user cannot read the task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', user),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read.forbidden',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          ownerId: task.project.ownerId,
        },
        'Task read access denied',
      );
    });
  });

  describe('assertCanRead', () => {
    it('allows access when getAccessibleTaskOrThrow succeeds', async () => {
      const task = makeTaskAccessContext();
      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanRead('task-1', user),
      ).resolves.toBeUndefined();
    });
  });

  describe('assertCanUpdate', () => {
    it('allows the project owner to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: user.id,
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task update access granted',
      );
    });

    it('allows an admin to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task update access granted',
      );
    });

    it('allows an assignee to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
        assignees: [{ userId: user.id }],
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.MEMBER,
        },
        'Task update access granted',
      );
    });

    it('throws ForbiddenException when the user cannot update the task', async () => {
      const task = makeTaskAccessContext({
        createdById: 'creator-1',
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
        assignees: [{ userId: 'someone-else' }],
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanUpdate('task-1', user)).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.update.forbidden',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task update access denied',
      );
    });
  });

  describe('assertCanDelete', () => {
    it('allows the project owner to delete a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: user.id,
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task delete access granted',
      );
    });

    it('allows an admin to delete a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task delete access granted',
      );
    });

    it('allows the task creator to delete a task', async () => {
      const task = makeTaskAccessContext({
        createdById: user.id,
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.MEMBER,
        },
        'Task delete access granted',
      );
    });

    it('throws ForbiddenException when the user cannot delete the task', async () => {
      const task = makeTaskAccessContext({
        createdById: 'creator-1',
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanDelete('task-1', user)).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.forbidden',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
          createdById: task.createdById,
        },
        'Task delete access denied',
      );
    });
  });

  describe('assertCanAssign', () => {
    it('allows the project owner to assign a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: user.id,
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanAssign('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access granted',
      );
    });

    it('allows an admin to assign a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanAssign('task-1', user),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.allowed',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task assignment access granted',
      );
    });

    it('throws ForbiddenException when a non-admin non-owner tries to assign a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          orgId: user.orgId,
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanAssign('task-1', user)).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.forbidden',
          taskId: 'task-1',
          userId: user.id,
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access denied',
      );
    });
  });
});

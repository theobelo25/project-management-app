import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectRole } from '@repo/database';

import { TaskAccessService } from './task-access.service';
import { TasksRepository } from '../repositories/tasks.repository';
import { ProjectsRepository } from '@api/domain/projects/repositories/projects.repository';
import { TaskAccessContext } from '../types/tasks.repository.types';

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

  const makeTaskAccessContext = (
    overrides: Partial<TaskAccessContext> = {},
  ): TaskAccessContext =>
    ({
      id: 'task-1',
      projectId: 'project-1',
      createdById: 'creator-1',
      assignees: [],
      project: {
        ownerId: 'owner-1',
        currentUserRole: ProjectRole.MEMBER,
      },
      ...overrides,
    }) as TaskAccessContext;

  beforeEach(() => {
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

    service = new TaskAccessService(
      tasksRepository as unknown as TasksRepository,
      projectsRepository as unknown as ProjectsRepository,
      logger as unknown as PinoLogger,
    );
  });

  describe('assertCanCreateInProject', () => {
    it('allows the project owner to create a task', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue({
        id: 'project-1',
        ownerId: 'user-1',
        currentUserRole: null,
      });

      await expect(
        service.assertCanCreateInProject('user-1', 'project-1'),
      ).resolves.toBeUndefined();

      expect(projectsRepository.findByIdWithMemberRole).toHaveBeenCalledWith(
        'project-1',
        'user-1',
      );
      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: 'user-1',
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
        service.assertCanCreateInProject('user-1', 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: 'user-1',
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
        service.assertCanCreateInProject('user-1', 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.allowed',
          projectId: 'project-1',
          userId: 'user-1',
          role: ProjectRole.MEMBER,
        },
        'Task create access granted',
      );
    });

    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue(null);

      await expect(
        service.assertCanCreateInProject('user-1', 'project-1'),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.not_found',
          projectId: 'project-1',
          userId: 'user-1',
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
        service.assertCanCreateInProject('user-1', 'project-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.create_project.forbidden',
          projectId: 'project-1',
          userId: 'user-1',
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
        service.assertCanReadProject('user-1', 'project-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.allowed',
          projectId: 'project-1',
          userId: 'user-1',
          role: ProjectRole.MEMBER,
        },
        'Task project read access granted',
      );
    });

    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findByIdWithMemberRole.mockResolvedValue(null);

      await expect(
        service.assertCanReadProject('user-1', 'project-1'),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.not_found',
          projectId: 'project-1',
          userId: 'user-1',
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
        service.assertCanReadProject('user-1', 'project-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read_project.forbidden',
          projectId: 'project-1',
          userId: 'user-1',
        },
        'Task project read access denied',
      );
    });
  });

  describe('getAccessibleTaskOrThrow', () => {
    it('returns the task when the user is the project owner', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'user-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', 'user-1'),
      ).resolves.toEqual(task);

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task read access granted',
      );
    });

    it('returns the task when the user has a project role', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', 'user-1'),
      ).resolves.toEqual(task);

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.read.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: ProjectRole.MEMBER,
        },
        'Task read access granted',
      );
    });

    it('throws NotFoundException when the task does not exist', async () => {
      tasksRepository.findByIdWithAccessContext.mockResolvedValue(null);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', 'user-1'),
      ).rejects.toThrow(NotFoundException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read.not_found',
          taskId: 'task-1',
          userId: 'user-1',
        },
        'Task not found during access check',
      );
    });

    it('throws ForbiddenException when the user cannot read the task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.getAccessibleTaskOrThrow('task-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.read.forbidden',
          taskId: 'task-1',
          userId: 'user-1',
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
        service.assertCanRead('task-1', 'user-1'),
      ).resolves.toBeUndefined();
    });
  });

  describe('assertCanUpdate', () => {
    it('allows the project owner to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'user-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task update access granted',
      );
    });

    it('allows an admin to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task update access granted',
      );
    });

    it('allows an assignee to update a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
        assignees: [{ userId: 'user-1' }],
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanUpdate('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.update.allowed',
          taskId: 'task-1',
          userId: 'user-1',
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
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
        assignees: [{ userId: 'someone-else' }],
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanUpdate('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.update.forbidden',
          taskId: 'task-1',
          userId: 'user-1',
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
          ownerId: 'user-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task delete access granted',
      );
    });

    it('allows an admin to delete a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task delete access granted',
      );
    });

    it('allows the task creator to delete a task', async () => {
      const task = makeTaskAccessContext({
        createdById: 'user-1',
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanDelete('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task delete access granted',
      );
    });

    it('throws ForbiddenException when the user cannot delete the task', async () => {
      const task = makeTaskAccessContext({
        createdById: 'creator-1',
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanDelete('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.delete.forbidden',
          taskId: 'task-1',
          userId: 'user-1',
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
          ownerId: 'user-1',
          currentUserRole: null,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanAssign('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access granted',
      );
    });

    it('allows an admin to assign a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.ADMIN,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(
        service.assertCanAssign('task-1', 'user-1'),
      ).resolves.toBeUndefined();

      expect(logger.debug).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.allowed',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: ProjectRole.ADMIN,
        },
        'Task assignment access granted',
      );
    });

    it('throws ForbiddenException when a non-admin non-owner tries to assign a task', async () => {
      const task = makeTaskAccessContext({
        project: {
          ownerId: 'owner-1',
          currentUserRole: ProjectRole.MEMBER,
        },
      });

      tasksRepository.findByIdWithAccessContext.mockResolvedValue(task);

      await expect(service.assertCanAssign('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );

      expect(logger.warn).toHaveBeenCalledWith(
        {
          event: 'task.access.assign.forbidden',
          taskId: 'task-1',
          userId: 'user-1',
          projectId: task.projectId,
          currentUserRole: task.project.currentUserRole,
        },
        'Task assignment access denied',
      );
    });
  });
});

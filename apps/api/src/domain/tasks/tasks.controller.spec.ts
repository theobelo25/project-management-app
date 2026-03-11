import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { TaskIdParamDto } from './dto/task-id-param.dto';
import { TaskAssigneeParamsDto } from './dto/task-assignee-params.dto';
import {
  AuthUser,
  PaginationResult,
  TaskAssignmentView,
  TaskView,
} from '@repo/types';

describe('TasksController', () => {
  let controller: TasksController;

  let tasksService: {
    create: jest.Mock;
    findById: jest.Mock;
    findMany: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    assignUser: jest.Mock;
    unassignUser: jest.Mock;
  };

  const user: AuthUser = {
    id: 'user-1',
    email: 'test@example.com',
  } as AuthUser;

  beforeEach(() => {
    tasksService = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      assignUser: jest.fn(),
      unassignUser: jest.fn(),
    };

    controller = new TasksController(tasksService as unknown as TasksService);
  });

  describe('create', () => {
    it('calls tasksService.create with the current user id and request body', async () => {
      const body: CreateTaskDto = {
        title: 'Build controller tests',
        description: 'Write tests for TasksController',
        projectId: 'project-1',
      };

      const taskView: TaskView = {
        id: 'task-1',
        title: 'Build controller tests',
      } as TaskView;

      tasksService.create.mockResolvedValue(taskView);

      const result = await controller.create(user, body);

      expect(tasksService.create).toHaveBeenCalledWith(user.id, body);
      expect(result).toEqual(taskView);
    });
  });

  describe('findById', () => {
    it('calls tasksService.findById with the route taskId and current user id', async () => {
      const params: TaskIdParamDto = {
        taskId: 'task-1',
      };

      const taskView: TaskView = {
        id: 'task-1',
        title: 'Task title',
      } as TaskView;

      tasksService.findById.mockResolvedValue(taskView);

      const result = await controller.findById(user, params);

      expect(tasksService.findById).toHaveBeenCalledWith(
        params.taskId,
        user.id,
      );
      expect(result).toEqual(taskView);
    });
  });

  describe('findMany', () => {
    it('calls tasksService.findMany with the current user id and query', async () => {
      const query: FindTasksQueryDto = {
        projectId: 'project-1',
      } as FindTasksQueryDto;

      const paginatedResult: PaginationResult<TaskView> = {
        data: [
          {
            id: 'task-1',
            projectId: 'project-1',
            title: 'Task 1',
            description: null,
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: null,
            position: 1,
            createdById: 'user-1',
            createdAt: '2026-03-11T12:00:00.000Z',
            updatedAt: '2026-03-11T12:00:00.000Z',
            assignees: [],
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          pageCount: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      tasksService.findMany.mockResolvedValue(paginatedResult);

      const result = await controller.findMany(user, query);

      expect(tasksService.findMany).toHaveBeenCalledWith(user.id, query);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('update', () => {
    it('calls tasksService.update with taskId, user id, and body', async () => {
      const params: TaskIdParamDto = {
        taskId: 'task-1',
      };

      const body: UpdateTaskDto = {
        title: 'Updated title',
        description: 'Updated description',
      };

      const taskView: TaskView = {
        id: 'task-1',
        title: 'Updated title',
      } as TaskView;

      tasksService.update.mockResolvedValue(taskView);

      const result = await controller.update(user, params, body);

      expect(tasksService.update).toHaveBeenCalledWith(
        params.taskId,
        user.id,
        body,
      );
      expect(result).toEqual(taskView);
    });
  });

  describe('delete', () => {
    it('calls tasksService.delete with taskId and current user id', async () => {
      const params: TaskIdParamDto = {
        taskId: 'task-1',
      };

      tasksService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(user, params);

      expect(tasksService.delete).toHaveBeenCalledWith(params.taskId, user.id);
      expect(result).toBeUndefined();
    });
  });

  describe('assignUser', () => {
    it('calls tasksService.assignUser with taskId, assignee userId, and current user id', async () => {
      const params: TaskAssigneeParamsDto = {
        taskId: 'task-1',
        userId: 'user-2',
      };

      const assignmentView: TaskAssignmentView = {
        taskId: 'task-1',
        userId: 'user-2',
      } as TaskAssignmentView;

      tasksService.assignUser.mockResolvedValue(assignmentView);

      const result = await controller.assignUser(user, params);

      expect(tasksService.assignUser).toHaveBeenCalledWith(
        params.taskId,
        params.userId,
        user.id,
      );
      expect(result).toEqual(assignmentView);
    });
  });

  describe('unassignUser', () => {
    it('calls tasksService.unassignUser with taskId, assignee userId, and current user id', async () => {
      const params: TaskAssigneeParamsDto = {
        taskId: 'task-1',
        userId: 'user-2',
      };

      tasksService.unassignUser.mockResolvedValue(undefined);

      const result = await controller.unassignUser(user, params);

      expect(tasksService.unassignUser).toHaveBeenCalledWith(
        params.taskId,
        params.userId,
        user.id,
      );
      expect(result).toBeUndefined();
    });
  });
});

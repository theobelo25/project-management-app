import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { TaskAccessService } from './policies/task-access.service';
import { PinoLogger } from 'nestjs-pino';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksInput } from './types/tasks.repository.types';
import {
  toCreateTaskInput,
  toTaskView,
  toTaskViews,
  toUpdateTaskInput,
} from './mappers/tasks.mapper';
import { toTaskAssignmentView } from './mappers/task-assignment.mapper';

jest.mock('./mappers/tasks.mapper', () => ({
  toCreateTaskInput: jest.fn(),
  toTaskView: jest.fn(),
  toTaskViews: jest.fn(),
  toUpdateTaskInput: jest.fn(),
}));

jest.mock('./mappers/task-assignment.mapper', () => ({
  toTaskAssignmentView: jest.fn(),
}));

describe('TasksService', () => {
  let service: TasksService;

  let taskAccessService: {
    assertCanCreateInProject: jest.Mock;
    assertCanUpdate: jest.Mock;
    assertCanRead: jest.Mock;
    assertCanReadProject: jest.Mock;
    assertCanDelete: jest.Mock;
    assertCanAssign: jest.Mock;
  };

  let tasksRepository: {
    create: jest.Mock;
    update: jest.Mock;
    findByIdOrThrow: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
    assignUser: jest.Mock;
    unassignUser: jest.Mock;
  };

  let logger: {
    info: jest.Mock;
  };

  beforeEach(() => {
    taskAccessService = {
      assertCanCreateInProject: jest.fn(),
      assertCanUpdate: jest.fn(),
      assertCanRead: jest.fn(),
      assertCanReadProject: jest.fn(),
      assertCanDelete: jest.fn(),
      assertCanAssign: jest.fn(),
    };

    tasksRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findByIdOrThrow: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      assignUser: jest.fn(),
      unassignUser: jest.fn(),
    };

    logger = {
      info: jest.fn(),
    };

    service = new TasksService(
      taskAccessService as unknown as TaskAccessService,
      tasksRepository as unknown as TasksRepository,
      logger as unknown as PinoLogger,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a task after checking project access, logs, and returns the mapped view', async () => {
      const userId = 'user-1';
      const dto: CreateTaskDto = {
        title: 'Build tests',
        description: 'Write unit tests for tasks service',
        projectId: 'project-1',
      };

      const createInput = {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        createdById: userId,
      };

      const task = {
        id: 'task-1',
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        createdById: userId,
      };

      const taskView = {
        id: 'task-1',
        title: dto.title,
      };

      (toCreateTaskInput as jest.Mock).mockReturnValue(createInput);
      tasksRepository.create.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.create(userId, dto);

      expect(taskAccessService.assertCanCreateInProject).toHaveBeenCalledWith(
        userId,
        dto.projectId,
      );
      expect(toCreateTaskInput).toHaveBeenCalledWith(dto, userId);
      expect(tasksRepository.create).toHaveBeenCalledWith(createInput);
      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'task.created',
          taskId: task.id,
          createdById: task.createdById,
          projectId: task.projectId,
        },
        'Task created successfully',
      );
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
    });
  });

  describe('update', () => {
    it('updates a task after checking access, logs, and returns the mapped view', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const dto: UpdateTaskDto = {
        title: 'Updated title',
        description: 'Updated description',
      };

      const updateInput = {
        title: dto.title,
        description: dto.description,
      };

      const task = {
        id: taskId,
        title: dto.title,
        description: dto.description,
        projectId: 'project-1',
      };

      const taskView = {
        id: taskId,
        title: dto.title,
      };

      (toUpdateTaskInput as jest.Mock).mockReturnValue(updateInput);
      tasksRepository.update.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.update(taskId, userId, dto);

      expect(taskAccessService.assertCanUpdate).toHaveBeenCalledWith(
        taskId,
        userId,
      );
      expect(toUpdateTaskInput).toHaveBeenCalledWith(dto);
      expect(tasksRepository.update).toHaveBeenCalledWith(taskId, updateInput);
      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'task.updated',
          taskId: task.id,
          updatedById: userId,
          projectId: task.projectId,
        },
        'Task updated successfully',
      );
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
    });
  });

  describe('findById', () => {
    it('checks read access, loads the task, and returns the mapped view', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';

      const task = {
        id: taskId,
        title: 'Task title',
        projectId: 'project-1',
      };

      const taskView = {
        id: taskId,
        title: 'Task title',
      };

      tasksRepository.findByIdOrThrow.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.findById(taskId, userId);

      expect(taskAccessService.assertCanRead).toHaveBeenCalledWith(
        taskId,
        userId,
      );
      expect(tasksRepository.findByIdOrThrow).toHaveBeenCalledWith(taskId);
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
    });
  });

  describe('findMany', () => {
    it('checks project read access and returns paginated mapped task views', async () => {
      const userId = 'user-1';

      const input: FindTasksInput = {
        projectId: 'project-1',
        page: 1,
        limit: 10,
      };

      const repositoryResult = {
        data: [
          { id: 'task-1', title: 'Task 1' },
          { id: 'task-2', title: 'Task 2' },
        ],
        total: 2,
        skip: 0,
        take: 10,
      };

      const mappedViews = [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' },
      ];

      tasksRepository.findMany.mockResolvedValue(repositoryResult);
      (toTaskViews as jest.Mock).mockReturnValue(mappedViews);

      const result = await service.findMany(userId, input);

      expect(taskAccessService.assertCanReadProject).toHaveBeenCalledWith(
        userId,
        input.projectId,
      );
      expect(tasksRepository.findMany).toHaveBeenCalledWith(input);
      expect(toTaskViews).toHaveBeenCalledWith(repositoryResult.data);
      expect(result).toEqual({
        ...repositoryResult,
        data: mappedViews,
      });
    });
  });

  describe('delete', () => {
    it('checks delete access, deletes the task, and logs success', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';

      await service.delete(taskId, userId);

      expect(taskAccessService.assertCanDelete).toHaveBeenCalledWith(
        taskId,
        userId,
      );
      expect(tasksRepository.delete).toHaveBeenCalledWith(taskId);
      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'task.deleted',
          taskId,
          deletedById: userId,
        },
        'Task deleted successfully',
      );
    });
  });

  describe('assignUser', () => {
    it('checks assign access, assigns the user, logs, and returns the mapped assignment view', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';
      const currentUserId = 'user-1';

      const assignment = {
        taskId,
        userId: assigneeUserId,
      };

      const assignmentView = {
        taskId,
        userId: assigneeUserId,
      };

      tasksRepository.assignUser.mockResolvedValue(assignment);
      (toTaskAssignmentView as jest.Mock).mockReturnValue(assignmentView);

      const result = await service.assignUser(
        taskId,
        assigneeUserId,
        currentUserId,
      );

      expect(taskAccessService.assertCanAssign).toHaveBeenCalledWith(
        taskId,
        currentUserId,
      );
      expect(tasksRepository.assignUser).toHaveBeenCalledWith(
        taskId,
        assigneeUserId,
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'task.assignee.added',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUserId,
        },
        'Task assignee added successfully',
      );
      expect(toTaskAssignmentView).toHaveBeenCalledWith(assignment);
      expect(result).toEqual(assignmentView);
    });
  });

  describe('unassignUser', () => {
    it('checks assign access, unassigns the user, and logs success', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';
      const currentUserId = 'user-1';

      await service.unassignUser(taskId, assigneeUserId, currentUserId);

      expect(taskAccessService.assertCanAssign).toHaveBeenCalledWith(
        taskId,
        currentUserId,
      );
      expect(tasksRepository.unassignUser).toHaveBeenCalledWith(
        taskId,
        assigneeUserId,
      );
      expect(logger.info).toHaveBeenCalledWith(
        {
          event: 'task.assignee.removed',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUserId,
        },
        'Task assignee removed successfully',
      );
    });
  });
});

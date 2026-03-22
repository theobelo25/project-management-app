import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { PinoLogger } from 'nestjs-pino';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { AuthUser, TaskAssignmentView, TaskView } from '@repo/types';
import {
  toCreateTaskInput,
  toTaskView,
  toTaskViews,
  toUpdateTaskInput,
} from './mappers/tasks.mapper';
import { toTaskAssignmentView } from './mappers/task-assignment.mapper';
import { TaskAssignmentNotifier } from './notifiers/task-assignment-notifier';
import { TaskAssigneePolicy } from './policies/task-assignee-policy';

jest.mock('./mappers/tasks.mapper', () => ({
  toCreateTaskInput: jest.fn(),
  toTaskView: jest.fn(),
  toTaskViews: jest.fn(),
  toUpdateTaskInput: jest.fn(),
}));

jest.mock('./mappers/task-assignment.mapper', () => ({
  toTaskAssignmentView: jest.fn(),
}));

const TASKS_LOG_CTX = { domain: 'tasks', component: 'TasksService' } as const;

describe('TasksService', () => {
  let service: TasksService;

  let tasksRepository: {
    create: jest.Mock;
    update: jest.Mock;
    findByIdOrThrow: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
    assignUser: jest.Mock;
    unassignUser: jest.Mock;
  };

  let taskAssigneePolicy: {
    assertAssigneeInSameOrgOrThrow: jest.Mock;
  };

  let taskAssignmentNotifier: {
    notifyTaskAssigned: jest.Mock;
  };

  let logger: {
    info: jest.Mock;
    warn: jest.Mock;
  };

  const currentUser: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    tasksRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findByIdOrThrow: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      assignUser: jest.fn(),
      unassignUser: jest.fn(),
    };

    taskAssigneePolicy = {
      assertAssigneeInSameOrgOrThrow: jest.fn(),
    };

    taskAssignmentNotifier = {
      notifyTaskAssigned: jest.fn(),
    };

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
    };

    service = new TasksService(
      tasksRepository as unknown as TasksRepository,
      taskAssigneePolicy as unknown as TaskAssigneePolicy,
      taskAssignmentNotifier as unknown as TaskAssignmentNotifier,
      logger as unknown as PinoLogger,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a task, logs, and returns mapped view', async () => {
      const dto: CreateTaskDto = {
        title: 'Build tests',
        description: 'Write unit tests for tasks service',
        projectId: 'project-1' as any,
      };

      const createInput = {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        createdById: currentUser.id,
      };

      const task = {
        id: 'task-1',
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        createdById: currentUser.id,
      };

      const taskView: TaskView = { id: 'task-1', title: dto.title } as TaskView;

      (toCreateTaskInput as jest.Mock).mockReturnValue(createInput);
      tasksRepository.create.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.create(currentUser, dto);

      expect(toCreateTaskInput).toHaveBeenCalledWith(dto, currentUser.id);
      expect(tasksRepository.create).toHaveBeenCalledWith(createInput);
      expect(logger.info).toHaveBeenCalledWith(
        {
          ...TASKS_LOG_CTX,
          event: 'task.created',
          taskId: task.id,
          createdById: task.createdById,
          projectId: task.projectId,
        },
        'Task created successfully',
      );
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
      expect(taskAssigneePolicy.assertAssigneeInSameOrgOrThrow).not.toHaveBeenCalled();
      expect(taskAssignmentNotifier.notifyTaskAssigned).not.toHaveBeenCalled();
    });

    it('validates assignees, notifies others on create when assigneeIds are set', async () => {
      const dto: CreateTaskDto = {
        title: 'T',
        projectId: 'project-1' as any,
        assigneeIds: ['user-2', 'user-1'],
      };

      const createInput = {
        title: dto.title,
        projectId: dto.projectId,
        createdById: currentUser.id,
        assigneeIds: ['user-2', 'user-1'],
      };

      const task = {
        id: 'task-1',
        title: dto.title,
        projectId: dto.projectId,
        createdById: currentUser.id,
      };

      const taskView: TaskView = { id: 'task-1', title: dto.title } as TaskView;

      (toCreateTaskInput as jest.Mock).mockReturnValue(createInput);
      tasksRepository.create.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.create(currentUser, dto);

      expect(taskAssigneePolicy.assertAssigneeInSameOrgOrThrow).toHaveBeenCalledTimes(
        2,
      );
      expect(taskAssigneePolicy.assertAssigneeInSameOrgOrThrow).toHaveBeenCalledWith(
        'user-2',
        currentUser,
      );
      expect(taskAssigneePolicy.assertAssigneeInSameOrgOrThrow).toHaveBeenCalledWith(
        'user-1',
        currentUser,
      );
      expect(taskAssignmentNotifier.notifyTaskAssigned).toHaveBeenCalledTimes(1);
      expect(taskAssignmentNotifier.notifyTaskAssigned).toHaveBeenCalledWith(
        'user-2',
        {
          taskId: task.id,
          taskTitle: task.title,
          projectId: task.projectId,
          assignedById: currentUser.id,
        },
      );
      expect(result).toEqual(taskView);
    });
  });

  describe('update', () => {
    it('updates a task, logs, and returns mapped view', async () => {
      const taskId = 'task-1';
      const dto: UpdateTaskDto = {
        title: 'Updated title',
        description: 'Updated description',
      } as UpdateTaskDto;

      const updateInput = { title: dto.title, description: dto.description };

      const task = {
        id: taskId,
        title: dto.title,
        description: dto.description,
        projectId: 'project-1',
      };

      const taskView: TaskView = { id: taskId, title: dto.title } as TaskView;

      (toUpdateTaskInput as jest.Mock).mockReturnValue(updateInput);
      tasksRepository.update.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.update(taskId, currentUser, dto);

      expect(toUpdateTaskInput).toHaveBeenCalledWith(dto);
      expect(tasksRepository.update).toHaveBeenCalledWith(taskId, updateInput);
      expect(logger.info).toHaveBeenCalledWith(
        {
          ...TASKS_LOG_CTX,
          event: 'task.updated',
          taskId: task.id,
          updatedById: currentUser.id,
          projectId: task.projectId,
        },
        'Task updated successfully',
      );
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
    });
  });

  describe('findById', () => {
    it('loads task and returns mapped view', async () => {
      const taskId = 'task-1';

      const task = { id: taskId, title: 'Task title', projectId: 'project-1' };
      const taskView: TaskView = {
        id: taskId,
        title: 'Task title',
      } as TaskView;

      tasksRepository.findByIdOrThrow.mockResolvedValue(task);
      (toTaskView as jest.Mock).mockReturnValue(taskView);

      const result = await service.findById(taskId, currentUser);

      expect(tasksRepository.findByIdOrThrow).toHaveBeenCalledWith(taskId);
      expect(toTaskView).toHaveBeenCalledWith(task);
      expect(result).toEqual(taskView);
    });
  });

  describe('findMany', () => {
    it('returns paginated mapped task views', async () => {
      const query: FindTasksQueryDto = {
        projectId: 'project-1' as any,
        page: 1,
        limit: 10,
      } as unknown as FindTasksQueryDto;

      const repositoryResult = {
        data: [{ id: 'task-1', title: 'Task 1' }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          pageCount: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      const mappedViews = [{ id: 'task-1', title: 'Task 1' }] as TaskView[];

      tasksRepository.findMany.mockResolvedValue(repositoryResult);
      (toTaskViews as jest.Mock).mockReturnValue(mappedViews);

      const result = await service.findMany(currentUser, query);

      expect(tasksRepository.findMany).toHaveBeenCalledWith({
        orgId: currentUser.orgId,
        ...query,
      });
      expect(toTaskViews).toHaveBeenCalledWith(repositoryResult.data);
      expect(result).toEqual({
        ...repositoryResult,
        data: mappedViews,
      });
    });
  });

  describe('delete', () => {
    it('deletes and logs success', async () => {
      const taskId = 'task-1';

      await service.delete(taskId, currentUser);

      expect(tasksRepository.delete).toHaveBeenCalledWith(taskId);
      expect(logger.info).toHaveBeenCalledWith(
        {
          ...TASKS_LOG_CTX,
          event: 'task.deleted',
          taskId,
          deletedById: currentUser.id,
        },
        'Task deleted successfully',
      );
    });
  });

  describe('assignUser', () => {
    it('validates assignee, assigns, notifies (on created), logs, and returns mapped view', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';

      const assignment = {
        taskId,
        userId: assigneeUserId,
        task: { title: 'Task title', projectId: 'project-1' },
      };

      const assignmentView: TaskAssignmentView = {
        taskId,
        userId: assigneeUserId,
      } as TaskAssignmentView;

      taskAssigneePolicy.assertAssigneeInSameOrgOrThrow.mockResolvedValue(
        undefined,
      );

      tasksRepository.assignUser.mockResolvedValue({
        assignment,
        created: true,
      });

      (toTaskAssignmentView as jest.Mock).mockReturnValue(assignmentView);

      const result = await service.assignUser(
        taskId,
        assigneeUserId,
        currentUser,
      );

      expect(
        taskAssigneePolicy.assertAssigneeInSameOrgOrThrow,
      ).toHaveBeenCalledWith(assigneeUserId, currentUser);

      expect(tasksRepository.assignUser).toHaveBeenCalledWith(
        taskId,
        assigneeUserId,
      );

      expect(taskAssignmentNotifier.notifyTaskAssigned).toHaveBeenCalledWith(
        assigneeUserId,
        {
          taskId,
          taskTitle: assignment.task.title,
          projectId: assignment.task.projectId,
          assignedById: currentUser.id,
        },
      );

      expect(logger.info).toHaveBeenCalledWith(
        {
          ...TASKS_LOG_CTX,
          event: 'task.assignee.added',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee added successfully',
      );

      expect(toTaskAssignmentView).toHaveBeenCalledWith(assignment);
      expect(result).toEqual(assignmentView);
    });

    it('does not notify or log when assignment already exists', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';

      const assignment = {
        taskId,
        userId: assigneeUserId,
        task: { title: 'Task title', projectId: 'project-1' },
      };

      const assignmentView: TaskAssignmentView = {
        taskId,
        userId: assigneeUserId,
      } as TaskAssignmentView;

      taskAssigneePolicy.assertAssigneeInSameOrgOrThrow.mockResolvedValue(
        undefined,
      );

      tasksRepository.assignUser.mockResolvedValue({
        assignment,
        created: false,
      });

      (toTaskAssignmentView as jest.Mock).mockReturnValue(assignmentView);

      const result = await service.assignUser(
        taskId,
        assigneeUserId,
        currentUser,
      );

      expect(taskAssignmentNotifier.notifyTaskAssigned).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
      expect(toTaskAssignmentView).toHaveBeenCalledWith(assignment);
      expect(result).toEqual(assignmentView);
    });
  });

  describe('unassignUser', () => {
    it('unassigns and logs success', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';

      tasksRepository.unassignUser.mockResolvedValue(1);

      await service.unassignUser(taskId, assigneeUserId, currentUser);

      expect(tasksRepository.unassignUser).toHaveBeenCalledWith(
        taskId,
        assigneeUserId,
      );

      expect(logger.info).toHaveBeenCalledWith(
        {
          ...TASKS_LOG_CTX,
          event: 'task.assignee.removed',
          taskId,
          userId: assigneeUserId,
          updatedById: currentUser.id,
        },
        'Task assignee removed successfully',
      );
    });

    it('does not log when assignment does not exist', async () => {
      const taskId = 'task-1';
      const assigneeUserId = 'user-2';

      tasksRepository.unassignUser.mockResolvedValue(0);

      await service.unassignUser(taskId, assigneeUserId, currentUser);

      expect(tasksRepository.unassignUser).toHaveBeenCalledWith(
        taskId,
        assigneeUserId,
      );

      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});

/**
 * Façade wiring only — business rules and side effects are covered in `use-cases/*.spec.ts`.
 */
import { TasksService } from './tasks.service';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { FindTasksUseCase } from './use-cases/find-tasks.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { AssignTaskUserUseCase } from './use-cases/assign-task-user.use-case';
import { UnassignTaskUserUseCase } from './use-cases/unassign-task-user.use-case';
import {
  AuthUser,
  TaskView,
  PaginationResult,
  TaskAssignmentView,
} from '@repo/types';
import type {
  CreateTaskCommand,
  FindTasksQueryCommand,
  UpdateTaskCommand,
} from './application/task-application.types';

describe('TasksService', () => {
  let service: TasksService;

  let createTaskUseCase: { execute: jest.Mock };
  let updateTaskUseCase: { execute: jest.Mock };
  let getTaskByIdUseCase: { execute: jest.Mock };
  let findTasksUseCase: { execute: jest.Mock };
  let deleteTaskUseCase: { execute: jest.Mock };
  let assignTaskUserUseCase: { execute: jest.Mock };
  let unassignTaskUserUseCase: { execute: jest.Mock };

  const currentUser: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    createTaskUseCase = { execute: jest.fn() };
    updateTaskUseCase = { execute: jest.fn() };
    getTaskByIdUseCase = { execute: jest.fn() };
    findTasksUseCase = { execute: jest.fn() };
    deleteTaskUseCase = { execute: jest.fn() };
    assignTaskUserUseCase = { execute: jest.fn() };
    unassignTaskUserUseCase = { execute: jest.fn() };

    service = new TasksService(
      createTaskUseCase as unknown as CreateTaskUseCase,
      updateTaskUseCase as unknown as UpdateTaskUseCase,
      getTaskByIdUseCase as unknown as GetTaskByIdUseCase,
      findTasksUseCase as unknown as FindTasksUseCase,
      deleteTaskUseCase as unknown as DeleteTaskUseCase,
      assignTaskUserUseCase as unknown as AssignTaskUserUseCase,
      unassignTaskUserUseCase as unknown as UnassignTaskUserUseCase,
    );
  });

  it('create delegates to CreateTaskUseCase', async () => {
    const command = {
      title: 'T',
      projectId: '550e8400-e29b-41d4-a716-446655440001',
    } as CreateTaskCommand;
    const view = { id: 'task-1' } as TaskView;
    createTaskUseCase.execute.mockResolvedValue(view);

    await expect(service.create(currentUser, command)).resolves.toBe(view);
    expect(createTaskUseCase.execute).toHaveBeenCalledWith(
      currentUser,
      command,
    );
  });

  it('update delegates to UpdateTaskUseCase', async () => {
    const command = { title: 'U' } as UpdateTaskCommand;
    const view = { id: 'task-1' } as TaskView;
    updateTaskUseCase.execute.mockResolvedValue(view);

    await expect(service.update('task-1', currentUser, command)).resolves.toBe(
      view,
    );
    expect(updateTaskUseCase.execute).toHaveBeenCalledWith(
      'task-1',
      currentUser,
      command,
    );
  });

  it('findById delegates to GetTaskByIdUseCase', async () => {
    const view = { id: 'task-1' } as TaskView;
    getTaskByIdUseCase.execute.mockResolvedValue(view);

    await expect(service.findById('task-1', currentUser)).resolves.toBe(view);
    expect(getTaskByIdUseCase.execute).toHaveBeenCalledWith(
      'task-1',
      currentUser,
    );
  });

  it('findMany delegates to FindTasksUseCase', async () => {
    const query = {
      projectId: '550e8400-e29b-41d4-a716-446655440001',
      page: 1,
      limit: 10,
    } as FindTasksQueryCommand;
    const result = {
      data: [],
      meta: {},
    } as unknown as PaginationResult<TaskView>;
    findTasksUseCase.execute.mockResolvedValue(result);

    await expect(service.findMany(currentUser, query)).resolves.toBe(result);
    expect(findTasksUseCase.execute).toHaveBeenCalledWith(currentUser, query);
  });

  it('delete delegates to DeleteTaskUseCase', async () => {
    deleteTaskUseCase.execute.mockResolvedValue(undefined);

    await expect(
      service.delete('task-1', currentUser),
    ).resolves.toBeUndefined();
    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith(
      'task-1',
      currentUser,
    );
  });

  it('assignUser delegates to AssignTaskUserUseCase', async () => {
    const view = { taskId: 't1', userId: 'u2' } as TaskAssignmentView;
    assignTaskUserUseCase.execute.mockResolvedValue(view);

    await expect(
      service.assignUser('task-1', 'user-2', currentUser),
    ).resolves.toBe(view);
    expect(assignTaskUserUseCase.execute).toHaveBeenCalledWith(
      'task-1',
      'user-2',
      currentUser,
    );
  });

  it('unassignUser delegates to UnassignTaskUserUseCase', async () => {
    unassignTaskUserUseCase.execute.mockResolvedValue(undefined);

    await expect(
      service.unassignUser('task-1', 'user-2', currentUser),
    ).resolves.toBeUndefined();
    expect(unassignTaskUserUseCase.execute).toHaveBeenCalledWith(
      'task-1',
      'user-2',
      currentUser,
    );
  });
});

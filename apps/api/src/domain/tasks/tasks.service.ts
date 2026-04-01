import { Injectable } from '@nestjs/common';
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
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.use-case';
import { FindTasksUseCase } from './use-cases/find-tasks.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';
import { AssignTaskUserUseCase } from './use-cases/assign-task-user.use-case';
import { UnassignTaskUserUseCase } from './use-cases/unassign-task-user.use-case';

/**
 * Application façade over task use cases. Keeps a single injectable for controllers/tests.
 *
 * SECURITY INVARIANT
 * ------------------
 * Use cases do NOT re-check authorization on every call.
 * Authorization is enforced at the HTTP boundary by `TasksController` + `TaskAccessGuard`
 * via `@RequireTaskAccess(...)` metadata.
 *
 * MUST NOT call these methods from non-HTTP code paths (or from other modules)
 * without an explicit authorization check.
 */
@Injectable()
export class TasksService {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly findTasksUseCase: FindTasksUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly assignTaskUserUseCase: AssignTaskUserUseCase,
    private readonly unassignTaskUserUseCase: UnassignTaskUserUseCase,
  ) {}

  create(user: AuthUser, command: CreateTaskCommand): Promise<TaskView> {
    return this.createTaskUseCase.execute(user, command);
  }

  update(
    taskId: string,
    user: AuthUser,
    command: UpdateTaskCommand,
  ): Promise<TaskView> {
    return this.updateTaskUseCase.execute(taskId, user, command);
  }

  findById(taskId: string, user: AuthUser): Promise<TaskView> {
    return this.getTaskByIdUseCase.execute(taskId, user);
  }

  findMany(
    user: AuthUser,
    query: FindTasksQueryCommand,
  ): Promise<PaginationResult<TaskView>> {
    return this.findTasksUseCase.execute(user, query);
  }

  delete(taskId: string, user: AuthUser): Promise<void> {
    return this.deleteTaskUseCase.execute(taskId, user);
  }

  assignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<TaskAssignmentView> {
    return this.assignTaskUserUseCase.execute(
      taskId,
      assigneeUserId,
      currentUser,
    );
  }

  unassignUser(
    taskId: string,
    assigneeUserId: string,
    currentUser: AuthUser,
  ): Promise<void> {
    return this.unassignTaskUserUseCase.execute(
      taskId,
      assigneeUserId,
      currentUser,
    );
  }
}

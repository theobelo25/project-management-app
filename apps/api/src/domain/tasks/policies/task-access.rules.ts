import { ProjectRole } from '@repo/database';
import { TaskAccessContext } from '../types/tasks.repository.types';

/** Pure policy helpers — no DI / infrastructure. */
export class TaskAccessRules {
  canReadProject(role: ProjectRole | null | undefined): boolean {
    return !!role;
  }

  canCreateProject(role: ProjectRole | null | undefined): boolean {
    return (
      role === ProjectRole.OWNER ||
      role === ProjectRole.ADMIN ||
      role === ProjectRole.MEMBER
    );
  }

  canReadTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;
    return !!task.project.currentUserRole;
  }

  canUpdateTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;
    if (task.project.currentUserRole === ProjectRole.ADMIN) return true;
    if (task.assignees.some((assignee) => assignee.userId === userId))
      return true;
    return false;
  }

  canDeleteTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;
    if (task.project.currentUserRole === ProjectRole.ADMIN) return true;
    if (task.createdById === userId) return true;
    return false;
  }

  canManageTask(task: TaskAccessContext, userId: string): boolean {
    if (task.project.ownerId === userId) return true;
    return task.project.currentUserRole === ProjectRole.ADMIN;
  }

  canUnassignOwnTask(task: TaskAccessContext, userId: string): boolean {
    return task.assignees.some((assignee) => assignee.userId === userId);
  }
}

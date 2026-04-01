import type {
  TaskAssignmentPersistenceResult,
  TaskAssigneeWithUserAndTaskInfo,
  TaskWithAssignees,
} from '../types/tasks.repository.types';
import type {
  TaskAssignmentResultEntity,
  TaskAssignmentWithContextEntity,
  TaskAssigneeEntity,
  TaskEntity,
} from '../domain/task.entity';

function mapAssignee(
  a: TaskWithAssignees['assignees'][number],
): TaskAssigneeEntity {
  return {
    userId: a.userId,
    assignedAt: a.assignedAt,
    user: {
      id: a.user.id,
      name: a.user.name,
      email: a.user.email,
    },
  };
}

export function mapTaskWithAssigneesToEntity(
  row: TaskWithAssignees,
): TaskEntity {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    labelColor: row.labelColor,
    dueDate: row.dueDate,
    position: row.position,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdById: row.createdById,
    assignees: row.assignees.map(mapAssignee),
  };
}

export function mapTaskListToEntities(rows: TaskWithAssignees[]): TaskEntity[] {
  return rows.map(mapTaskWithAssigneesToEntity);
}

function mapAssignmentPersistenceToEntity(
  assignment: TaskAssigneeWithUserAndTaskInfo,
): TaskAssignmentWithContextEntity {
  return {
    taskId: assignment.taskId,
    userId: assignment.userId,
    assignedAt: assignment.assignedAt,
    user: {
      id: assignment.user.id,
      name: assignment.user.name,
      email: assignment.user.email,
    },
    task: {
      title: assignment.task.title,
      projectId: assignment.task.projectId,
    },
  };
}

export function mapTaskAssignmentPersistenceToEntity(
  result: TaskAssignmentPersistenceResult,
): TaskAssignmentResultEntity {
  return {
    assignment: mapAssignmentPersistenceToEntity(result.assignment),
    created: result.created,
  };
}

import { TASK_DOMAIN_EVENT_VERSION } from './task-domain.events';
import type {
  TaskAssigneeAddedEvent,
  TaskAssigneeRemovedEvent,
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from './task-domain.events';

export function buildTaskCreatedEvent(params: {
  taskId: string;
  projectId: string;
  taskTitle: string;
  createdById: string;
  assigneeUserIdsToNotify: readonly string[];
}): TaskCreatedEvent {
  return {
    _tag: 'TaskCreated',
    version: TASK_DOMAIN_EVENT_VERSION,
    taskId: params.taskId,
    projectId: params.projectId,
    taskTitle: params.taskTitle,
    createdById: params.createdById,
    assigneeUserIdsToNotify: [...params.assigneeUserIdsToNotify],
  };
}

export function buildTaskUpdatedEvent(params: {
  taskId: string;
  projectId: string;
  taskTitle: string;
  updatedById: string;
  changedFieldKeys: readonly string[];
}): TaskUpdatedEvent {
  return {
    _tag: 'TaskUpdated',
    version: TASK_DOMAIN_EVENT_VERSION,
    taskId: params.taskId,
    projectId: params.projectId,
    taskTitle: params.taskTitle,
    updatedById: params.updatedById,
    changedFieldKeys: [...params.changedFieldKeys],
  };
}

export function buildTaskDeletedEvent(params: {
  taskId: string;
  projectId: string;
  updatedById: string;
}): TaskDeletedEvent {
  return {
    _tag: 'TaskDeleted',
    version: TASK_DOMAIN_EVENT_VERSION,
    taskId: params.taskId,
    projectId: params.projectId,
    updatedById: params.updatedById,
  };
}

export function buildTaskAssigneeAddedEvent(params: {
  taskId: string;
  projectId: string;
  taskTitle: string;
  assigneeUserId: string;
  updatedById: string;
  notifyAssignee: boolean;
}): TaskAssigneeAddedEvent {
  return {
    _tag: 'TaskAssigneeAdded',
    version: TASK_DOMAIN_EVENT_VERSION,
    taskId: params.taskId,
    projectId: params.projectId,
    taskTitle: params.taskTitle,
    assigneeUserId: params.assigneeUserId,
    updatedById: params.updatedById,
    notifyAssignee: params.notifyAssignee,
  };
}

export function buildTaskAssigneeRemovedEvent(params: {
  taskId: string;
  projectId: string;
  assigneeUserId: string;
  updatedById: string;
}): TaskAssigneeRemovedEvent {
  return {
    _tag: 'TaskAssigneeRemoved',
    version: TASK_DOMAIN_EVENT_VERSION,
    taskId: params.taskId,
    projectId: params.projectId,
    assigneeUserId: params.assigneeUserId,
    updatedById: params.updatedById,
  };
}

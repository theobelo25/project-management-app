/**
 * Domain-flavored task lifecycle events. No Nest or persistence imports.
 * Published after successful repository operations (application layer).
 */
export const TASK_DOMAIN_EVENT_VERSION = 1 as const;

export type TaskDomainEvent =
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent
  | TaskAssigneeAddedEvent
  | TaskAssigneeRemovedEvent;

export interface TaskCreatedEvent {
  readonly _tag: 'TaskCreated';
  readonly version: typeof TASK_DOMAIN_EVENT_VERSION;
  readonly taskId: string;
  readonly projectId: string;
  readonly taskTitle: string;
  readonly createdById: string;
  /** Assignees who should receive assignment notifications (excludes creator). */
  readonly assigneeUserIdsToNotify: readonly string[];
}

export interface TaskUpdatedEvent {
  readonly _tag: 'TaskUpdated';
  readonly version: typeof TASK_DOMAIN_EVENT_VERSION;
  readonly taskId: string;
  readonly projectId: string;
  readonly taskTitle: string;
  readonly updatedById: string;
  /** Keys from the update DTO / repository input (before human label mapping). */
  readonly changedFieldKeys: readonly string[];
}

export interface TaskDeletedEvent {
  readonly _tag: 'TaskDeleted';
  readonly version: typeof TASK_DOMAIN_EVENT_VERSION;
  readonly taskId: string;
  readonly projectId: string;
  readonly updatedById: string;
}

export interface TaskAssigneeAddedEvent {
  readonly _tag: 'TaskAssigneeAdded';
  readonly version: typeof TASK_DOMAIN_EVENT_VERSION;
  readonly taskId: string;
  readonly projectId: string;
  readonly taskTitle: string;
  readonly assigneeUserId: string;
  readonly updatedById: string;
  readonly notifyAssignee: boolean;
}

export interface TaskAssigneeRemovedEvent {
  readonly _tag: 'TaskAssigneeRemoved';
  readonly version: typeof TASK_DOMAIN_EVENT_VERSION;
  readonly taskId: string;
  readonly projectId: string;
  readonly assigneeUserId: string;
  readonly updatedById: string;
}

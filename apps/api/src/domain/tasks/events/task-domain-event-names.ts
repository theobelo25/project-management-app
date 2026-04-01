/**
 * Stable event channel names for in-process domain events (Tier C).
 * Not to be confused with Socket.IO event names in realtime.events.ts.
 */
export const TASK_DOMAIN_EVENT_NAME = {
  TaskCreated: 'task.domain.TaskCreated',
  TaskUpdated: 'task.domain.TaskUpdated',
  TaskDeleted: 'task.domain.TaskDeleted',
  TaskAssigneeAdded: 'task.domain.TaskAssigneeAdded',
  TaskAssigneeRemoved: 'task.domain.TaskAssigneeRemoved',
} as const;

export type TaskDomainEventName =
  (typeof TASK_DOMAIN_EVENT_NAME)[keyof typeof TASK_DOMAIN_EVENT_NAME];

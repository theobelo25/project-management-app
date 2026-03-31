import type { TaskAssignedNotificationPayload } from './notifications.payloads';
import type { TaskUpdatedNotificationPayload } from './notifications.payloads';
import type { ProjectMemberAddedNotificationPayload } from './notifications.payloads';
import type { ProjectMemberRemovedNotificationPayload } from './notifications.payloads';
import type { ProjectMemberRoleChangedNotificationPayload } from './notifications.payloads';

export const NOTIFICATION_TEMPLATES = {
  task_assigned: {
    title: 'You were assigned a task',
    getBody: (payload: TaskAssignedNotificationPayload) => payload.taskTitle,
  },
  task_updated: {
    title: 'A task was updated',
    getBody: (payload: TaskUpdatedNotificationPayload) =>
      `${payload.taskTitle} | Updated: ${payload.changedFields.join(', ')}`,
  },
  project_member_added: {
    title: 'You were added to a project',
    getBody: (payload: ProjectMemberAddedNotificationPayload) =>
      `Project ID: ${payload.projectId}`,
  },
  project_member_removed: {
    title: 'You were removed from a project',
    getBody: (payload: ProjectMemberRemovedNotificationPayload) =>
      `Project ID: ${payload.projectId}`,
  },
  project_member_role_changed: {
    title: 'Your project role changed',
    getBody: (payload: ProjectMemberRoleChangedNotificationPayload) =>
      `Project ID: ${payload.projectId} | New role: ${payload.newRole}`,
  },
};

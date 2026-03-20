import type { TaskAssignedNotificationPayload } from './notifications.payloads';

export const NOTIFICATION_TEMPLATES = {
  task_assigned: {
    title: 'You were assigned a task',
    getBody: (payload: TaskAssignedNotificationPayload) => payload.taskTitle,
  },
};

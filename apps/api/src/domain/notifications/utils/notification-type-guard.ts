import type { NotificationType } from '@repo/types';

export const isNotificationType = (type: string): type is NotificationType =>
  type === 'task_assigned';

import type { NotificationType } from '@repo/types';

export const isNotificationType = (type: string): type is NotificationType =>
  type === 'task_assigned' ||
  type === 'task_updated' ||
  type === 'project_member_added' ||
  type === 'project_member_removed' ||
  type === 'project_member_role_changed';

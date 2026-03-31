export type TaskAssignedNotificationPayload = {
  taskId: string;
  taskTitle: string;
  projectId: string;
  assignedById: string;
};

export type TaskUpdatedNotificationPayload = {
  taskId: string;
  taskTitle: string;
  projectId: string;
  updatedById: string;
  changedFields: string[];
};

export type ProjectMemberAddedNotificationPayload = {
  projectId: string;
  addedById: string;
};

export type ProjectMemberRemovedNotificationPayload = {
  projectId: string;
  removedById: string;
};

export type ProjectMemberRoleChangedNotificationPayload = {
  projectId: string;
  changedById: string;
  newRole: 'ADMIN' | 'MEMBER';
};

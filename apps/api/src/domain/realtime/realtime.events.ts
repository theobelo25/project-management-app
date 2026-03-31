export const REALTIME_ROOM_PREFIX = {
  user: 'user',
  org: 'org',
  project: 'project',
  task: 'task',
} as const;

export const REALTIME_EVENT = {
  connected: 'realtime.connected',
  notificationCreated: 'notification.created',
  notificationCleared: 'notification.cleared',
  inviteCreated: 'invite.created',
  inviteAccepted: 'invite.accepted',
  inviteDeclined: 'invite.declined',
  inviteRevoked: 'invite.revoked',
  taskCreated: 'task.created',
  taskUpdated: 'task.updated',
  taskDeleted: 'task.deleted',
  taskAssigneeAdded: 'task.assignee.added',
  taskAssigneeRemoved: 'task.assignee.removed',
  projectMemberAdded: 'project.member.added',
  projectMemberRemoved: 'project.member.removed',
  projectMemberRoleUpdated: 'project.member.role.updated',
} as const;

export const realtimeRoom = {
  user: (userId: string) => `${REALTIME_ROOM_PREFIX.user}:${userId}`,
  org: (orgId: string) => `${REALTIME_ROOM_PREFIX.org}:${orgId}`,
  project: (projectId: string) =>
    `${REALTIME_ROOM_PREFIX.project}:${projectId}`,
  task: (taskId: string) => `${REALTIME_ROOM_PREFIX.task}:${taskId}`,
};

export type RealtimeEnvelope<
  TPayload extends object = Record<string, unknown>,
> = TPayload & {
  emittedAt: string;
};

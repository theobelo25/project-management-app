export const LogEvents = {
  auth: {
    signupSucceeded: "auth.signup.succeeded",
    loginSucceeded: "auth.login.succeeded",
    loginFailed: "auth.login.failed",
    logoutSucceeded: "auth.logout.succeeded",
    refreshSucceeded: "auth.refresh.succeeded",
    refreshFailed: "auth.refresh.failed",
  },
  project: {
    created: "project.created",
    updated: "project.updated",
    archived: "project.archived",
    unarchived: "project.unarchived",
    deleted: "project.deleted",
  },
  task: {
    created: "task.created",
    updated: "task.updated",
    deleted: "task.deleted",
    assigneeAdded: "task.assignee.added",
    assigneeRemoved: "task.assignee.removed",
  },
} as const;

type Values<T> = T extends object ? Values<T[keyof T]> : T;
export type LogEvent = Values<typeof LogEvents>;

export type LogMetaBase = {
  event?: LogEvent;
  requestId?: string;
  orgId?: string;
  userId?: string;
  projectId?: string;
  taskId?: string;
};

export declare const LogEvents: {
    readonly auth: {
        readonly signupSucceeded: "auth.signup.succeeded";
        readonly loginSucceeded: "auth.login.succeeded";
        readonly loginFailed: "auth.login.failed";
        readonly logoutSucceeded: "auth.logout.succeeded";
        readonly refreshSucceeded: "auth.refresh.succeeded";
        readonly refreshFailed: "auth.refresh.failed";
    };
    readonly project: {
        readonly created: "project.created";
        readonly updated: "project.updated";
        readonly archived: "project.archived";
        readonly unarchived: "project.unarchived";
        readonly deleted: "project.deleted";
    };
    readonly task: {
        readonly created: "task.created";
        readonly updated: "task.updated";
        readonly deleted: "task.deleted";
        readonly assigneeAdded: "task.assignee.added";
        readonly assigneeRemoved: "task.assignee.removed";
    };
};
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
export {};

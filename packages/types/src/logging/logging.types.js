"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogEvents = void 0;
exports.LogEvents = {
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
};
//# sourceMappingURL=logging.types.js.map
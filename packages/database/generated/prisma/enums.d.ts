export declare const ProjectRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];
export declare const TaskStatus: {
    readonly TODO: "TODO";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly REVIEW: "REVIEW";
    readonly DONE: "DONE";
};
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export declare const TaskPriority: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
export declare const OrganizationRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type OrganizationRole = (typeof OrganizationRole)[keyof typeof OrganizationRole];

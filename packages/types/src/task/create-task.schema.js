"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskSchema = void 0;
const zod_1 = require("zod");
const task_status_schema_1 = require("./task-status.schema");
const task_priority_schema_1 = require("./task-priority.schema");
exports.CreateTaskSchema = zod_1.z.object({
    projectId: zod_1.z.uuid(),
    title: zod_1.z.string().min(1, "Title is required").max(255),
    description: zod_1.z.string().max(5000).nullable().optional(),
    status: task_status_schema_1.TaskStatusSchema.optional(),
    priority: task_priority_schema_1.TaskPrioritySchema.optional(),
    dueDate: zod_1.z.iso.datetime().optional().nullable(),
    position: zod_1.z.number().int().nonnegative().optional(),
    assigneeIds: zod_1.z.array(zod_1.z.uuid()).optional(),
});
//# sourceMappingURL=create-task.schema.js.map
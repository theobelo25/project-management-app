"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskSchema = void 0;
const zod_1 = require("zod");
const task_status_schema_1 = require("./task-status.schema");
const task_priority_schema_1 = require("./task-priority.schema");
exports.UpdateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title cannot be empty").max(255).optional(),
    description: zod_1.z.string().trim().max(5000).nullable().optional(),
    status: task_status_schema_1.TaskStatusSchema.optional(),
    priority: task_priority_schema_1.TaskPrioritySchema.optional(),
    dueDate: zod_1.z.preprocess((val) => (val instanceof Date ? val.toISOString() : val), zod_1.z
        .union([
        zod_1.z.string().datetime(),
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        zod_1.z.literal(""),
    ])
        .optional()
        .nullable()
        .transform((val) => {
        if (val === undefined)
            return undefined;
        if (val === null)
            return null;
        if (val === "")
            return null;
        const date = new Date(val.length === 10 ? `${val}T12:00:00.000Z` : val);
        return Number.isNaN(date.getTime()) ? undefined : date;
    })),
    position: zod_1.z.number().int().nonnegative().optional(),
});
//# sourceMappingURL=update-task.schema.js.map
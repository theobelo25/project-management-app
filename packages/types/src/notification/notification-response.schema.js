"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationViewSchema = exports.NotificationTypeSchema = void 0;
const zod_1 = require("zod");
exports.NotificationTypeSchema = zod_1.z.enum(["task_assigned"]);
exports.NotificationViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: exports.NotificationTypeSchema,
    title: zod_1.z.string(),
    body: zod_1.z.string().nullable().optional(),
    meta: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).nullable().optional(),
    createdAt: zod_1.z.string().datetime(),
});
//# sourceMappingURL=notification-response.schema.js.map
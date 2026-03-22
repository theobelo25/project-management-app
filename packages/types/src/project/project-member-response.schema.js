"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMembersViewSchema = exports.ProjectMemberViewSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
exports.ProjectMemberViewSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    role: project_role_schema_1.ProjectRoleSchema,
    joinedAt: zod_1.z.string().datetime(),
});
exports.ProjectMembersViewSchema = zod_1.z.object({
    items: zod_1.z.array(exports.ProjectMemberViewSchema),
});
//# sourceMappingURL=project-member-response.schema.js.map
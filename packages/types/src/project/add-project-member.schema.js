"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProjectMemberSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
exports.AddProjectMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().trim().min(1, "User id is required"),
    role: project_role_schema_1.ProjectRoleSchema.exclude(["OWNER"]).default("MEMBER"),
});
//# sourceMappingURL=add-project-member.schema.js.map
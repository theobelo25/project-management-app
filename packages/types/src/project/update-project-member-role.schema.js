"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectMemberRoleSchema = void 0;
const zod_1 = require("zod");
const project_role_schema_1 = require("./project-role.schema");
exports.UpdateProjectMemberRoleSchema = zod_1.z.object({
    role: project_role_schema_1.ProjectRoleSchema.exclude(["OWNER"]),
});
//# sourceMappingURL=update-project-member-role.schema.js.map
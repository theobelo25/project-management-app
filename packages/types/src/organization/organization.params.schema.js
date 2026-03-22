"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMemberParamsSchema = exports.InviteIdParamsSchema = exports.SwitchOrganizationParamsSchema = exports.OrganizationParamsSchema = void 0;
const zod_1 = require("zod");
const uuid_id_param_schema_1 = require("../common/uuid-id-param.schema");
exports.OrganizationParamsSchema = uuid_id_param_schema_1.UuidIdParamSchema;
exports.SwitchOrganizationParamsSchema = uuid_id_param_schema_1.UuidIdParamSchema;
exports.InviteIdParamsSchema = uuid_id_param_schema_1.UuidIdParamSchema;
exports.OrganizationMemberParamsSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    memberId: zod_1.z.uuid(),
});
//# sourceMappingURL=organization.params.schema.js.map
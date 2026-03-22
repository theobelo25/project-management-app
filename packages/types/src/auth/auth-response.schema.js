"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSessionSchema = void 0;
const zod_1 = require("zod");
const user_response_schema_1 = require("../user/user-response.schema");
exports.AuthSessionSchema = zod_1.z.object({
    user: user_response_schema_1.UserViewSchema,
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
});
//# sourceMappingURL=auth-response.schema.js.map
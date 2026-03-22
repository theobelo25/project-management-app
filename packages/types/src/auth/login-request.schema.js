"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestSchema = void 0;
const zod_1 = require("zod");
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(72),
});
//# sourceMappingURL=login-request.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetUsersQuerySchema = zod_1.z.object({
    search: zod_1.z
        .string()
        .optional()
        .transform((s) => (typeof s === "string" ? s.trim() || undefined : s)),
});
//# sourceMappingURL=get-users-query.schema.js.map